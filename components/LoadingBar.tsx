// src/components/LoadingBar.tsx
import React from 'react';

const LoadingBar: React.FC = () => (
  <div className="w-full bg-gray-200 rounded">
    <div className="bg-blue-500 h-2 rounded animate-pulse" style={{ width: '60%' }}></div>
  </div>
);

export default LoadingBar;