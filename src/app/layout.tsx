import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArteViva Sublimação",
  description: "Loja de sublimação"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
