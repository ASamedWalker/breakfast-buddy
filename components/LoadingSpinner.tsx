import { Loader2 } from 'lucide-react';
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className='flex justify-center items-center'>
      <Loader2 size={64} className='h-8 w-8 animate-spin text-orange-500'/>
    </div>
  )
}

export default LoadingSpinner