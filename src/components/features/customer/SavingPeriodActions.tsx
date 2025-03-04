'use client'

import React from 'react';
import Button from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loadingSpinner";

interface SavingPeriodActionsProps {
  isClosing: boolean;
  onClose: (closeNow: boolean) => void;
}

const SavingPeriodActions: React.FC<SavingPeriodActionsProps> = ({ 
  isClosing, 
  onClose 
}) => {
  return (
    <div className="flex items-center gap-4 mt-8">
      <Button
        onClick={() => onClose(false)}
        variant="outlined"
        size="sm"
        disabled={isClosing}
      >
        {isClosing ? (
          <LoadingSpinner size="sm" text="Uzavírání..." />
        ) : (
          'Uzavřít období'
        )}
      </Button>
      <Button
        onClick={() => onClose(true)}
        variant="outlined"
        size="sm"
        disabled={isClosing}
      >
        {isClosing ? (
          <LoadingSpinner size="sm" text="Uzavírání..." />
        ) : (
          'Uzavřít období nyní'
        )}
      </Button>
    </div>
  );
};

export default SavingPeriodActions; 