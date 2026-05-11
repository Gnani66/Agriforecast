import type { Metadata } from "next";
import "./globals.css";
import AuthWrapper from "@/components/providers/AuthWrapper";

export const metadata: Metadata = {
  title: "AgriForecast - Smart Agriculture Platform",
  description: "AI-powered demand forecasting for agricultural supply chains. Improve inventory planning, reduce food waste, and optimize operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased text-slate-700">
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
