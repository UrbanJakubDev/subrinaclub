"use client"
import { Card } from '@material-tailwind/react';
import React, { Component } from 'react';
import Chart from 'react-apexcharts'

class Donut extends Component {

   constructor(props: any) {
      super(props);

      this.state = {
         options: {},
         series: [44, 55, 41, 17, 15],
         labels: ['A', 'B', 'C', 'D', 'E']
      }
   }

   render() {

      return (
         <Card>
            <div className="donut">
               <Chart options={this.state.options} series={this.state.series} type="donut" width="380" />
            </div>
         </Card>
      );
   }
}

export default Donut;