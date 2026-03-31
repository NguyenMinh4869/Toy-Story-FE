import React from "react";
import { X, Trash2, ShoppingBag, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import { ROUTES } from "../routes/routePaths";

const CartPopup: React.FC = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalOriginalPrice,
    isCartOpen,
    closeCart,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={closeCart}
      />

      {/* Cart Popup - Small Modal positioned near header */}
      <div className="fixed top-[120px] right-8 w-[429px] max-h-[500px] bg-white border-[0.3px] border-black z-50 overflow-y-auto rounded-[20px] shadow-2xl max-md:w-[95%] max-md:right-[2.5%] max-md:max-h-[80vh]">
        {/* Close Button */}
        <button
          onClick={closeCart}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close cart"
        >
          <X size={18} className="text-black" />
        </button>

        <div className="p-5 pt-12">
          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingBag size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-base font-tilt-warp">
                Giỏ hàng trống
              </p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div
                  key={"productId" in item.product ? item.product.productId : item.product.setId}
                  className="mb-4"
                >
                  {/* Product Info */}
                  <div className="flex gap-3 items-center">
                    <img
                      src={item.product.imageUrl ?? ""}
                      alt={item.product.name ?? "Product"}
                      className="w-[72px] h-[72px] rounded-xl object-cover flex-shrink-0 border border-gray-100"
                    />

                    {/* Middle Column: Name & Price */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-red-hat text-[14px] text-black leading-tight mb-1.5 line-clamp-2 lg:pr-2">
                        {item.product.name}
                      </h3>

                      <div className="flex flex-col">
                        <span className="font-tilt-warp text-red-600 text-[14px]">
                          {formatPrice(item.product.price)}
                        </span>
                        {item.originalUnitPrice && item.originalUnitPrice > item.product.price && (
                          <span className="text-gray-400 text-[12px] line-through mt-0.5">
                            {formatPrice(item.originalUnitPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Controls */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(item)}
                        className="p-1 hover:bg-red-50 rounded transition-colors text-gray-400 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="flex items-center border border-[#c6bfbf] rounded-[5px] overflow-hidden h-[26px]">
                        <button
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          className="w-[26px] h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-black font-tilt-warp text-[14px]"
                        >
                          -
                        </button>
                        <span className="px-2 h-full flex items-center justify-center min-w-[32px] text-black font-red-hat text-[13px] border-l border-r border-[#c6bfbf]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="w-[26px] h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-black font-tilt-warp text-[14px]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  < div className="h-px bg-gray-200 mt-3" />
                </div>
              ))}

              {/* Total Section */}
              <div className="bg-[#f2c9c9] rounded-[25px] p-4 mt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-red-hat text-[14px] text-[#ff2c2c]">
                    Tổng cộng
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="font-tilt-warp text-[15px] text-red-600">
                      {formatPrice(getTotalPrice())}
                    </span>
                    {getTotalOriginalPrice() > getTotalPrice() && (
                      <span className="text-gray-500 line-through text-xs mt-0.5">
                        {formatPrice(getTotalOriginalPrice())}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    closeCart();
                    navigate(ROUTES.CART);
                  }}
                  className="flex-1 h-[33px] border border-[#c40000] rounded-[25px] flex items-center justify-center gap-2 hover:bg-red-50 transition-colors bg-transparent cursor-pointer"
                >
                  <ShoppingBag size={14} className="text-[#ff2c2c]" />
                  <span className="font-reddit-sans text-[14px] text-[#ff2c2c] font-normal">
                    xem giỏ hàng
                  </span>
                </button>

                <button
                  onClick={() => {
                    closeCart();
                    navigate(ROUTES.CHECKOUT);
                  }}
                  className={`flex-1 h-[33px] border border-[#c40000] rounded-[25px] flex items-center justify-center transition-colors text-white cursor-pointer bg-[#d62525] hover:bg-[#c41f1f]"
                  }`}
                >
                  <span className="font-reddit-sans text-[14px] text-white font-normal">
                    Thanh Toán Ngay
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div >
    </>
  );
};

export default CartPopup;
