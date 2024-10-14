import SalesManagerFormComponent from "@/components/forms/salesManagerFormComponent";
import PageComponent from "@/components/detailPage/pageComponent";
import Button from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { getSalesManagerById } from "@/db/queries/salesManagers";
import Link from "next/link";


export default async function SalesManagersDetail({
  params,
}: {
  params: { id: string };
}) {

  if (params.id === "new") {
    return (
      <PageComponent>
        <div>
          {/* <PageHeader userName="Nový obchodní zástupce" userId="Nový" /> */}
        </div>
        <div className="mx-auto w-8/12">
          <SalesManagerFormComponent />
        </div>
      </PageComponent>
    );
  }

  let sales_manager_id = parseInt(params.id);
  const sales_manager = await getSalesManagerById(sales_manager_id);

  if (!sales_manager) {
    return <div>Loading...</div>;
  }

  return (
    <PageComponent>
      {/* <div>
        <PageHeader
          userName={sales_manager.fullName}
          userId={sales_manager_id.toString()}
          active={sales_manager?.active}
          statsUrl={`/sales-managers/${sales_manager_id}/stats`}
        />
      </div> */}

      <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
        <Link href="/sales-managers">
          <Button>{"<<"}</Button>
        </Link>
        <Typography variant="h5" color="black">Editace  - {sales_manager.fullName}</Typography>
        <Link href={`/sales-managers/${sales_manager.id}/stats`}>
          <Button>
            <span>Statistiky</span>
          </Button>
        </Link>
      </div>


      <div className="mx-auto w-8/12">
        <SalesManagerFormComponent initialSalesManagerData={sales_manager} />
      </div>
    </PageComponent>
  );
}
