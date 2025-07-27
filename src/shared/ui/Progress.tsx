export const Progress: React.FC<{
  value: number;
  max: number;
  className?: string;
}> = ({ value, max, className = '' }) => {
  const percentage = Math.min(100, (value / max) * 100);

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-green-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
