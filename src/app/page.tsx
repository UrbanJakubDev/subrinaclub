import Donut from "@/components/ui/charts/donutChart";

export default async function Home() {

  // Render the page with the user data
  return (
    <div className="content-container">
      Subrina club
      <div className="flex px-6 gap-4">
        <Donut />
      </div>
    </div>
  );
}
