import DealerTable from "@/components/tables/dealerTable";
import { getDealers } from "@/db/queries/dealers";

export default async function Dealers() {
   const dealers = await getDealers();
  return (
    <div className="content-container">
      <h1>Dealers</h1>
      <DealerTable defaultData={dealers} detailLinkPath="/dealers"/>
    </div>
  );
}
