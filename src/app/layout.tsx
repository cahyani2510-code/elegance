import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cahyani — Digital Space",
    template: "%s | Cahyani",
  },
  description:
    "Portfolio pribadi Cahyani, mahasiswa Sistem Informasi di Universitas Pembangunan Jaya.",
  keywords: [
    "Cahyani",
    "portfolio",
    "Sistem Informasi",
    "Universitas Pembangunan Jaya",
  ],
  openGraph: {
    title: "Cahyani — Digital Space",
    description:
      "Portfolio pribadi Cahyani — ideas, technology, and meaningful projects.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans antialiased"
        style={
          {
            "--font-serif": '"Playfair Display", Georgia, serif',
            "--font-sans": '"Inter", "Helvetica Neue", Arial, sans-serif',
          } as React.CSSProperties
        }
      >
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
