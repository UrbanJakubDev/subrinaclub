export function getCurrentQuarter() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const quarter = Math.floor(month / 3) + 1;

    return { year, quarter };
}

export function getNextQuarter(year: number, quarter: number, quartersAhead: number = 1) {
    // Calculate total quarters
    let totalQuarters = quarter + quartersAhead;
    
    // Calculate new year and quarter
    const newYear = year + Math.floor((totalQuarters - 1) / 4);
    const newQuarter = ((totalQuarters - 1) % 4) + 1;

    return { year: newYear, quarter: newQuarter };
} 