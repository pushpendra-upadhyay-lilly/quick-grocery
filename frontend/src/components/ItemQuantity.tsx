interface ItemQuantityProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  isLoading?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
}

export default function ItemQuantity({
  quantity,
  onQuantityChange,
  isLoading = false,
  minQuantity = 1,
  maxQuantity = 8,
}: ItemQuantityProps) {
  const handleDecrement = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleDecrement}
        disabled={isLoading || quantity <= minQuantity}
        className="px-2 py-1 border-2 border-brand-300 rounded hover:bg-brand-100 text-brand-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="w-auto text-center font-bold text-brand-700">{quantity}</span>
      <button
        onClick={handleIncrement}
        disabled={isLoading || quantity >= maxQuantity}
        className="px-2 py-1 border-2 border-brand-300 rounded hover:bg-brand-100 text-brand-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}
