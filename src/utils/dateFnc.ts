export const dbDateToInputDate = (date: string) => {
      return date ? new Date(date).toISOString().split('T')[0] : '';
   };

export const inputDateToDbDate = (date: string) => {
      return date + "T00:00:00.000Z";
   };