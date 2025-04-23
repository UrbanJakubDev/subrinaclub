import Typography from "@/components/ui/typography";
import PageComponent from "@/components/features/detailPage/pageComponent";
import AccountTableWithData from "@/components/features/customer/account/AccountTable";


export default function AccountsPage() {
   return (
      <PageComponent>
         <Typography variant="h2" color="black" className="mb-6">
            Seznam účtů
         </Typography>
            <AccountTableWithData />
      </PageComponent>
   );
} 