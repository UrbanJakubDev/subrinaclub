import React, { useState, useEffect } from 'react';

const QuarterSlider = ({ startDate = new Date(2024, 0, 1), endDate = new Date(2025, 11, 31) }) => {
  const [value, setValue] = useState(0);
  const [quarters, setQuarters] = useState([]);

  useEffect(() => {
    // Calculate quarters between start and end date
    const quarters = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate && quarters.length < 8) {
      const year = currentDate.getFullYear();
      const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
      quarters.push(`Q${quarter} ${year}`);
      
      // Add 3 months
      currentDate.setMonth(currentDate.getMonth() + 3);
    }
    
    setQuarters(quarters);
  }, [startDate, endDate]);

  const handleSliderChange = (e) => {
    setValue(parseInt(e.target.value));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <input
          type="range"
          min="0"
          max="7"
          value={value}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>
      
      <div className="relative w-full flex justify-between">
        {quarters.map((quarter, index) => (
          <div
            key={quarter}
            className={`text-sm transform -translate-x-1/2 ${
              index === value ? 'text-blue-600 font-bold' : 'text-gray-500'
            }`}
            style={{ left: `${(index / 7) * 100}%` }}
          >
            {quarter}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-lg font-semibold text-gray-700">
        Selected Period: {quarters[value]}
      </div>
    </div>
  );
};

export default QuarterSlider;