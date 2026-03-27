import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCartStore } from '../stores/cartStore';
import ItemQuantity from './ItemQuantity';
import { useUpdateCartQuantity } from '../hooks/useCart';

interface ProductCardProps {
  product: any;
  onAddToCart: (product: any) => void;
  isAddingToCart?: boolean;
  small?: boolean;
}

export default function ProductCard({ product, onAddToCart, isAddingToCart = false, small = false }: ProductCardProps) {
  const { items } = useCartStore();
  const updateQuantity = useUpdateCartQuantity();
  const [isBlinking, setIsBlinking] = useState(false);

  // Check if product is in cart
  const cartItem = items.find((item) => item.productId === product.slug);

  // Handle add to cart with blink effect
  const handleAddClick = () => {
    setIsBlinking(true);
    onAddToCart(product);
    // Remove blink after animation completes
    setTimeout(() => setIsBlinking(false), 600);
  };

  // Handle quantity change
  const handleQuantityChange = (quantity: number) => {
    if (quantity <= 0) {
      // Remove from cart if quantity is 0
      updateQuantity.mutate({ productId: product.slug, quantity: 0 });
    } else {
      updateQuantity.mutate({ productId: product.slug, quantity });
    }
  };

  return (
    <div className="bg-brand-50 shadow-md border-brand-100 rounded-lg overflow-visible hover:shadow-lg hover:border-brand-400 transition">
      <div className="relative">
        <img src={product.imageUrl} alt={product.name} className={`w-full ${small ? 'h-20' : 'h-40'} object-cover bg-gray-200 rounded-t-lg`} />
        {!small && (
          <>
            {cartItem ? (
              // Show ItemQuantity if item is in cart
              <div className={`absolute bottom-0 right-2 translate-y-1/4 bg-white rounded p-2 shadow-md ${isBlinking ? 'animate-blink' : ''}`}>
                <ItemQuantity
                  quantity={cartItem.quantity}
                  onQuantityChange={handleQuantityChange}
                  isLoading={updateQuantity.isPending}
                  minQuantity={0}
                />
              </div>
            ) : (
              // Show Add button if item is not in cart
              <button
                onClick={handleAddClick}
                disabled={isAddingToCart}
                className={`absolute bottom-0 right-2 translate-y-1/4 px-4 py-2 bg-brand-600 text-white rounded font-medium hover:bg-brand-700 disabled:bg-gray-300 shadow-md hover:shadow-lg transition text-sm ${isBlinking ? 'animate-blink' : ''}`}
              >
                {isAddingToCart ? 'Adding...' : product.inStock ? 'Add' : 'Notify'}
              </button>
            )}
          </>
        )}
      </div>
      <div className={`${small ? 'p-2' : 'pt-6 pb-3 px-3'}`}>
        <Link to={`/products/${product.slug}`} className={`text-black ${small ? 'text-sm' : 'text-md'}`}>
          {product.name}
        </Link>
        {!small && (
          <>
            <p className="text-sm text-brand-600 mt-1">{product.unit}</p>
            {product.brand && (<p className="text-xs text-brand-500">{product.brand}</p>)}
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-sm text-brand-300">Rs. {product.price.toFixed(2)}</span>
              {product.comparePrice && (
                <span className="line-through text-brand-300 text-sm">Rs. {product.comparePrice.toFixed(2)}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
