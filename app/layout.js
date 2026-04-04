import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import GlobalProvider from "@/components/shared/GlobalProvider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PandaBees | Admin",
  description: "Modern Ecommerce Experience",
  icons: {
    icon: "/images/favicon.ico",
  },
};


import { TooltipProvider } from "@/components/ui/tooltip";

import { ThemeProvider } from "@/components/shared/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </GlobalProvider>
        </ThemeProvider>
        <Toaster position="bottom-right" />
      </body>

    </html>
  );
}



