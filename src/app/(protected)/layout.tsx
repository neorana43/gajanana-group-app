import { ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-muted p-4 flex flex-col gap-3">
        <h1 className="text-xl font-bold">Gajanana</h1>
        <Link href="/dashboard">🏠 Dashboard</Link>
        <Link href="/donate">🙏 Add Donation</Link>
        <Link href="/expense">💸 Add Expense</Link>
        {isAdmin && (
          <>
            <Link href="/funds">🏦 Manage Funds</Link>
            <Link href="/secret">🔒 Secret Overview</Link>
          </>
        )}
        <form action="/logout" method="post">
          <button className="text-red-500 mt-auto">Logout</button>
        </form>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 overflow-auto">{children}</main>
    </div>
  );
}
