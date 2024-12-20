import type { Metadata } from "next";
import "./globals.css";
import { Rubik } from 'next/font/google';

const rubic = Rubik({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={rubic.className}
      >
        {children}
      </body>
    </html>
  );
}
