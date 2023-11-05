"use client";
import { useFirestore } from "@/app/firebase/FirestoreContext";
import { auth } from "@/app/firebase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";
import { useAuthState } from "react-firebase-hooks/auth";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  return (
    <div>
      <header className="flex justify-between p-4 bg-black">
        {/* Only show the profile button if the user is signed in */}
        {user && (
          <button
            className="text-white bg-transparent hover:bg-match-pink py-2 px-4 rounded transition duration-200 ease-in-out"
            onClick={() => {
              router.push(`/profile/${user.uid}`);
            }}
          >
            Profile
          </button>
        )}
        <div className="flex-1 flex justify-center ml-10">
          {user ? (
            // If the user is signed in, keep the logo as a link to home
            <Link href="/home" passHref>
              <Image src={logo} alt="HackerMatch" width={350} height={80} />
            </Link>
          ) : (
            // If the user is signed out, make the logo clickable but redirect to login instead of home
            <div
              onClick={() => router.push("/login")}
              style={{ cursor: "pointer" }}
            >
              <Image src={logo} alt="HackerMatch" width={350} height={80} />
            </div>
          )}
        </div>
        {user ? (
          <div>
            <button
              className="flex text-h6 bg-match-pink text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-4 py-2"
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
