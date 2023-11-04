"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/client";

export default function Onboarding() {
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/login");
    }
  }, []);

  return (<div>

  </div>);
}
