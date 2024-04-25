import { getDealerById } from "@/db/queries/dealers";

export default async function DealersDetail({ params }: { params: { id: string } })  {

  let dealer_id = parseInt(params.id);
  const dealer = await getDealerById(dealer_id);

  return (
    <div className="content-container">
      <h1>Dealers Detail</h1>
      <pre>
        {JSON.stringify(dealer, null, 2)}
      </pre>
    </div>
  );
}
