import { FundChart } from "@/components/charts/FundChart";

export default function DashboardPage() {
  return (
    <main className="p-4">
      <h1 className="text-lg font-bold">Gajanana Dashboard</h1>
      <FundChart />
    </main>
  );
}
