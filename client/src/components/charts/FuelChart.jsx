import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * FuelChart Component
 * Displays fuel consumption over time with dark mode support
 */
export default function FuelChart({ data }) {
  const { isDark } = useTheme();

  // Sample data if none provided
  const chartData = data || [
    { month: 'Jan', consumption: 450 },
    { month: 'Fév', consumption: 520 },
    { month: 'Mar', consumption: 480 },
    { month: 'Avr', consumption: 590 },
    { month: 'Mai', consumption: 430 },
    { month: 'Juin', consumption: 610 },
  ];

  // Theme-aware colors
  const colors = {
    grid: isDark ? '#334155' : '#e5e7eb',
    tick: isDark ? '#94a3b8' : '#6b7280',
    tooltipBg: isDark ? '#1e293b' : '#fff',
    tooltipBorder: isDark ? '#334155' : '#e5e7eb',
    tooltipText: isDark ? '#f8fafc' : '#1f2937',
    areaStroke: '#FF8A00',
    areaFill: isDark ? 'rgba(255, 138, 0, 0.2)' : '#FFF0DB',
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
            tickFormatter={(value) => `${value}L`}
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
            formatter={(value) => [`${value} L`, 'Consommation']}
          />
          <Area
            type="monotone"
            dataKey="consumption"
            stroke={colors.areaStroke}
            fill={colors.areaFill}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
