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
  links: [
    { rel: "preload", href: "/_next/static/css/app/dashboard/region/page.css", as: "style" },
    { rel: "preload", href: "/_next/static/css/app/dashboard/engineer/page.css", as: "style" },
    { rel: "preload", href: "/_next/static/css/app/dashboard/branch/page.css", as: "style" },
    { rel: "preload", href: "/_next/static/css/app/layout.css", as: "style" },
  ],
};

export default async function RootLayout({ children }) {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const loggedUser = session?.user;

  return (
    <DataProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} text-sm`}>
          <Navbar isAuthenticated={isAuthenticated} session={session} loggedUser={loggedUser} />
          {children}
          <SpeedInsights />
        </body>
      </html>
    </DataProvider>
  );
}
