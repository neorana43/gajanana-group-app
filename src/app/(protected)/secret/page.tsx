"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { downloadCSV } from "@/lib/export-csv";
import { Button } from "@/components/ui/button";

type Donation = {
  amount: number;
  is_secret: boolean;
  item?: string | null;
};

export default function SecretPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [allDonations, setAllDonations] = useState<Donation[]>([]);

  const fetchDonations = async () => {
    const { data } = await supabase
      .from("donations")
      .select("amount, is_secret, item");

    if (data) {
      setDonations(data);
      setAllDonations(data);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  // Aggregate data
  const mainTotal = donations
    .filter((d) => !d.is_secret)
    .reduce((sum, d) => sum + d.amount, 0);

  const secretTotal = donations
    .filter((d) => d.is_secret)
    .reduce((sum, d) => sum + d.amount, 0);

  const itemBreakdown = donations
    .filter((d) => d.is_secret && d.item)
    .reduce<Record<string, number>>((acc, d) => {
      const item = d.item || "Other";
      acc[item] = (acc[item] || 0) + d.amount;
      return acc;
    }, {});

  const chartData = [
    { name: "Main Fund", amount: mainTotal },
    { name: "Secret Fund", amount: secretTotal },
  ];

  const itemChartData = Object.entries(itemBreakdown).map(([item, amount]) => ({
    name: item,
    amount,
  }));

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-lg font-bold">Secret Donation Overview</h1>
      <Button
        variant="outline"
        onClick={() => downloadCSV(allDonations, "donations.csv")}
      >
        Export Donations CSV
      </Button>

      <div className="border rounded-lg p-4 bg-muted">
        <h2 className="font-semibold mb-2">Combined Donation Chart</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-lg p-4 bg-muted">
        <h2 className="font-semibold mb-2">
          Secret Donation Breakdown (by Item)
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={itemChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
