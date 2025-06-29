"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Donation = {
  id: string;
  house_name: string;
  amount: number;
  is_secret: boolean;
  item?: string;
};

export default function DonatePage() {
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [houseName, setHouseName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const [item, setItem] = useState("");

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setDonations(data as Donation[]);
  };

  const addDonation = async () => {
    const { data, error } = await supabase
      .from("donations")
      .insert({
        house_name: houseName,
        amount: parseFloat(amount),
        is_secret: isSecret,
        item: isSecret ? item : null,
      })
      .select();

    if (!error && data) {
      setDonations([data[0], ...donations]);
      setHouseName("");
      setAmount("");
      setItem("");
      setIsSecret(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <h1 className="text-lg font-bold">Add Donation</h1>

      <div className="space-y-2">
        <Input
          placeholder="House Name"
          value={houseName}
          onChange={(e) => setHouseName(e.target.value)}
        />
        <Input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="secret"
            checked={isSecret}
            onCheckedChange={(val) => setIsSecret(val as boolean)}
          />
          <Label htmlFor="secret">Secret Donation</Label>
        </div>

        {isSecret && (
          <Input
            placeholder="Item (e.g. Speaker, Decor)"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
        )}

        <Button onClick={addDonation}>Submit Donation</Button>
      </div>

      <ul className="space-y-2 mt-4">
        {donations.map((don) => (
          <li
            key={don.id}
            className="p-2 border rounded flex justify-between items-center"
          >
            <div>
              <div className="font-medium">
                {don.house_name} — ₹ {don.amount}
              </div>
              {don.is_secret && (
                <div className="text-sm text-yellow-700">
                  Secret for: {don.item || "Unknown"}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/donate/edit/${don.id}`)}
            >
              Edit
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
