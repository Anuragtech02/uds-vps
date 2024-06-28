import type { Metadata } from "next";
import "@/styles/style.scss";
import Appwrapper from "@/components/Appwrapper";

export const metadata: Metadata = {
  title: "Univdatos",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Appwrapper>{children}</Appwrapper>
      </body>
    </html>
  );
}
