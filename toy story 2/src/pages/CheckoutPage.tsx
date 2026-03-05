import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'
import { formatPrice } from '../utils/formatPrice'
import { calculatePrice, checkout, createPayment } from '../services/checkoutService'
import { CalculatePriceResponse } from '../types/CheckoutDTO'
import { addToCartServer, clearCartServer, getCartServer } from '../services/cartService'
import { updateUser } from '../services/authService'
import { ShoppingBag, ArrowLeft, CreditCard, Loader2, CheckCircle2 } from 'lucide-react'
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

    const [isCalculating, setIsCalculating] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [calculation, setCalculation] = useState<CalculatePriceResponse | null>(null)
    const [error, setError] = useState<string | null>(null)

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

    const handleCalculate = async () => {
        if (cartItems.length === 0) return

        setIsCalculating(true)
        setError(null)

        try {
            // 1. Sync cart with server (backend relies on session/db cart)
            await clearCartServer()
            for (const item of cartItems) {
                const pId = item.product.productId || (item.product.id ? parseInt(String(item.product.id)) : 0)
                if (pId > 0) {
                    await addToCartServer(pId, item.quantity)
                }
            }

            try {
                // 2. Try the dedicated calculation endpoint
                const items = cartItems.map(item => ({
                    productId: item.product.productId || (item.product.id ? parseInt(String(item.product.id)) : 0),
                    quantity: item.quantity
                }))
                const result = await calculatePrice({ items })
                setCalculation(result)
            } catch (calcErr: any) {
                // 3. Fallback: Get server-side total from cart if calculate endpoint 404s
                console.log('Calculation endpoint failed or not found, using cart total fallback')
                const serverCart = await getCartServer()
                if (serverCart && serverCart.totalPrice !== undefined) {
                    setCalculation({
                        subtotal: serverCart.totalPrice,
                        discount: 0,
                        total: serverCart.totalPrice,
                        message: 'Tính toán dựa trên giỏ hàng hiện tại.'
                    })
                } else {
                    throw calcErr // Re-throw if even fallback fails
                }
            }
        } catch (err: any) {
            console.error('Calculation error:', err)
            setError(err.message || 'Không thể tính phí đơn hàng. Vui lòng thử lại.')
        } finally {
            setIsCalculating(false)
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
            // 1. Sync User Profile (Backend may use profile info for checkout)
            try {
                await updateUser({
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    email: formData.email || undefined
                })
            } catch (profileErr) {
                console.warn('Profile sync failed, continuing checkout anyway:', profileErr)
                // We continue because some backends might handle this differently
            }

            // 2. Synchronize cart one last time before checkout
            if (!calculation) {
                await handleCalculate()
            }

            // 3. Perform checkout
            const checkoutResult = await checkout()

            // Handle cases where checkout might return empty body but success
            const invoiceId = checkoutResult?.invoiceId

            if (!invoiceId) {
                // If no invoiceId from checkout, try to find the latest invoice for account
                console.warn('No invoiceId returned from checkout, attempting to proceed...')
                // fallback or more logic could go here
                throw new Error('Không thể tạo hóa đơn thanh toán. Vui lòng liên hệ hỗ trợ.')
            }

            // 4. Create payment link
            const paymentResult = await createPayment(invoiceId)

            // 5. Clear local cart
            clearCart()

            // 6. Redirect to PayOS
            if (paymentResult?.checkoutUrl) {
                window.location.href = paymentResult.checkoutUrl
            } else {
                throw new Error('Không nhận được liên kết thanh toán từ PayOS.')
            }
        } catch (err: any) {
            console.error('Checkout error:', err)
            // Extract detailed error if available
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
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính</span>
                                        <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                                    </div>

                                    {calculation && (
                                        <>
                                            <div className="flex justify-between text-gray-600">
                                                <span>Giảm giá</span>
                                                <span className="text-green-600 font-medium">-{formatPrice(calculation.discount)}</span>
                                            </div>
                                            <div className="h-px bg-gray-100 my-2"></div>
                                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                                <span>Tổng tiền</span>
                                                <span className="text-red-600 text-2xl font-tilt-warp">{formatPrice(calculation.total)}</span>
                                            </div>
                                        </>
                                    )}

                                    {!calculation && !isCalculating && (
                                        <button
                                            onClick={handleCalculate}
                                            className="w-full mt-4 py-3 bg-white border-2 border-red-500 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={18} />
                                            Xem lời chào & phí
                                        </button>
                                    )}

                                    {isCalculating && (
                                        <div className="w-full mt-4 py-3 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center gap-2">
                                            <Loader2 size={18} className="animate-spin" />
                                            Đang tính toán...
                                        </div>
                                    )}

                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mt-4 animate-in fade-in slide-in-from-top-1">
                                            {error}
                                        </div>
                                    )}

                                    <div className="pt-6">
                                        <button
                                            disabled={isSubmitting || isCalculating}
                                            onClick={handleCheckout}
                                            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${isSubmitting || isCalculating
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
