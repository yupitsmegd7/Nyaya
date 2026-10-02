import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Nyaya | Your first step to justice", description: "Understand Indian laws, find official legal text, emergency helplines and next steps for your situation. An independent legal information resource.", icons: {icon:"/favicon.svg",shortcut:"/favicon.svg"} };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
