import { Link } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useRemoveFromCart, useUpdateCartQuantity, useClearCart } from '../hooks/useCart';
import ItemQuantity from '../components/ItemQuantity';

export default function CartPage() {
  const { items, total } = useCartStore();
  const removeFromCart = useRemoveFromCart();
  const updateQuantity = useUpdateCartQuantity();
  const clearCart = useClearCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <img src="/AppLogoFull.png" alt="QuickGrocery" className="h-auto w-auto mx-auto opacity-80 mb-4" />
          </div>
          <h1 className="text-3xl font-bold text-brand-700 mb-2">Your Cart is Empty</h1>
          <p className="text-brand-600 mb-8 text-lg">No items yet. Start shopping to fill your cart with fresh groceries!</p>
          <Link
            to="/products"
            className="inline-block bg-brand-600 text-white py-4 px-12 rounded-lg font-bold text-lg hover:bg-brand-700 transition transform hover:scale-105 shadow-md"
          >
            🛍️ Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6 text-brand-700">Shopping Cart</h1>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.productId} className="bg-brand-50 shadow-sm p-4 flex gap-4 hover:border-brand-400">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded bg-gray-200" />
              <div className="flex-1">
                <h3 className="font-bold text-brand-800">{item.name}</h3>
                <p className="text-sm text-brand-600">{item.unit}</p>
                <p className="font-bold text-brand-700 mt-2">Rs. {item.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart.mutate(item.productId)}
                  disabled={removeFromCart.isPending}
                  className="text-red-600 text-sm hover:text-red-700 disabled:opacity-50"
                >
                  Remove
                </button>
                <ItemQuantity
                  quantity={item.quantity}
                  onQuantityChange={(quantity) =>
                    updateQuantity.mutate({ productId: item.productId, quantity })
                  }
                  isLoading={updateQuantity.isPending}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-50 rounded-lg p-6 h-fit border-2 border-brand-200">
        <h2 className="text-lg font-bold mb-4 text-brand-700">Order Summary</h2>
        <div className="space-y-2 mb-6 pb-6 border-b-2 border-brand-200">
          <div className="flex justify-between text-brand-700">
            <span>Subtotal</span>
            <span>Rs. {total().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-brand-700">
            <span>Delivery</span>
            <span>Rs. 2.50</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-brand-700">
            <span>Total</span>
            <span>Rs. {(total() + 2.5).toFixed(2)}</span>
          </div>
        </div>
        <Link
          to="/checkout"
          className="block w-full bg-brand-600 text-white py-3 rounded-lg font-bold text-center hover:bg-brand-700"
        >
          Checkout
        </Link>
        <button
          onClick={() => clearCart.mutate()}
          disabled={clearCart.isPending}
          className="w-full mt-2 text-brand-600 text-sm hover:text-brand-700 hover:underline disabled:opacity-50"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
