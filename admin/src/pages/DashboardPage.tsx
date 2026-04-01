import { Link } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboard';

interface StatCardProps {
  label: string;
  value: number | undefined;
  color: string;
  icon: string;
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div className={`bg-slate-800 rounded-xl p-5 border border-slate-700`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
          {label}
        </span>
      </div>
      <div className="text-3xl font-bold text-white">
        {value ?? <span className="text-slate-500 text-xl">—</span>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-0.5">Inventory overview</p>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading stats…</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Products"
            value={stats?.totalProducts}
            color="bg-brand-900/50 text-brand-300"
            icon="⊞"
          />
          <StatCard
            label="Categories"
            value={stats?.totalCategories}
            color="bg-sky-900/50 text-sky-300"
            icon="⊟"
          />
          <StatCard
            label="In Stock"
            value={stats?.inStockCount}
            color="bg-green-900/50 text-green-300"
            icon="✓"
          />
          <StatCard
            label="Out of Stock"
            value={stats?.outOfStockCount}
            color="bg-red-900/50 text-red-300"
            icon="✕"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <Link
          to="/products"
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl p-4 text-center transition-colors"
        >
          <div className="text-2xl mb-2">⊞</div>
          <div className="text-sm font-medium text-white">Manage Products</div>
        </Link>
        <Link
          to="/categories"
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl p-4 text-center transition-colors"
        >
          <div className="text-2xl mb-2">⊟</div>
          <div className="text-sm font-medium text-white">Manage Categories</div>
        </Link>
      </div>
    </div>
  );
}
