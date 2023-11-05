"use client";
import { useFirestore } from "@/app/firebase/FirestoreContext";
import { auth } from "@/app/firebase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const { user } = useFirestore();
  const router = useRouter();

  return (
    <div>
      <header className="flex justify-between p-4 bg-black">
        <div className="flex-1 flex justify-center ml-10">
          {" "}
            <Link href="/home" passHref>
              <Image src={logo} alt="HackerMatch" width={350} />
            </Link>
        </div>
        {user ? (
          <div>
            <button
              className="text-h6 bg-match-pink text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-4 py-2"
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
                router.push("/home");
              } else {
                router.push("/login");
              }
            }}
            className="text-h5 bg-hacker-green text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-4 py-2"
          >
            Start Now
          </button>
        )}
      </header>
    </div>
  );
};

export default Navbar;
