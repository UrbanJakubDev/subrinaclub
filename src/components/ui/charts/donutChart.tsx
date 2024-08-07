"use client"
import { Card } from '@material-tailwind/react';
import React, { Component } from 'react';
import Chart from 'react-apexcharts'

type DonutProps = {
   data: {
     options: any;
     series: number[];
   };
 };
 
 export default function Donut({ data }: DonutProps) {
   return (
     <Card className='shadow-sm border border-gray-200 !rounded-lg'>
       <div className="donut">
         <Chart options={data.options} series={data.series} type="donut" width="600" />
       </div>
     </Card>
   );
 }
