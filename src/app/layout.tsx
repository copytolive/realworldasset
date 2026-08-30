import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RWA.MS",
  description: "Real-world asset platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
