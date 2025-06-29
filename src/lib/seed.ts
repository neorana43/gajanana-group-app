import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function seed() {
  console.log("🌱 Seeding database...");

  const adminEmail = "admin@gajanana.com";
  const userEmail = "user@gajanana.com";

  // 1. Create admin and user via Auth manually (magic link)
  const { data: admin } = await supabase
    .from("profiles")
    .upsert([
      { id: "admin-uid-placeholder", full_name: "Admin User", role: "admin" },
    ])
    .select();
  const { data: user } = await supabase
    .from("profiles")
    .upsert([
      { id: "user-uid-placeholder", full_name: "Normal User", role: "user" },
    ])
    .select();

  // 2. Seed funds
  const fundNames = ["Main Fund", "Cultural Program Fund", "Decoration Fund"];
  for (const name of fundNames) {
    await supabase.from("funds").insert({
      name,
      amount: Math.floor(Math.random() * 10000 + 1000),
      created_by: admin?.[0]?.id,
    });
  }

  // 3. Seed donations
  for (let i = 1; i <= 10; i++) {
    await supabase.from("donations").insert({
      house_name: `House ${i} - Family ${String.fromCharCode(64 + i)}`,
      amount: Math.floor(Math.random() * 3000 + 500),
      is_secret: i % 4 === 0,
      item: i % 4 === 0 ? `Item ${i}` : null,
      created_by: i % 4 === 0 ? admin?.[0]?.id : user?.[0]?.id,
    });
  }

  // 4. Seed expenses
  for (let i = 1; i <= 5; i++) {
    await supabase.from("expenses").insert({
      title: `Expense ${i}`,
      amount: Math.floor(Math.random() * 2000 + 300),
      spent_by: user?.[0]?.id,
      receipt_url: "https://via.placeholder.com/200", // Dummy URL
    });
  }

  console.log("✅ Done!");
}

seed();
