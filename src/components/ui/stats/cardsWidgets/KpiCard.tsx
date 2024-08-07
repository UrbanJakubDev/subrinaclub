"use client"
import { Card, CardBody } from "@material-tailwind/react";
import Typography from "../../typography";
import React from 'react'

type KpiCardPropsType = {
  title: string;
  percentage: string | number;
  price: string | number;
  color?: string;
  icon?: React.ReactNode;
}

const KpiCard: React.FC<KpiCardPropsType> = ({ title, percentage, price, color, icon }) => {
  return (
    <Card className="shadow-sm border border-gray-200 !rounded-lg grow">
      <CardBody className="p-4">
        <div className="flex justify-between text-gray-900">
          <div>
            <Typography variant="small" children={title} />
            <Typography variant="h4" color="inherit" children={price} />
          </div>
          <Typography color={color as any} className="font-medium !text-xs" children={percentage} />
        </div>
      </CardBody>
    </Card>
  );
}

export default KpiCard