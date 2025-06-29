"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadReceipt } from "@/lib/upload";
import { supabase } from "@/lib/supabase";
import { Label } from "@/components/ui/label";

export function ExpenseEditModal({
  expense,
  onUpdated,
}: {
  expense: {
    id: string;
    title: string;
    amount: number;
    receipt_url: string;
  };
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    let receiptUrl = expense.receipt_url;

    if (file) {
      const user = (await supabase.auth.getUser()).data.user;
      receiptUrl = await uploadReceipt(file, user!.id);
    }

    const { error } = await supabase
      .from("expenses")
      .update({
        title,
        amount: parseFloat(amount),
        receipt_url: receiptUrl,
      })
      .eq("id", expense.id);

    if (!error) {
      setOpen(false);
      onUpdated();
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <Label>Upload New Receipt</Label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
