import { CircleDot } from 'lucide-react';

export default function TireCard({ tire }) {
  const remainingLife = Math.max(0, 100 - tire.wearPercent);
  
  const getColor = () => {
    if (remainingLife >= 70) return 'text-green-600 dark:text-green-400';
    if (remainingLife >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getBgColor = () => {
    if (remainingLife >= 70) return 'bg-green-100 dark:bg-green-900/30';
    if (remainingLife >= 40) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CircleDot size={20} className={getColor()} />
          <span className="font-semibold text-gray-900 dark:text-white">{tire.position}</span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{tire.serial}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Vie restante</span>
          <span className={`font-bold ${getColor()}`}>{remainingLife.toFixed(0)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${getBgColor()}`}
            style={{ width: `${remainingLife}%` }}
          />
        </div>

        {tire.pressure && (
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Pression: {tire.pressure} bar</span>
            {tire.depth && <span>Profondeur: {tire.depth} mm</span>}
          </div>
        )}
      </div>
    </div>
  );
}
