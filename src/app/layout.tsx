import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ancola = localFont({
  src: [
    {
      path: "../../public/fonts/ancola/ancola-regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ancola/ancola-italic.ttf",
      weight: "400",
      style: "italic",
    }
  ],
  variable: "--font-ancola",
  display: "swap",
});

const openSauce = localFont({
  src: [
    {
      path: "../../public/fonts/open-sauce/OpenSauceOne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-sauce/OpenSauceOne-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-sauce/OpenSauceOne-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-sauce/OpenSauceOne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-sauce/OpenSauceOne-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/open-sauce/OpenSauceOne-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-open-sauce",
  display: "swap",
});

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { ConfirmDialogProvider } from "@/components/ui/ConfirmDialogProvider";
import AdminLoginModal from "@/components/AdminLoginModal";
import ErrorToastHandler from "@/components/ErrorToastHandler";

export const metadata: Metadata = {
  title: "Christ Revelation Church",
  description: "Welcome to Christ Revelation Church",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${ancola.variable} ${openSauce.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ConfirmDialogProvider>
          <Navbar />
          {children}
          <Footer />
          <AdminLoginModal />
          <ErrorToastHandler />
          <Toaster position="top-center" />
        </ConfirmDialogProvider>
      </body>
    </html>
  );
}
