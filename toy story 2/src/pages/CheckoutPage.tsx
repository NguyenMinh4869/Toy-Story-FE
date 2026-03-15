import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import { formatPrice } from '../utils/formatPrice'
import { checkout, createPayment, validateVoucher } from '../services/checkoutService'
import { ShoppingBag, ArrowLeft, CreditCard, Loader2, Ticket } from 'lucide-react'
import { ROUTES } from '../routes/routePaths'

interface CheckoutFormData {
    name: string
    phoneNumber: string
    email: string
    address: string
    notes: string
}

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate()
    const { cartItems, getTotalPrice, clearCart } = useCart()
    const { user } = useAuth()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [voucherCode, setVoucherCode] = useState('')
    const [isValidatingVoucher, setIsValidatingVoucher] = useState(false)
    const [voucherError, setVoucherError] = useState<string | null>(null)
    const [voucherData, setVoucherData] = useState<{ name: string; totalDiscount: number; finalAmount: number } | null>(null)

    // Form state
    const [formData, setFormData] = useState<CheckoutFormData>({
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        notes: ''
    })

    // Update form if user data loads
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || user.name || '',
                email: prev.email || user.email || '',
                phoneNumber: prev.phoneNumber || user.phoneNumber || '',
                address: prev.address || user.address || ''
            }))
        }
    }, [user])

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0 && !isSubmitting) {
            const timer = setTimeout(() => {
                if (cartItems.length === 0) navigate(ROUTES.HOME)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [cartItems, navigate, isSubmitting])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return

        setIsValidatingVoucher(true)
        setVoucherError(null)

        try {
            const result = await validateVoucher(voucherCode.trim())
            setVoucherData({
                name: result.discounts?.[0]?.name || 'Voucher',
                totalDiscount: result.totalDiscount,
                finalAmount: result.finalAmount
            })
            // Clear API error if previously set
            setError(null)
        } catch (err: any) {
            console.error('Voucher validation error:', err)
            const detailMsg = err.response?.data?.message || err.message || 'Mã voucher không hợp lệ'
            setVoucherError(detailMsg)
            setVoucherData(null)
        } finally {
            setIsValidatingVoucher(false)
        }
    }

    const handleCheckout = async (e: React.FormEvent) => {
        if (e && e.preventDefault) e.preventDefault()

        if (cartItems.length === 0) return

        // Basic validation
        if (!formData.name || !formData.phoneNumber || !formData.address) {
            setError('Vui lòng nhập đầy đủ thông tin giao hàng (Họ tên, SĐT, Địa chỉ).')
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            // 1. Perform checkout (POST /api/checkout)
            const payload = voucherData && voucherCode.trim()
                ? { voucherCode: voucherCode.trim() }
                : undefined

            const checkoutResult = await checkout(payload)

            const invoiceId = checkoutResult?.invoiceId

            if (!invoiceId) {
                throw new Error('Không thể tạo hóa đơn thanh toán. Vui lòng liên hệ hỗ trợ.')
            }

            // 2. Create payment link (POST /api/payments/create)
            const paymentResult = await createPayment(invoiceId)

            // 3. Clear local cart
            clearCart()

            // 4. Redirect to PayOS
            if (paymentResult?.checkoutUrl) {
                window.location.href = paymentResult.checkoutUrl
            } else {
                throw new Error('Không nhận được liên kết thanh toán từ PayOS.')
            }
        } catch (err: any) {
            console.error('Checkout error:', err)
            const detailMsg = err.errors ? Object.values(err.errors).flat().join(', ') : ''
            setError(detailMsg || err.message || 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.')
            setIsSubmitting(false)
        }
    }

    if (cartItems.length === 0 && !isSubmitting) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                    <ShoppingBag size={48} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-tilt-warp text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h2>
                <p className="text-gray-600 mb-8">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
                <button
                    onClick={() => navigate(ROUTES.PRODUCTS)}
                    className="bg-red-600 text-white px-8 py-3 rounded-full font-reddit-sans hover:bg-red-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        )
    }

    return (
        <div className="bg-[#fff9fa] min-h-screen py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
                    >
                        <ArrowLeft size={24} className="text-gray-700" />
                    </button>
                    <h1 className="text-3xl font-tilt-warp text-gray-900">Thanh toán</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-red-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <span className="text-red-600 font-bold">1</span>
                                </div>
                                <h2 className="text-xl font-tilt-warp text-gray-800">Thông tin giao hàng</h2>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleCheckout}>
                                <div className="space-y-2">
                                    <label className="text-sm font-reddit-sans font-medium text-gray-600 ml-1">Họ và tên *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-reddit-sans"
                                        placeholder="Nguyễn Văn A"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-reddit-sans font-medium text-gray-600 ml-1">Số điện thoại *</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-reddit-sans"
                                        placeholder="09xx xxx xxx"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-reddit-sans font-medium text-gray-600 ml-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-reddit-sans"
                                        placeholder="example@mail.com"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-reddit-sans font-medium text-gray-600 ml-1">Địa chỉ nhận hàng *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-reddit-sans"
                                        placeholder="Số nhà, tên đường, phường/xã..."
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-reddit-sans font-medium text-gray-600 ml-1">Ghi chú (Tùy chọn)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none transition-all font-reddit-sans resize-none"
                                        placeholder="Giao vào giờ hành chính, gọi trước khi đến..."
                                    />
                                </div>
                            </form>
                        </section>

                        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-red-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <span className="text-red-600 font-bold">2</span>
                                </div>
                                <h2 className="text-xl font-tilt-warp text-gray-800">Kiểm tra sản phẩm</h2>
                            </div>

                            <div className="space-y-4">
                                {cartItems.map((item, index) => (
                                    <div key={index} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <img
                                            src={item.product.imageUrl || ''}
                                            alt={item.product.name || ''}
                                            className="w-20 h-20 rounded-xl object-cover bg-gray-100 border border-gray-200"
                                        />
                                        <div className="flex-1 min-w-0 py-1">
                                            <h3 className="font-reddit-sans font-bold text-gray-800 line-clamp-1">{item.product.name}</h3>
                                            <p className="text-sm text-gray-500 mb-2">Số lượng: {item.quantity}</p>
                                            <p className="font-tilt-warp text-red-600">{formatPrice((item.product.price || 0) * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-red-50 relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-50 rounded-full opacity-50 blur-3xl pointer-events-none"></div>

                                <h2 className="text-xl font-tilt-warp text-gray-800 mb-6 flex items-center gap-2">
                                    <ShoppingBag size={20} className="text-red-500" />
                                    Tổng kết đơn hàng
                                </h2>

                                <div className="space-y-4 font-reddit-sans">
                                    {/* Voucher Section */}
                                    <div className="pt-2 pb-4 border-b border-gray-100">
                                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Ticket size={16} className="text-gray-500" /> Mã giảm giá
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={voucherCode}
                                                onChange={(e) => setVoucherCode(e.target.value)}
                                                placeholder="Nhập mã voucher"
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-red-400 focus:ring-2 focus:ring-red-50 outline-none transition-all uppercase"
                                                disabled={isSubmitting || isValidatingVoucher}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleApplyVoucher}
                                                disabled={isSubmitting || isValidatingVoucher || !voucherCode.trim()}
                                                className={`px-4 py-2 font-medium rounded-xl transition-all whitespace-nowrap ${!voucherCode.trim() || isValidatingVoucher
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-gray-800 text-white hover:bg-gray-900 active:scale-95'}`}
                                            >
                                                {isValidatingVoucher ? <Loader2 size={20} className="animate-spin" /> : 'Áp dụng'}
                                            </button>
                                        </div>
                                        {voucherError && (
                                            <p className="text-red-500 text-sm mt-2">{voucherError}</p>
                                        )}
                                    </div>

                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính</span>
                                        <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                                    </div>

                                    {voucherData && (
                                        <div className="flex justify-between text-green-600">
                                            <span className="flex flex-col">
                                                <span>Voucher áp dụng</span>
                                                <span className="text-xs text-green-500">{voucherData.name}</span>
                                            </span>
                                            <span className="font-medium">- {formatPrice(voucherData.totalDiscount)}</span>
                                        </div>
                                    )}

                                    <div className="h-px bg-gray-100 my-2"></div>
                                    <div className="flex justify-between text-lg font-bold text-gray-900">
                                        <span>Tổng tiền</span>
                                        <span className="text-red-600 text-2xl font-tilt-warp">
                                            {formatPrice(voucherData ? voucherData.finalAmount : getTotalPrice())}
                                        </span>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mt-4 animate-in fade-in slide-in-from-top-1">
                                            {error}
                                        </div>
                                    )}

                                    <div className="pt-6">
                                        <button
                                            disabled={isSubmitting}
                                            onClick={handleCheckout}
                                            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${isSubmitting
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 size={24} className="animate-spin" />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard size={24} />
                                                    Thanh toán ngay (PayOS)
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <div className="p-2 bg-green-50 rounded-full">
                                            <CreditCard size={14} className="text-green-600" />
                                        </div>
                                        <p>Thanh toán an toàn qua cổng PayOS với mã QR hoặc chuyển khoản ngân hàng.</p>
                                    </div>
                                </div>
                            </section>

                            <button
                                onClick={() => navigate(ROUTES.HOME)}
                                className="w-full py-3 text-gray-500 font-reddit-sans hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
