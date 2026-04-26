import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
export default async function DashboardLayout({ children }: { children:React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:"#FEF6EC" }}>
      <Sidebar/>
      <main style={{ flex:1, overflowY:"auto", padding:"32px 40px" }}>
        <div style={{ maxWidth:580, margin:"0 auto" }}>{children}</div>
      </main>
    </div>
  );
}
