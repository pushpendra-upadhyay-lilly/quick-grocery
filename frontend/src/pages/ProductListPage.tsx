import { useNavigate, useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useProducts, useCategories } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useCart';
import { useNavbarHeading } from '../hooks/useNavbarHeading';
import ProductCard from '../components/ProductCard';
import CategorySidebar from '../components/CategorySidebar';
import toast from 'react-hot-toast';

export default function ProductListPage() {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const { data: categories } = useCategories();
  const addToCart = useAddToCart();

  // Look up category ID from slug
  const categoryId = useMemo(() => {
    if (!slug || !categories) return undefined;
    return categories.find((c: any) => c.slug === slug)?._id;
  }, [slug, categories]);

  // Fetch products with category filter if applicable
  const { data, isLoading } = useProducts(page, 20, categoryId);

  const categoryName = useMemo(() => {
    if (!slug || !categories) return 'All Products';
    return categories.find((c: any) => c.slug === slug)?.name || 'Products';
  }, [slug, categories]);

  // Set navbar heading to category name
  useNavbarHeading(categoryName);

  const handleAddToCart = (product: any) => {
    addToCart.mutate({
      productId: product.slug,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      unit: product.unit,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar - Categories */}
      <CategorySidebar
        categories={categories}
        activeSlug={slug}
        onCategorySelect={(categorySlug) => {
          navigate(`/categories/${categorySlug}`);
          setPage(1);
        }}
        onViewAllClick={() => {
          navigate('/products');
          setPage(1);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 max-h-[calc(100vh-64px)] overflow-auto">
      {isLoading ? (
        <div className="text-brand-600">Loading products...</div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-brand-600 text-lg">No products available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 mb-8">
            {data?.data?.map((product: any) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                isAddingToCart={addToCart.isPending}
              />
            ))}
          </div>

          {/* Pagination */}
          {data?.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border-2 border-brand-300 rounded text-brand-700 font-bold hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-2 rounded font-bold ${
                    page === p
                      ? 'bg-brand-600 text-white'
                      : 'border-2 border-brand-300 text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(data.pages, page + 1))}
                disabled={page === data.pages}
                className="px-4 py-2 border-2 border-brand-300 rounded text-brand-700 font-bold hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
