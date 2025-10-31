import { getAuthUser } from "@/lib/auth";
import DashboardClient from "@/components/DashboardClient";
import Header from "@/components/ui/Header";

export default async function Home() {
  const user = await getAuthUser();
  
  if (!user) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg text-muted-foreground">Please log in to see data.</div>
        </div>
      </>
    );
  }

  return <DashboardClient />;
}
