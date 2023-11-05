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
    <div className="container mx-auto px-8 lg:px-20 py-10">
      <div className="flex flex-wrap -mx-4">
        {/* Profile Column */}
        <div className="w-full lg:w-1/3 px-4 flex flex-col items-center">
          {/* Profile Picture */}
          <div className="mb-6">
            <Image
              src={
                user.photoUrl ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="Profile picture"
              width={160}
              height={160}
              className="rounded-full"
            />
          </div>
          {/* Biography */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 w-full text-center">
            <h3 className="text-lg font-semibold mb-2">Biography</h3>
            {/* Insert user biography if available */}
            <p className="text-gray-700">
              {user.biography || "This user has not provided a biography."}
            </p>
          </div>
          {/* Links */}
          <dl className="bg-white p-4 rounded-lg shadow w-full text-center">
            <dt className="font-semibold text-gray-700 mb-2">Links</dt>
            {/* Conditional rendering of user links */}
            {user.linkedinUrl && (
              <dd className="mb-1">
                <a
                  href={user.linkedinUrl}
                  className="text-blue-500 hover:text-blue-600"
                >
                  LinkedIn
                </a>
              </dd>
            )}
            {user.githubProfileUrl && (
              <dd>
                <a
                  href={user.githubProfileUrl}
                  className="text-blue-500 hover:text-blue-600"
                >
                  GitHub
                </a>
              </dd>
            )}
            {user.devpostProfileUrl && (
              <dd className="mb-1">
                <a
                  href={user.devpostProfileUrl}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Devpost
                </a>
              </dd>
            )}
          </dl>
        </div>

        {/* Information Column */}
        <div className="w-full lg:w-2/3 px-4">
          {/* Ensure vertical alignment to the top */}
          <div className="flex flex-col justify-start h-full">
            {/* Name and Location, etc. */}
            <div className="mb-6 text-center lg:text-left lg:mb-10 lg:mt-8">
              <h1 className="text-6xl font-bold text-gray-900 mb-4 lg:mb-1">
                {user.displayName || "Name not provided"}
              </h1>
              {/* User location and other information could go here */}
              <p className="text-xl text-gray-600 mt-10 lg:mt-6">
                {user.location || "Location not provided"} |{" "}
                {user.college || "College not provided."} |{" "}
                {user.major || "Major not provided"}
              </p>
            </div>
            {/* Relevant Information as List Group, adjusted to align with the Biography */}
            <div className="bg-white p-4 rounded-lg shadow space-y-3 mt-0">
              {" "}
              {/* Remove the top margin */}
              <h3 className="text-lg font-semibold mb-2">
                Relevant Information
              </h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-gray-700">
                  Hackathons Attended
                </h4>
                <p className="text-gray-600">{user.hackathons || "0"}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-gray-700">
                  Current Hackathon
                </h4>
                <p className="text-gray-600">
                  {user.currentHackathon || "Not participating"}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold text-gray-700">Skills</h4>
                <p className="text-gray-600">
                  {user.skills || "No skills provided"}
                </p>
              </div>
              {/* ... Additional Information if present ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
