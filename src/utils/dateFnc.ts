export const dbDateToInputDate = (date: string) => {
  return date ? new Date(date).toISOString().split("T")[0] : "";
};

export const inputDateToDbDate = (date: string) => {
  return date + "T00:00:00.000Z";
};

export const yearSelectOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= 2017; i--) {
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