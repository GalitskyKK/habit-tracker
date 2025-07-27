export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow/5 border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
