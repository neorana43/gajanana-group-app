"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { uploadReceipt } from "@/lib/upload";
import { Label } from "@/components/ui/label";
import { downloadCSV } from "@/lib/export-csv";
import { ExpenseEditModal } from "./ExpenseEditModal";
import { MonthYearFilter } from "@/components/ui/MonthYearFilter";

type Expense = {
  id: string;
  title: string;
  amount: number;
  receipt_url: string;
};

export default function ExpensePage() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const from = new Date(year, month, 1).toISOString();
  const to = new Date(year, month + 1, 1).toISOString();

  const fetchExpenses = async () => {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .gte("created_at", from)
      .lt("created_at", to);
    if (data) {
      setExpenses(data);
      setAllExpenses(data);
    }
  };

  const handleAddExpense = async () => {
    if (!receipt) return alert("Please upload a bill");

    const user = (await supabase.auth.getUser()).data.user;
    const receiptUrl = await uploadReceipt(receipt, user!.id);

    const { data } = await supabase
      .from("expenses")
      .insert({
        title,
        amount: parseFloat(amount),
        receipt_url: receiptUrl,
        spent_by: user!.id,
      })
      .select();

    if (data) {
      setExpenses([data[0], ...expenses]);
      setTitle("");
      setAmount("");
      setReceipt(null);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-lg font-bold">
        Submit Expense{" "}
        <MonthYearFilter
          onChange={(m, y) => {
            setMonth(m);
            setYear(y);
          }}
        />
      </h1>
      <Button
        variant="outline"
        onClick={() => downloadCSV(allExpenses, "expenses.csv")}
      >
        Export Expenses CSV
      </Button>
      <div className="space-y-2">
        <Input
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="space-y-1">
          <Label htmlFor="receipt">Upload Receipt (PDF/Image)</Label>
          <Input
            id="receipt"
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
          />
        </div>

        <Button onClick={handleAddExpense}>Submit Expense</Button>
      </div>

      <ul className="mt-4 space-y-3">
        {expenses.map((exp) => (
          <li key={exp.id} className="border p-2 rounded space-y-1">
            <div className="font-medium">
              {exp.title} — ₹{exp.amount}
            </div>
            <a
              href={exp.receipt_url}
              target="_blank"
              className="text-sm text-blue-600 underline"
            >
              View Receipt
            </a>
            <div>
              <ExpenseEditModal expense={exp} onUpdated={fetchExpenses} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
