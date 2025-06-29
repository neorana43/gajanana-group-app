"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert("Error logging in");
    else alert("Check your email for login link");
  };

  return (
    <div className="p-4 max-w-sm mx-auto mt-20 flex flex-col gap-4">
      <h2 className="text-xl font-bold">Login</h2>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
      />
      <Button onClick={handleLogin}>Send Magic Link</Button>
    </div>
  );
}
