import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCartStore } from '../stores/cartStore';
import ItemQuantity from './ItemQuantity';
import { useAddToCart, useUpdateCartQuantity } from '../hooks/useCart';
import type { Product } from '../interfaces/products';

interface ProductCardProps {
  product: Product;
  small?: boolean;
}

export default function ProductCard({ product, small = false }: ProductCardProps) {
  const { items } = useCartStore();
  const updateQuantity = useUpdateCartQuantity();
  const addToCart = useAddToCart();
  const [isBlinking, setIsBlinking] = useState(false);

  const cartItem = items.find((item) => item.productId === product.slug);

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBlinking(true);
    addToCart.mutate({
      productId: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      unit: product.unit,
    }, {
      onSettled: () => setIsBlinking(false),
    });
    toast.success('Added to cart!');
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
    <div className="rounded-lg overflow-visible transition relative">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative">
          <img src={product.imageUrl} alt={product.name} className={`w-full ${small ? 'h-20' : 'h-40'} object-cover bg-gray-700 rounded-lg shadow-md`} />
          {!small && (
            <div className='absolute bottom-0 right-2 translate-y-1/4 z-10' onClick={(e) => e.preventDefault()}>
              {cartItem ? (
                <ItemQuantity
                  quantity={cartItem.quantity}
                  onQuantityChange={handleQuantityChange}
                  isLoading={updateQuantity.isPending}
                  minQuantity={0}
                  isBlinking={isBlinking}
                />
              ) : (
                <button
                  onClick={handleAddClick}
                  disabled={addToCart.isPending}
                  className={`px-4 py-2 border-2 bg-gray-900 border-brand-600 text-brand-600 rounded-lg font-medium hover:bg-brand-700 disabled:bg-gray-600 shadow-md hover:shadow-lg transition text-sm ${isBlinking ? 'animate-blink' : ''}`}
                >
                  {addToCart.isPending ? 'Adding...' : product.inStock ? 'Add' : 'Notify'}
                </button>
              )}
            </div>
          )}
        </div>
        <div className={`${small ? 'px-0 py-2' : 'pt-4 pb-3 px-0'}`}>
          {!small && (<span className="text-[10px] text-brand-600 mt-1 border border-gray-600 inline-block p-1 rounded">{product.unit}</span>)}
          <p className={`text-gray-100 wrap-normal ${small ? 'text-sm' : 'text-md'}`}>
            {!small ? product.brand: ''}{" "}{product.name}
          </p>
          {!small && (
            <div className='mt-1'>
              <p className="font-bold text-sm text-gray-100">Rs. {product.price.toFixed(2)}</p>
              {product.comparePrice && (
                <p className="line-through text-gray-400 text-xs">Rs. {product.comparePrice.toFixed(2)}</p>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
