"use client";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/client";
import Image from "next/image";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center mx-5 md:mx-16 mt-10">
      {/* hero section */}
      <div className="flex flex-col md:flex-row items-center justify-center mx-4 lg:mx-16 gap-6">
        {/* Left flex box with large text */}
        <div className="flex-1">
          <h1 className="text-8xl font-bold mt-8">
            <span className="text-hacker-green">Are you</span>
            <span className="text-match-pink"> ready </span>
            <span className="text-hacker-green">to meet your</span>
          </h1>
        </div>

        {/* Right flex box with image and small text in the bottom right corner */}
        <div className="flex-1 relative">
          <Image
            className="mb 4"
            src="/heartLogo.png"
            width={450}
            height={450}
            alt="Descriptive Alt Text"
          />
          {/* Small text in the bottom right corner */}
          <span className="absolute bottom-0 right-0 text-8xl mb-3 font-bold text-hacker-green">
            ?
          </span>
        </div>
      </div>

      {/* Submit button centered under the flex boxes */}
      <div className="mt-20">
        <button
          onClick={async () => {
            if (user) {
              router.push("/home");
            } else {
              router.push("/login");
            }
          }}
          className="text-2xl bg-hacker-green text-white rounded-md px-16 py-8 hover:bg-match-pink"
        >
          Start Now
        </button>
      </div>
    </div>
  );
}
