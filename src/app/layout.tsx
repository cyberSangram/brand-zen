import type { Metadata } from "next";
import { Inter, Nunito, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";



const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"]
})

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"]
})



const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jarkarta",
  subsets: ["latin"]
})



export const metadata: Metadata = {
  title: "Brand Name Generator",
  description: "Generate you custom brand name by leveraging the Power of AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${inter.variable} ${jakarta.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
