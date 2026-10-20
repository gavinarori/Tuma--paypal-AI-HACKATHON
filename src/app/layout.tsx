import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Backdrop } from "./art";

// latin-ext covers letters like Ẹ and ọ̀ used in Yoruba and Twi greetings
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Tuma: send money home",
  description: "Tell Tuma who to pay and how much. Pay with PayPal, and track it until it arrives.",
};

export const viewport: Viewport = { colorScheme: "light", themeColor: "#0e7c5a" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Backdrop />
        {children}
      </body>
    </html>
  );
}