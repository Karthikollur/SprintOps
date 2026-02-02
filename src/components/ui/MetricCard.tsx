interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  warning?: boolean;
  subtitle?: string;
  progress?: number;
}

export function MetricCard({ title, value, icon, warning, subtitle, progress }: MetricCardProps) {
  return (
    <div className={`bg-white rounded-lg border p-6 ${warning ? "border-amber-300 bg-amber-50" : "border-gray-200"}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {warning && (
          <span className="text-amber-500" title="Needs attention">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
        )}
        {icon && !warning && <span className="text-gray-400">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      {progress !== undefined && (
        <div className="mt-3">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
