export default function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-8 w-3/4',
    card: 'h-32 w-full',
    circle: 'h-12 w-12 rounded-full'
  };

  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-slate-700 rounded ${variants[variant]} ${className}`} />
  );
}
