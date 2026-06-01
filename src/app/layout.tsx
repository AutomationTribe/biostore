import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BioStore - Link-in-Bio for African Creators",
  description:
    "Create a link-in-bio page and sell digital products with BioStore",
};

/**
 * Root layout component
 * Wraps all pages and provides global styles and providers
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
