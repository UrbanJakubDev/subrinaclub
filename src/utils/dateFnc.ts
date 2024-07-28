export const dbDateToInputDate = (date: string) => {
  return date ? new Date(date).toISOString().split("T")[0] : "";
};

export const inputDateToDbDate = (date: string) => {
  return date + "T00:00:00.000Z";
};

export const yearSelectOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= 2010; i--) {
    years.push({ id: i, name: i.toString() });
  }
  return years;
};

export const quarterSelectOptions = () => {
  return [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
  ];
};



export const returnLastQuarter = (yq: string): string => {
  // Extract year and quarter from the input string
  const [yearStr, quarterStr] = yq.split("-");
  const year = parseInt(yearStr);
  const quarter = parseInt(quarterStr);

  // Check if the quarter is the first quarter
  if (quarter === 1) {
    // If it is the first quarter, return the last quarter of the previous year
    return `${year - 1}-04`;
  } else {
    // Otherwise, return the previous quarter of the same year
    const previousQuarter = quarter - 1;
    // Format previous quarter as two digits (e.g., "02", "03")
    const formattedQuarter = previousQuarter < 10 ? `0${previousQuarter}` : previousQuarter;
    return `${year}-${formattedQuarter}`;
  }
}

