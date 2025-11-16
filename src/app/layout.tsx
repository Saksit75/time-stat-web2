import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
// 
const thaiSarabun = Sarabun({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  subsets: ['thai', 'latin'],
  variable: '--font-sarabun',
})

export const metadata: Metadata = {
  title: "Time Stat",
  description: "ระบบบันทึกข้อมูลการมาเรียน",
    icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${thaiSarabun.variable}`}
      >
          {children}

      </body>
    </html>
  );
}
