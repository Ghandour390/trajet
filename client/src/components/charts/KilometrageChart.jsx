import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * KilometrageChart Component
 * Displays kilometrage evolution over time with dark mode support
 */
export default function KilometrageChart({ data }) {
  const { isDark } = useTheme();

  // Sample data if none provided
  const chartData = data || [
    { month: 'Jan', kilometrage: 12500 },
    { month: 'Fév', kilometrage: 14200 },
    { month: 'Mar', kilometrage: 11800 },
    { month: 'Avr', kilometrage: 15600 },
    { month: 'Mai', kilometrage: 13400 },
    { month: 'Juin', kilometrage: 16200 },
  ];

  // Theme-aware colors
  const colors = {
    grid: isDark ? '#334155' : '#e5e7eb',
    tick: isDark ? '#94a3b8' : '#6b7280',
    tooltipBg: isDark ? '#1e293b' : '#fff',
    tooltipBorder: isDark ? '#334155' : '#e5e7eb',
    tooltipText: isDark ? '#f8fafc' : '#1f2937',
    lineStroke: isDark ? '#60a5fa' : '#0B4F6C',
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            dataKey="month"
            tick={{ fill: colors.tick, fontSize: 12 }}
            axisLine={{ stroke: colors.grid }}
          />
          <YAxis
            tick={{ fill: colors.tick, fontSize: 12 }}
            axisLine={{ stroke: colors.grid }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              color: colors.tooltipText,
            }}
            labelStyle={{ color: colors.tooltipText }}
            formatter={(value) => [`${value.toLocaleString()} km`, 'Kilométrage']}
          />
          <Line
            type="monotone"
            dataKey="kilometrage"
            stroke={colors.lineStroke}
            strokeWidth={2}
            dot={{ fill: colors.lineStroke, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: colors.lineStroke }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
