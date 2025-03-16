export class QuarterDateUtils {
   /**
    * Converts year and quarter to the start date of that quarter
    */
   static getQuarterStartDate(year: number, quarter: number): Date {
     if (quarter < 1 || quarter > 4) {
       throw new Error('Quarter must be between 1 and 4');
     }
     const month = (quarter - 1) * 3;
     return new Date(Date.UTC(year, month, 1, 12, 0, 0, 0));
   }
 
   /**
    * Converts year and quarter to the end date of that quarter
    */
   static getQuarterEndDate(year: number, quarter: number): Date {
     if (quarter < 1 || quarter > 4) {
       throw new Error('Quarter must be between 1 and 4');
     }
     const month = quarter * 3;
     return new Date(Date.UTC(year, month, 0, 12, 0, 0, 0));
   }
 
   /**
    * Gets the quarter and year from a date
    */
   static getQuarterAndYear(date: Date): { year: number; quarter: number } {
     const year = date.getUTCFullYear();
     const month = date.getUTCMonth();
     const quarter = Math.floor(month / 3) + 1;
     
     return { year, quarter };
   }
 
   /**
    * Checks if a date falls within a specific quarter
    */
   static isDateInQuarter(date: Date, year: number, quarter: number): boolean {
     const start = this.getQuarterStartDate(year, quarter);
     const end = this.getQuarterEndDate(year, quarter);
     return date >= start && date <= end;
   }
 
   /**
    * Gets the current quarter and year
    */
   static getCurrentQuarter(): { year: number; quarter: number } {
     return this.getQuarterAndYear(new Date());
   }
 
   /**
    * Gets the next quarter and year
    */
   static getNextQuarter(year: number, quarter: number): { year: number; quarter: number } {
     if (quarter === 4) {
       return { year: year + 1, quarter: 1 };
     }
     return { year, quarter: quarter + 1 };
   }
 
   /**
    * Gets the previous quarter and year
    */
   static getPreviousQuarter(year: number, quarter: number): { year: number; quarter: number } {
     if (quarter === 1) {
       return { year: year - 1, quarter: 4 };
     }
     return { year, quarter: quarter - 1 };
   }
 
   /**
    * Gets an array of quarters between two dates
    */
   static getQuartersBetweenDates(startDate: Date, endDate: Date): Array<{ year: number; quarter: number }> {
     const quarters: Array<{ year: number; quarter: number }> = [];
     const start = this.getQuarterAndYear(startDate);
     const end = this.getQuarterAndYear(endDate);
 
     let currentYear = start.year;
     let currentQuarter = start.quarter;
 
     while (
       currentYear < end.year || 
       (currentYear === end.year && currentQuarter <= end.quarter)
     ) {
       quarters.push({ year: currentYear, quarter: currentQuarter });
       const next = this.getNextQuarter(currentYear, currentQuarter);
       currentYear = next.year;
       currentQuarter = next.quarter;
     }
 
     return quarters;
   }
 
   /**
    * Formats quarter and year to a readable string
    */
   static formatQuarter(year: number, quarter: number): string {
     return `Q${quarter} ${year}`;
   }
 
   /**
    * Gets the quarter duration in milliseconds
    */
   static getQuarterDuration(year: number, quarter: number): number {
     const start = this.getQuarterStartDate(year, quarter);
     const end = this.getQuarterEndDate(year, quarter);
     return end.getTime() - start.getTime();
   }
 }



 export class QuarterDate {
   
   constructor(
    public date: Date = new Date(),
    public year: number = date.getFullYear(),
    public quarter: number = Math.floor(date.getMonth() / 3) + 1,
  ) {}

  setDate(date: Date) {
    this.date = date;
    this.year = date.getFullYear();
    this.quarter = Math.floor(date.getMonth() / 3) + 1;
  }

  setYearAndQuarter(year: number, quarter: number) {
    this.year = year;
    this.quarter = quarter;
  }

  // Get actual year and quarter in one object
  getActualYearAndQuarter() {
    return {
      actualYear: this.date.getFullYear(),
      actualQuarter: Math.floor(this.date.getMonth() / 3) + 1
    }
  }

  getFollowingYearAndQuarter() {
    const currentQuarter = Math.floor(this.date.getMonth() / 3) + 1;
    const currentYear = this.date.getFullYear();

    if (currentQuarter === 4) {
      return {
        year: currentYear + 1,
        quarter: 1
      };
    }

    return {
      followingYear: currentYear,
      followingQuarter: currentQuarter + 1
    };
  }

  getPreviousYearAndQuarter() {
    const currentQuarter = Math.floor(this.date.getMonth() / 3) + 1;
    const currentYear = this.date.getFullYear();

    if (currentQuarter === 1) {
      return {
        previousYear: currentYear - 1,
        previousQuarter: 4
      };
    }

    return {
      previousYear: currentYear,
      previousQuarter: currentQuarter - 1
    };
  }
}