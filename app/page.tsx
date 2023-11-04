"use client";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/client";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  return (
    <main className="flex flex-col items-center mx-4 md:mx-16 mt-10">
      Click here to login!
      <button
        onClick={async () => {
          if (user) {
            router.push("/home");
          } else {
            router.push("/login");
          }
        }}
        className="text-h5 bg-blue-500 text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-8 py-4"
      >
        Start Now
      </button>
    </main>
  );
}
