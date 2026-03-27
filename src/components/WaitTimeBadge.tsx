import { getWaitLevel, getWaitColor, getWaitBg } from '../lib/types';

interface WaitTimeBadgeProps {
  minutes: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export default function WaitTimeBadge({ minutes, size = 'md', showLabel = true, className = '' }: WaitTimeBadgeProps) {
  const level = getWaitLevel(minutes);
  const color = getWaitColor(level);
  const bg = getWaitBg(level);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-sm',
    md: 'px-3 py-1.5 text-lg',
    lg: 'px-4 py-2 text-2xl',
    xl: 'px-5 py-3 text-4xl',
  };

  const labelSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
  };

  return (
    <div className={`inline-flex flex-col items-center gap-0.5 ${className}`}>
      <div className={`${bg} border rounded-lg ${sizeClasses[size]} animate-number-pop`}>
        <span className={`board-text font-bold ${color}`}>
          {minutes}
        </span>
        <span className={`${color} opacity-60 ml-1 ${labelSizes[size]} board-text`}>
          min
        </span>
      </div>
      {showLabel && (
        <span className={`${labelSizes[size]} text-slate-500`}>
          {level === 'low' ? 'Short wait' : level === 'medium' ? 'Moderate' : 'Long wait'}
        </span>
      )}
    </div>
  );
}
