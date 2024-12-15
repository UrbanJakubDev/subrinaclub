import PageComponent from "@/components/features/detailPage/pageComponent";
import SalesManagerForm from "@/components/features/salesManager/salesManagerForm";
import Button from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import Typography from "@/components/ui/typography";
import { fetchSalesManagerByIdFromDB } from "@/lib/db/queries/salesManagers";
import { salesManagerService } from "@/lib/services/salesManager";
import Link from "next/link";

type SalesManagersDetailProps = {
  params: { id: string };
};

export default async function SalesManagersDetail({ params }: SalesManagersDetailProps) {
  const isNewSalesManager = params.id === "new";

  if (isNewSalesManager) {
    return (
      <PageComponent>
        <div className="mx-auto w-8/12">
          <SalesManagerForm />
        </div>
      </PageComponent>
    );
  }

  const salesManagerId = parseInt(params.id);
  const salesManager = await salesManagerService.get(salesManagerId);

  if (!salesManager) {
    return <Loader />;
  }

  return (
    <PageComponent>
      <div className="w-full mb-4 p-6 flex flex-row justify-between bg-white shadow-lg rounded-xl">
        <Link href="/sales-managers">
          <Button>&lt;&lt;</Button>
        </Link>
        <Typography variant="h5" color="black">
          Editace - {salesManager.fullName}
        </Typography>
        <Link href={`/sales-managers/${salesManager.id}/stats`}>
          <Button>
            <span>Statistiky</span>
          </Button>
        </Link>
      </div>
      <div className="mx-auto w-8/12">
        <SalesManagerForm initialSalesManagerData={salesManager} />
      </div>
    </PageComponent>
  );
}