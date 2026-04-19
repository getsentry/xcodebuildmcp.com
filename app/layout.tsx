import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://xcodebuildmcp.com"),
  title: "XcodeBuildMCP - AI-Powered Xcode Automation",
  description:
    "Let AI assistants build, test, and debug your iOS apps autonomously. XcodeBuildMCP bridges the gap between AI agents and Xcode.",
  openGraph: {
    title: "XcodeBuildMCP - AI-Powered Xcode Automation",
    description:
      "Let AI assistants build, test, and debug your iOS apps autonomously. XcodeBuildMCP bridges the gap between AI agents and Xcode.",
    type: "website",
    url: "https://xcodebuildmcp.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "XcodeBuildMCP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XcodeBuildMCP - AI-Powered Xcode Automation",
    description:
      "Let AI assistants build, test, and debug your iOS apps autonomously. XcodeBuildMCP bridges the gap between AI agents and Xcode.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800&family=Roboto+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
