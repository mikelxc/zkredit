import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ZKredit - Privacy-Preserving Financial Passport for AI Agents",
  description:
    "Enabling AI agents to operate across multiple blockchains using zero-knowledge verified asset claims—without requiring asset transfers or pre-funding.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} dark`}>
          {children}
      </body>
    </html>
  )
}

