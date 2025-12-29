import "./globals.css";

export const metadata = {
  title: "BrandKiller - Find Generic Alternatives",
  description: "Search for generic equivalents of brand name products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

