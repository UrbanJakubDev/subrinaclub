import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   Card,
   CardBody,
   CardHeader,
   Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";

interface SeriesData {
   name: string;
   data: number[];
   color?: string;
}

interface ChartProps {
   title: string;
   description: string;
   series: SeriesData[];
   categories: string[];
   colors?: string[];
   chartType?: 'line' | 'bar' | 'area';
   icon?: React.ReactNode;
   height?: number;
   stacked?: boolean;
   tooltip?: {
      theme?: 'light' | 'dark';
      custom?: (dataPointIndex: any) => string;
   };
}

const defaultColors = ["#020617", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

export default function LineChart({ 
   title, 
   description, 
   series, 
   categories,
   colors = defaultColors,
   chartType = 'line',
   icon,
   height = 240,
   stacked = false,
   tooltip = { theme: 'dark' }
}: ChartProps) {

   // Merge provided colors with series data
   const seriesWithColors = series.map((s, index) => ({
      ...s,
      color: s.color || colors[index % colors.length]
   }));

   const chartConfig = {
      type: chartType,
      height: height,
      series: seriesWithColors,
      options: {
         chart: {
            toolbar: {
               show: false,
            },
            stacked: stacked,
            animations: {
               enabled: true,
               easing: 'easeinout',
               speed: 800,
            },
         },
         stroke: {
            curve: 'smooth',
            width: chartType === 'area' ? 2 : 3,
         },
         title: {
            show: "",
         },
         dataLabels: {
            enabled: false,
         },
         colors: seriesWithColors.map(s => s.color),
         plotOptions: {
            bar: {
               columnWidth: "40%",
               borderRadius: 2,
            },
         },
         xaxis: {
            axisTicks: {
               show: false,
            },
            axisBorder: {
               show: false,
            },
            labels: {
               style: {
                  colors: "#616161",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  fontWeight: 400,
               },
               rotate: -45,
               rotateAlways: false,
            },
            categories: categories,
         },
         yaxis: {
            labels: {
               style: {
                  colors: "#616161",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  fontWeight: 400,
               },
               formatter: (value: number) => Math.round(value).toString(),
            },
         },
         grid: {
            show: true,
            borderColor: "#dddddd",
            strokeDashArray: 5,
            xaxis: {
               lines: {
                  show: true,
               },
            },
            padding: {
               top: 5,
               right: 20,
            },
         },
         fill: {
            opacity: chartType === 'area' ? 0.2 : 0.8,
            type: chartType === 'area' ? 'gradient' : 'solid',
            gradient: {
               shade: 'light',
               type: "vertical",
               shadeIntensity: 0.5,
               opacityFrom: 0.7,
               opacityTo: 0.2,
            },
         },
         tooltip: {
            theme: tooltip.theme,
            custom: tooltip.custom,
            y: {
               formatter: (value: number) => `${value.toLocaleString()} points`,
            },
            intersect: false,
            shared: true,
         },
         legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetY: -10,
            labels: {
               colors: "#616161"
            },
         },
      },
   };

   return (
      <div className="w-full">
         <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
         >
            <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
               {icon || <FontAwesomeIcon icon={faSackDollar} style={{ color: "#ffffff" }} />}
            </div>
            <div>
               <Typography variant="h6" color="blue-gray">
                  {title}
               </Typography>
               <Typography
                  variant="small"
                  color="gray"
                  className="max-w-sm font-normal"
               >
                  {description}
               </Typography>
            </div>
         </CardHeader>
         <CardBody className="px-2 pb-0 w-full overflow-x-auto">
            {series && categories && (
               <Chart {...chartConfig} />
            )}
         </CardBody>
      </div>
   );
}