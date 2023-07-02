import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SoveiLive - The social network where you really control your data",
  description:
    "The social network where you really control your data, thanks to web3.",
};

import Page from "./app";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Page>{children}</Page>
      </body>
    </html>
  );
}
