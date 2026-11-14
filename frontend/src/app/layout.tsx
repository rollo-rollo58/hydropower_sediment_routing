import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cascade / Reservoir Intelligence",
  description: "Hydropower reservoir operations simulator and sediment workbench"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
