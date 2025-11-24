import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { ContactModalProvider } from "@/providers/ContactModalProvider";

export const metadata: Metadata = {
  title: "Atlas, Inc",
  description: "We Are Atlas",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <ContactModalProvider>{children}</ContactModalProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
