import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Azeret_Mono, Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FirestoreProvider } from "./firebase/FirestoreContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const azeretMono = Azeret_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HackerMatch",
  description: "Helping Hackers Make Matches",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" />
      <body className={`${inter.className} ${azeretMono.className}`}>
        <FirestoreProvider>
          <ToastContainer position="top-center" />
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
