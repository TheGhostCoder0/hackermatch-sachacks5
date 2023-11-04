"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { db, Collections } from "@/app/firebase/client";
import { useCollectionData } from "react-firebase-hooks/firestore";

export default function Profile({ params }: { params: { uid: string } }) {
  const router = useRouter();
  const [userData, setUserData] = useState<null>(null);
  const [error, setError] = useState<string | null>(null);

  const q = query(
    collection(db, Collections.users),
    where("__name__", "==", params.uid)
  );

  const [users, loadingUsers] = useCollectionData(q);
  const user = users?.[0] as any;

  console.log(user);

  if (loadingUsers) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="max-w-xs overflow-hidden rounded-full shadow-lg">
        <Image
          src={
            user.photoUrl ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt="Profile picture"
          width={300}
          height={300}
          className="object-cover object-center w-full h-full"
        />
      </div>

      <h3 className="text-3xl font-bold text-center text-black">
        {user.displayName || "Name not provided"}
      </h3>

      <div className="text-gray-900 divide-y divide-gray-200 dark:text-white dark:divide-gray-700">
        {/* LinkedIn Profile */}
        {user.displayName && (
          <div className="py-3 text-center">
            <dt className="text-gray-500 md:text-lg dark:text-gray-400">
              LinkedIn
            </dt>
            <dd className="text-lg font-semibold">
              <a
                href={user.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {user.linkedinUrl}
              </a>
            </dd>
          </div>
        )}

        {/* GitHub Profile */}
        {user.githubProfileUrl && (
          <div className="py-3 text-center">
            <dt className="text-gray-500 md:text-lg dark:text-gray-400">
              GitHub
            </dt>
            <dd className="text-lg font-semibold">
              <a
                href={user.githubProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {user.githubProfileUrl}
              </a>
            </dd>
          </div>
        )}

        {/* Devpost Profile */}
        {user.devpostProfileUrl && (
          <div className="pt-3 text-center">
            <dt className="text-gray-500 md:text-lg dark:text-gray-400">
              Devpost
            </dt>
            <dd className="text-lg font-semibold">
              <a
                href={user.devpostProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {user.devpostProfileUrl}
              </a>
            </dd>
          </div>
        )}
      </div>
    </div>
  );
}
