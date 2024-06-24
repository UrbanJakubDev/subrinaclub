"use client"
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   Card,
   CardBody,
   CardHeader,
   Typography,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";

// If you're using Next.js please use the dynamic import for react-apexcharts and remove the import from the top for the react-apexcharts
// import dynamic from "next/dynamic";
// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
   title: string;
   description: string;
   series: any;
}


export default function LineChart({ title, description, series }: Props) {

   const chartConfig = {
      type: "bar",
      height: 240,
      series: series,
      options: {
         chart: {
            toolbar: {
               show: false,
            },
         },
         title: {
            show: "",
         },
         dataLabels: {
            enabled: false,
         },
         colors: ["#020617"],
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
            },
            categories: [
               "Q1",
               "Q2",
               "Q3",
               "Q4",
            ],
         },
         yaxis: {
            labels: {
               style: {
                  colors: "#616161",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  fontWeight: 400,
               },
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
            opacity: 0.8,
         },
         tooltip: {
            theme: "dark",
         },
      },
   };


   return (
      <Card>
         <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
         >
            <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
            <FontAwesomeIcon icon={faSackDollar} style={{color: "#ffffff",}} />
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
         <CardBody className="px-2 pb-0">
            <Chart {...chartConfig} />
         </CardBody>
      </Card>
   );
}