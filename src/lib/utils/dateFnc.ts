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
    years.push({ value: i, label: i.toString() });
  }
  return years;
};

export const quarterSelectOptions = () => {
  return [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
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

// Forat timestamp to date string Return in format "DD-MM-YYYY HH:MM"
export const timestampToDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day < 10 ? "0" + day : day}-${month < 10 ? "0" + month : month}-${year} ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
}

export const formatDateToCz = (date: string | Date | null): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('cs-CZ', { timeZone: 'UTC' });
};