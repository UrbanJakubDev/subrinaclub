import React, { useState, useEffect } from 'react';

type Props = {
   label: string;
   value: number;
};

const SimpleStat = ({ label, value }: Props) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const end = start + 300; // 1 second

    const timer = setInterval(() => {
      const now = Date.now();
      const timePassed = now - start;
      const progress = Math.min(1, timePassed / 300); // Ensure progress doesn't exceed 1
      const currentValue = Math.floor(progress * value);

      setCount(currentValue);

      if (now >= end) {
        clearInterval(timer);
      }
    }, 10); // Update every 10ms for smoother animation

    return () => clearInterval(timer);
  }, [value]);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <div className="flex flex-col items-center border shadow-md p-8 my-2">
      <p className="text-4xl font-bold text-brand drop-shadow-sm">{formatNumber(count)}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};

export default SimpleStat;
