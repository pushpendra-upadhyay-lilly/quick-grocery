import { useNavigate } from 'react-router-dom';

interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl: string;
  sortOrder: number;
}

interface CategorySidebarProps {
  categories?: Category[];
  activeSlug?: string;
  onCategorySelect?: (slug: string) => void;
  onViewAllClick?: () => void;
}

export default function CategorySidebar({
  categories = [],
  activeSlug,
  onCategorySelect,
  onViewAllClick,
}: CategorySidebarProps) {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    if (onCategorySelect) {
      onCategorySelect(slug);
    } else {
      navigate(`/categories/${slug}`);
    }
  };

  const handleViewAll = () => {
    if (onViewAllClick) {
      onViewAllClick();
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="w-24 flex-shrink-0 -ml-4 -mt-6">
      <div className="bg-brand-50 p-0 sticky max-h-[calc(100vh-64px)] overflow-y-auto br-1 border-brand-200">
        <div className="space-y-0">
          {/* All Products */}
          <button
            onClick={handleViewAll}
            className={`w-full h-20 text-centre px-3 py-2 text-xs transition ${
              !activeSlug
                ? 'bg-brand-100  border-r-4 border-brand-600'
                : 'text-brand-700 hover:bg-brand-100'
            }`}
          >
            All Products
          </button>

          {/* Categories */}
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`w-full text-center px-3 py-4 text-xs transition ${
                activeSlug === category.slug
                  ? 'bg-brand-100 font-bold text-brand-700 border-r-4 border-brand-600'
                  : 'text-brand-700 hover:bg-brand-100'
              }`}
            >
              {category.imageUrl && (
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-10 h-10 inline-block mb-1 object-cover"
                />
              )}
              <br/>
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
