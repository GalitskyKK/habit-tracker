export const Input: React.FC<{
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
  min?: string;
  max?: string;
}> = ({ type = 'text', placeholder, value, onChange, className = '', required, min, max }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      required={required}
      min={min}
      max={max}
    />
  );
};
