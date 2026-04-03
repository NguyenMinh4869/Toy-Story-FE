import React from 'react'
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, AlertTriangle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'
import { ROUTES } from '../routes/routePaths'
import { useAuth } from '@/hooks/useAuth'
const CartPage: React.FC = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        getTotalOriginalPrice,
        removeDeactivatedItems,
    } = useCart()
    const navigate = useNavigate()
    const { user } = useAuth()

    const hasDeactivatedItems = cartItems.some(item => item.isDeactivated)

    if (user?.role !== 'Member') {
        navigate(ROUTES.HOME)
        return null
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center !bg-slate-50">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                    <ShoppingBag size={48} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-red-500 mb-2 font-red-hat">Giỏ hàng của bạn đang trống</h2>
                <p className="text-red-500 mb-8 max-w-md font-reddit-sans">
                    Có vẻ như bạn chưa chọn được món quà ưng ý nào. Hãy quay lại cửa hàng để khám phá hàng ngàn món đồ chơi hấp dẫn nhé!
                </p>
                <Link
                    to={ROUTES.PRODUCTS}
                    className="flex items-center gap-2 px-8 py-3 bg-red-500 text-white rounded-full font-bold transition-all shadow-lg"
                >
                    <ArrowLeft size={18} />
                    Tiếp tục mua sắm
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-20  text-center !bg-slate-50">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-red-500">Giỏ hàng của bạn</h1>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={"productId" in item.product ? item.product.productId : item.product.setId}
                            className={`bg-white rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row gap-4 items-center ${item.isDeactivated ? 'border-2 border-red-400 opacity-70' : ''}`}
                        >
                            <img
                                src={item.product.imageUrl ?? ''}
                                alt={item.product.name ?? 'Product'}
                                className="w-24 h-24 rounded-xl object-cover"
                            />

                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                                    {item.product.name}
                                </h3>
                                {item.isDeactivated && (
                                    <p className="text-red-500 text-sm font-semibold flex items-center gap-1 mt-1">
                                        <AlertTriangle size={14} />
                                        Sản phẩm này hiện không còn được bán
                                    </p>
                                )}
                                {item.originalTotalPrice !== undefined && item.originalTotalPrice > (item.serverTotalPrice ?? 0) ? (
                                    <div className="mb-2">
                                        <p className="text-red-600 font-bold">
                                            {formatPrice(item.serverTotalPrice ?? 0)}
                                        </p>
                                        <p className="text-gray-400 text-xs line-through mt-0.5">
                                            {formatPrice(item.originalTotalPrice)}
                                        </p>
                                    </div>
                                ) : item.serverTotalPrice !== undefined && item.serverTotalPrice < ((item.product.price ?? 0) * item.quantity) ? (
                                    <div className="mb-2">
                                        <p className="text-red-600 font-bold">
                                            {formatPrice(item.serverTotalPrice)}
                                        </p>
                                        <p className="text-gray-400 text-xs line-through mt-0.5">
                                            {formatPrice((item.product.price ?? 0) * item.quantity)}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-red-600 font-bold mb-2">
                                        {formatPrice(item.serverTotalPrice ?? ((item.product.price ?? 0) * item.quantity))}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9 bg-gray-50">
                                    <button
                                        onClick={() => updateQuantity(item, item.quantity - 1)}
                                        className="w-9 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-12 h-full flex items-center justify-center font-bold text-gray-900 border-x border-gray-200">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item, item.quantity + 1)}
                                        className="w-9 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <Link
                        to={ROUTES.PRODUCTS}
                        className="inline-flex items-center gap-2 text-red-500 transition-colors mt-4"
                    >
                        <ArrowLeft size={18} />
                        Tiếp tục chọn thêm đồ chơi
                    </Link>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-gray-900">Tóm tắt đơn hàng</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Số lượng sản phẩm:</span>
                                <span className="font-bold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính:</span>
                                <span>{formatPrice(getTotalOriginalPrice())}</span>
                            </div>
                            {getTotalOriginalPrice() > getTotalPrice() && (
                                <div className="flex justify-between text-green-600 pb-2">
                                    <span>Giảm giá:</span>
                                    <span>-{formatPrice(getTotalOriginalPrice() - getTotalPrice())}</span>
                                </div>
                            )}
                            <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center text-xl">
                                <span className="font-bold text-gray-900">Tổng cộng:</span>
                                <span className="font-black text-red-600">{formatPrice(getTotalPrice())}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate(ROUTES.CHECKOUT)}
                            disabled={hasDeactivatedItems}
                            className={`w-full py-4 text-white rounded-2xl font-bold text-lg transition-all shadow-lg ring-4 ring-white ${hasDeactivatedItems ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-200'}`}
                        >
                            Tiến hành thanh toán
                        </button>

                        {hasDeactivatedItems && (
                            <div className="flex items-start gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                <div className="flex-1">
                                    <p>Giỏ hàng có sản phẩm không còn được bán. Vui lòng xóa các sản phẩm đó trước khi tiến hành thanh toán.</p>
                                    <button
                                        onClick={removeDeactivatedItems}
                                        className="mt-2 text-xs font-bold underline hover:no-underline"
                                    >
                                        Xóa tất cả sản phẩm ngừng bán
                                    </button>
                                </div>
                            </div>
                        )}

                        <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
                            Bằng cách nhấn thanh toán, bạn đồng ý với các Chính sách và Điều khoản của Toy Story.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage
