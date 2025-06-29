"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Fund = {
  id: string;
  name: string;
  amount: number;
};

export default function FundsPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const fetchFunds = async () => {
    const { data, error } = await supabase
      .from("funds")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setFunds(data as Fund[]);
  };

  const addFund = async () => {
    const { data, error } = await supabase
      .from("funds")
      .insert({ name, amount: parseFloat(amount) })
      .select();
    if (!error && data) {
      setFunds([data[0], ...funds]);
      setName("");
      setAmount("");
    }
  };

  const deleteFund = async (id: string) => {
    const { error } = await supabase.from("funds").delete().eq("id", id);
    if (!error) setFunds(funds.filter((f) => f.id !== id));
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <h1 className="text-lg font-bold">Manage Funds</h1>

      <div className="space-y-2">
        <Input
          placeholder="Fund name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button onClick={addFund}>Add Fund</Button>
      </div>

      <ul className="space-y-2 mt-4">
        {funds.map((fund) => (
          <li
            key={fund.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <div className="font-medium">{fund.name}</div>
              <div className="text-sm text-muted-foreground">
                ₹ {fund.amount}
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteFund(fund.id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
