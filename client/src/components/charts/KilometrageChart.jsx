import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * KilometrageChart Component
 * Displays kilometrage evolution over time
 */
export default function KilometrageChart({ data }) {
  // Sample data if none provided
  const chartData = data || [
    { month: 'Jan', kilometrage: 12500 },
    { month: 'Fév', kilometrage: 14200 },
    { month: 'Mar', kilometrage: 11800 },
    { month: 'Avr', kilometrage: 15600 },
    { month: 'Mai', kilometrage: 13400 },
    { month: 'Juin', kilometrage: 16200 },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value) => [`${value.toLocaleString()} km`, 'Kilométrage']}
          />
          <Line
            type="monotone"
            dataKey="kilometrage"
            stroke="#0B4F6C"
            strokeWidth={2}
            dot={{ fill: '#0B4F6C', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
