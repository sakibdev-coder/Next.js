import type { Metadata } from "next";
import "./globals.css";
import { FitLogProvider } from "./fitlog";

export const metadata: Metadata = {
  title: "FitLog — Workout Library",
  description: "Train with intent. Log every set.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en"><body><FitLogProvider>{children}</FitLogProvider></body></html>
  );
}
