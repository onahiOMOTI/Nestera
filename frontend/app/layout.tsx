import "./globals.css";

import type { Metadata } from "next";
import { WalletProvider } from "./context/WalletContext";

export const metadata: Metadata = {
  title: "Nestera - Decentralized Savings on Stellar",
  description: "Secure, transparent savings powered by Stellar & Soroban",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
