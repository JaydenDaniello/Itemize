import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Itemize | Smart Shopping Lists",
  description:
    "Build smart shopping lists from your favorite recipes. Compare prices and find the best deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}