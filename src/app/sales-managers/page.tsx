import SalesManagerTable from "@/components/tables/salesManagertable";
import { getSalesManagers } from "@/db/queries/salesManagers";

export default async function SalesManagers() {
  const salesManagers = await getSalesManagers();

   return (
     <div className="content-container">
       <h1>SalesManagers</h1>
        <SalesManagerTable defaultData={salesManagers} detailLinkPath="sales-managers/" />
       <pre>
          {JSON.stringify(salesManagers, null, 2)}
       </pre>
     </div>
   );
 }
 