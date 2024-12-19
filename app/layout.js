import localFont from "next/font/local";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { DataProvider } from "../context/DataContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Techser Analysis App",
  description: "Techser Service Analysis Dashboard",
};

export default async function RootLayout({ children }) {
  const session = await auth();

  console.log("from layout: " + JSON.stringify(session));

  return (
    <DataProvider session={session}>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Navbar session={session} />
          {children}
          <SpeedInsights />
        </body>
      </html>
    </DataProvider>
  );
}
