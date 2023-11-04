"use client";
import { useFirestore } from "@/app/firebase/FirestoreContext";
import { auth } from "@/app/firebase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const { user } = useFirestore();
  const router = useRouter();

  return (
    <div>
      <header className="flex justify-between  p-4">
        <h1 className="text-3xl font-bold underline">
          <Link href="/">HackerMatch</Link>
        </h1>

        {user ? (
          <div>
            <Link className="mr-2 text-blue-500 underline" href="/dashboard">
              Dashboard
            </Link>
            <button
              className="text-h6 bg-red-500 text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-4 py-2"
              onClick={async () => {
                if (auth.currentUser) {
                  await auth.signOut();
                }
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={async () => {
              if (user) {
                router.push("/dashboard");
              } else {
                router.push("/login");
              }
            }}
            className="text-h5 bg-blue-500 text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-4 py-2"
          >
            Start Now
          </button>
        )}
      </header>
    </div>
  );
};

export default Navbar;
