"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/client";
import Form from "./components/Form";

export default function Onboarding() {
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  return (
    <div className="flex flex-col items-center mx-5 md:mx-16 mt-10">
      {/* hero section */}
      <div className="flex flex-col md:flex-row items-center justify-center mx-4 lg:mx-16 gap-6">
        {/* Left flex box with large text */}
        <div className="flex-1">
          <h1 className="text-8xl font-bold mb-16">
            <span className="text-hacker-green">First, let&#39;s get to know</span>
            <span className="text-match-pink"> you </span>
            <span className="text-hacker-green">a little bit better</span>
            <span className="text-match-pink"> ^_^</span>
          </h1>
        </div>

        {/* Right flex box replaced with a Form component */}
        <div className="flex-1">
          <div>
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}
