import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Azeret_Mono, Inter } from "next/font/google";
import { FirestoreProvider } from "./firebase/FirestoreContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const azeretMono = Azeret_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HackerMatch",
  description: "Ballin since 1969",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${azeretMono.className}`}>
        <FirestoreProvider>
          <Navbar />
          <main>
            <div className="my-8">{children}</div>
          </main>

          <footer></footer>
        </FirestoreProvider>
      </body>
    </html>
  );
}
