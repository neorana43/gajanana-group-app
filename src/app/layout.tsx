import "@/styles/globals.css";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background text-foreground")}>
        {children}
      </body>
    </html>
  );
}
