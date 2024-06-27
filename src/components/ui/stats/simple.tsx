'use client'
import { Card, CardBody, Typography } from '@material-tailwind/react';
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
    <Card className="shadow-sm border border-gray-200 !rounded-lg">
      <CardBody className="p-8">
        <div className="flex justify-between items-center">
           <Typography
             className="!font-medium !text-xs text-gray-600"
           >
             {label}
           </Typography>
        
         </div>
         <Typography
           color="blue-gray"
           className="mt-1 font-bold text-4xl"
         >
           {formatNumber(count)}
         </Typography>
      </CardBody>
    </Card>
  );
};

export default SimpleStat;
