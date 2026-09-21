import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "ParkPay — Parking Lot Management",
  description: "Parking lot management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full" data-theme="light" style={{ "--font-family": "'Inter', 'sans-serif'", "--border-radius": "6px", "--white": "#ffffff", "--dark": "#030625" }}>
      <head>
        {/* App Router: <link> tags in the root layout apply to every page —
            unlike the Pages Router, no _document.js is needed for this. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
