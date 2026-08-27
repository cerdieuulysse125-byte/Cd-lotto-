import React from "react"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ht">
      <body style={{margin:0}}>{children}</body>
    </html>
  )
}
