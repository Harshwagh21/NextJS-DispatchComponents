import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dispatch Dashboard",
    template: "%s | Dispatch",
  },
  description: "Fleet management and analytics dashboard",
  keywords: ["fleet", "management", "dispatch", "analytics"],
};

const darkModeScript = `try{const m=localStorage.getItem('dark-mode');const d=document.documentElement;d.classList.toggle('dark',m==='true'||(m!=='false'&&window.matchMedia('(prefers-color-scheme: dark)').matches));}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: darkModeScript }} />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
