import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import CalendarPanel from "@/components/CalendarPanel";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "PP - Progress Over Perfection",
  description: "Personal productivity and life management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts are now imported in globals.css */}
      </head>
      <body>
        <AuthProvider>
          <div className="app-container">
            <Sidebar />
            
            <main className="main-content">
              {children}
            </main>

            <CalendarPanel />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
