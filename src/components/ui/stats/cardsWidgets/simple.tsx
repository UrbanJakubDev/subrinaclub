'use client'
import formatThousandDelimiter from '@/lib/utils/formatFncs';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import React, { useState, useEffect } from 'react';

type Props = {
  title: string;
  value: number;
  units?: string;
  color?: string;
};

const SimpleStat = ({ title, value, color, units }: Props) => {
  

  return (
    <Card className="shadow-md border border-gray-200 !rounded-lg grow">
      <CardBody className="p-4">
        <div className="flex flex-col justify-between text-gray-900">
          <Typography variant="small" children={title} />
          <Typography variant="h4" color="inherit" children={`${formatThousandDelimiter(value)} ${units || ''}`} />
        </div>
      </CardBody>
    </Card>
  );
};

export default SimpleStat;
