"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { auth } from "../firebase/client";

export default function Login() {
  const [loading, setLoading] = useState(false);
  // const [user, authLoading] = useAuthState(auth);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4 mt-10">Login</h1>
      {!loading ? (
        <button
          onClick={async () => {
            const provider = new GoogleAuthProvider();
            const userInfo = await signInWithPopup(auth, provider);

            setLoading(true);
            const response = await fetch("/api/users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                uid: userInfo.user.uid,
                displayName: userInfo.user.displayName,
                photoUrl: userInfo.user.photoURL,
              }),
            });
            setLoading(false);

            if (!response.ok) {
              toast.error("Error inserting user, check console");
              console.log(await response.json());
              return;
            }

            if (response.status === 201) {
              console.log("new user pushing to onboarding");

              router.push("/onboarding");
            } else {
              router.push("/home");
            }
          }}
          className="flex items-center bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring focus:ring-blue-300"
        >
          <FcGoogle className="mr-2" size={32} /> Continue with Google
        </button>
      ) : (
        <div>
          {/* spinning loading thing */}
          <CgSpinnerAlt className="animate-spin" size={32} />
        </div>
      )}
    </div>
  );
}
