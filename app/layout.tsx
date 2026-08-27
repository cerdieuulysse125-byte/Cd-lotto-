import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "C&D Lotto - C&D Verite Lotto",
  description: "C&D Verite Lotto - Platfom vann bolet profesyonel 07 21 38 - POS Ready",
  manifest: "/manifest.json",
  themeColor: "#ffcc00",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ht">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffcc00" />
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(reg) { console.log('SW registered'); })
                    .catch(function(err) { console.log('SW fail', err); });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
