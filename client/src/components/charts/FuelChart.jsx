import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * FuelChart Component
 * Displays fuel consumption over time
 */
export default function FuelChart({ data }) {
  // Sample data if none provided
  const chartData = data || [
    { month: 'Jan', consumption: 450 },
    { month: 'Fév', consumption: 520 },
    { month: 'Mar', consumption: 480 },
    { month: 'Avr', consumption: 590 },
    { month: 'Mai', consumption: 430 },
    { month: 'Juin', consumption: 610 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => `${value}L`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value) => [`${value} L`, 'Consommation']}
          />
          <Area
            type="monotone"
            dataKey="consumption"
            stroke="#FF8A00"
            fill="#FFF0DB"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
