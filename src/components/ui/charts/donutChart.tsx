"use client"
import { Card } from '@material-tailwind/react';
import React, { Component } from 'react';
import Chart from 'react-apexcharts'

type DonutProps = {
  data: {
    options: any;
    series: number[];
  };
  height?: number;
  width?: number;
  chartType?: 'donut' | 'pie';
};

export default function Donut({ data, height = 600, width, chartType = 'donut'}: DonutProps) {
  return (
    <div className=''>
      <div className="">
        <Chart options={data.options} series={data.series} type={chartType="pie" ? "pie" : "donut"} width={width} height={height} />
      </div>
    </div>
  );
}
