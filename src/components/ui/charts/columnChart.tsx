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

interface ColumnChartProps {
   title: string;
   description: string;
   series: SeriesData[];
   categories: string[];
   colors?: string[];
   height?: number;
   stacked?: boolean;
   horizontal?: boolean;
   columnWidth?: string;
   borderRadius?: number;
   yAxisTitle?: string;
   showValues?: boolean;
}

const defaultColors = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6"];

export default function ColumnChart({ 
   title, 
   description, 
   series, 
   categories,
   colors = defaultColors,
   height = 240,
   stacked = false,
   horizontal = false,
   columnWidth = "50%",
   borderRadius = 4,
   yAxisTitle,
   showValues = false
}: ColumnChartProps) {

   // Merge provided colors with series data
   const seriesWithColors = series.map((s, index) => ({
      ...s,
      color: s.color || colors[index % colors.length]
   }));

   const chartConfig = {
      type: horizontal ? "bar" : "bar",
      height: height,
      series: seriesWithColors,
      options: {
         chart: {
            stacked: stacked,
            toolbar: {
               show: false,
            },
            animations: {
               enabled: true,
               easing: 'easeinout',
               speed: 800,
               animateGradually: {
                  enabled: true,
                  delay: 150
               },
               dynamicAnimation: {
                  enabled: true,
                  speed: 350
               }
            },
         },
         plotOptions: {
            bar: {
               horizontal: horizontal,
               columnWidth: columnWidth,
               borderRadius: borderRadius,
               dataLabels: {
                  position: horizontal ? 'start' : 'top',
               },
            },
         },
         dataLabels: {
            enabled: showValues,
            formatter: (value: number) => value.toLocaleString(),
            style: {
               fontSize: '12px',
               colors: ["#333"]
            },
            offsetY: -20,
         },
         colors: seriesWithColors.map(s => s.color),
         xaxis: {
            categories: categories,
            axisBorder: {
               show: false,
            },
            axisTicks: {
               show: false,
            },
            labels: {
               style: {
                  colors: "#616161",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  fontWeight: 400,
               },
               rotate: horizontal ? 0 : -45,
               rotateAlways: false,
               trim: true,
               minHeight: 40,
            },
         },
         yaxis: {
            title: {
               text: yAxisTitle,
               style: {
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#616161'
               }
            },
            labels: {
               style: {
                  colors: "#616161",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  fontWeight: 400,
               },
               formatter: (value: number) => value.toLocaleString(),
            },
         },
         grid: {
            show: true,
            borderColor: "#dddddd",
            strokeDashArray: 5,
            position: 'back',
            xaxis: {
               lines: {
                  show: false
               }
            },
            yaxis: {
               lines: {
                  show: true
               }
            },
            padding: {
               top: 0,
               right: 20,
               bottom: 0,
               left: 20
            },
         },
         legend: {
            position: 'top',
            horizontalAlign: 'center',
            offsetY: 10,
            markers: {
               radius: 4,
            },
            itemMargin: {
               horizontal: 10,
               vertical: 0
            },
            labels: {
               colors: "#616161"
            },
         },
         tooltip: {
            shared: true,
            intersect: false,
            y: {
               formatter: (value: number) => value.toLocaleString() + ' points'
            },
            theme: 'dark',
         },
      },
   };

   return (
      <div className="w-full">
         {/* <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
         >
            <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
               <FontAwesomeIcon icon={faSackDollar} style={{ color: "#ffffff" }} />
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
         </CardHeader> */}
         <CardBody className="">
            {series && categories && (
               <Chart {...chartConfig} />
            )}
         </CardBody>
      </div>
   );
}