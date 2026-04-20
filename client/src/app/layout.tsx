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

        <style jsx>{`
          .app-container {
            display: flex;
            min-height: 100vh;
            background: var(--bg-primary);
            overflow: hidden;
          }

          .main-content {
            flex: 1;
            padding: 2rem;
            min-height: 100vh;
            background: linear-gradient(135deg, var(--bg-primary) 0%, #0a0a0a 100%);
            position: relative;
            z-index: 10;
            overflow-y: auto;
            border-left: 1px solid rgba(255, 255, 255, 0.05);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
          }

          /* Scanline effect */
          .main-content::before {
            content: " ";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                        linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 100;
            background-size: 100% 4px, 3px 100%;
            pointer-events: none;
            opacity: 0.1;
          }
        `}</style>
      </body>
    </html>
  );
}

