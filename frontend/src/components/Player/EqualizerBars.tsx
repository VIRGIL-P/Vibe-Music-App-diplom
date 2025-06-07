import React from 'react';
import { cn } from '@/lib/utils';

interface EqualizerBarsProps {
  className?: string;
}

const EqualizerBars: React.FC<EqualizerBarsProps> = ({ className }) => {
  return (
    <div className={cn("equalizer", className)}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default EqualizerBars;
