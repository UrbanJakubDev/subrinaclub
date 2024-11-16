type SimpleTableProps = {
   
   data: any[];
   };

export default function SimpleTable({ data }: SimpleTableProps) {
   if (!data || data.length === 0) {
      return <div>No data available</div>;
    }

    // Drop columna "createdAt" and "id" from the data array
      data = data.map((item) => {
         delete item.createdAt;
         delete item.id;
         return item;
      });
  
    // Get the column headers dynamically from the keys of the first item in the data array
    const columns = Object.keys(data[0]);
  
    return (
      <table className="w-full table-auto ">
        <thead className="bg-zinc-300">
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-zinc-100">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-zinc-200">
              {columns.map((column, columnIndex) => (
                <td key={columnIndex}>{item[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
