import React from 'react'
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'
import { ROUTES } from '../routes/routePaths'

const CartPage: React.FC = () => {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        clearCart
    } = useCart()
    const navigate = useNavigate()

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                    <ShoppingBag size={48} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 font-red-hat">Giỏ hàng của bạn đang trống</h2>
                <p className="text-red-200 mb-8 max-w-md font-reddit-sans">
                    Có vẻ như bạn chưa chọn được món quà ưng ý nào. Hãy quay lại cửa hàng để khám phá hàng ngàn món đồ chơi hấp dẫn nhé!
                </p>
                <Link
                    to={ROUTES.PRODUCTS}
                    className="flex items-center gap-2 px-8 py-3 bg-white text-red-600 rounded-full font-bold hover:bg-red-50 transition-all shadow-lg"
                >
                    <ArrowLeft size={18} />
                    Tiếp tục mua sắm
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white font-red-hat">Giỏ hàng của bạn</h1>
                <button
                    onClick={() => clearCart()}
                    className="text-red-200 hover:text-white flex items-center gap-2 text-sm transition-colors"
                >
                    <Trash2 size={16} />
                    Xóa toàn bộ
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.product.id ?? item.product.productId}
                            className="bg-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center"
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
                                <p className="text-red-600 font-bold mb-2">
                                    {formatPrice(item.product.price ?? 0)}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9 bg-gray-50">
                                    <button
                                        onClick={() => updateQuantity(item.product.id ?? String(item.product.productId), item.quantity - 1)}
                                        className="w-9 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="w-12 h-full flex items-center justify-center font-bold text-gray-900 border-x border-gray-200">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.product.id ?? String(item.product.productId), item.quantity + 1)}
                                        className="w-9 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.product.id ?? String(item.product.productId))}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <Link
                        to={ROUTES.PRODUCTS}
                        className="inline-flex items-center gap-2 text-red-100 hover:text-white transition-colors mt-4"
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
                                <span className="font-bold">{formatPrice(getTotalPrice())}</span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center text-xl">
                                <span className="font-bold text-gray-900">Tổng cộng:</span>
                                <span className="font-black text-red-600">{formatPrice(getTotalPrice())}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate(ROUTES.CHECKOUT)}
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 ring-4 ring-white"
                        >
                            Tiến hành thanh toán
                        </button>

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
