import React from 'react';
import { User } from 'lucide-react';

export const Avatar: React.FC<{ src?: string; alt?: string; size?: number }> = ({ src, alt, size = 40 }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'User avatar'}
        width={size}
        height={size}
        className="rounded-sm object-cover border border-blue-200 bg-white"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-blue-200 flex items-center justify-center border border-blue-200"
      style={{ width: size, height: size }}
    >
      <User size={size * 0.6} className="text-blue-600" />
    </div>
  );
}; 