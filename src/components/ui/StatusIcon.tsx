import React from 'react';

// Separate components for better organization
const StatusIcon = ({ active }: { active: boolean }) => (
   <div className="text-center">
      <div
         style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: active ? '#DBEAD9' : '#F3D6D4',
            display: 'inline-block',
            position: 'relative',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
         }}
      >
         <div
            style={{
               width: '8px',
               height: '8px',
               borderRadius: '50%',
               backgroundColor: active ? '#4CAF50' : '#D32F2F',
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
            }}
         />
      </div>
   </div>
);

export default StatusIcon;


