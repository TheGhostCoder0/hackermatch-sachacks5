"use client";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/client";
import Image from "next/image";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center mx-4 md:mx-16 mt-10">
      {/* hero section */}
      <div className="flex flex-col md:flex-row items-center justify-center mx-4 lg:mx-16 gap-8">
        <Image
          className="max-w-full aspect-auto w-full md:w-4/12 min-w-[300px]"
          src="/astolfo.png"
          width={350}
          height={350}
          alt="Phone demo of the app"
        />

        <div className="mt-4 md:mt-0 max-w-md md:mr-8">
          <h1 className="text-3xl md:text-h3 lg:text-h2 font-bold">
            A match made in a hack
          </h1>
          <div className="mb-4" />
          <p className="text-sm md:text-base text-gray-700">
            Find a teammate to work with for your hackathon with our tool!
          </p>
          <div className="mb-4" />
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
        </div>
      </div>
    </div>
  );
}
