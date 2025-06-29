"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function EditDonationPage() {
  const { id } = useParams();
  const router = useRouter();

  const [houseName, setHouseName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDonation = async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        alert("Failed to fetch donation");
        return;
      }
      setHouseName(data.house_name);
      setAmount(String(data.amount));
      setIsSecret(data.is_secret);
      setItem(data.item || "");
    };

    fetchDonation();
  }, [id]);

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("donations")
      .update({
        house_name: houseName,
        amount: parseFloat(amount),
        is_secret: isSecret,
        item: isSecret ? item : null,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert("Update failed");
    } else {
      router.push("/donate");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-lg font-bold">Edit Donation</h1>

      <Input
        value={houseName}
        onChange={(e) => setHouseName(e.target.value)}
        placeholder="House Name"
      />
      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />

      <div className="flex items-center gap-2">
        <Checkbox
          id="secret"
          checked={isSecret}
          onCheckedChange={(val) => setIsSecret(!!val)}
        />
        <Label htmlFor="secret">Secret Donation</Label>
      </div>

      {isSecret && (
        <Input
          value={item}
          onChange={(e) => setItem(e.target.value)}
          placeholder="Item (e.g. Speaker, Decor)"
        />
      )}

      <Button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Donation"}
      </Button>
    </div>
  );
}
