import { Collections, ConversationType, auth, db } from "@/app/firebase/client";
import {
  FirestoreDataConverter,
  addDoc,
  collection,
  limit,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CgSpinner } from "react-icons/cg";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/app/home/components/SearchBar";

interface FindTeammatesProps {}

const usersConverter: FirestoreDataConverter<any> = {
  toFirestore: (data: any) => data,
  fromFirestore: (snapshots, options) => {
    const data = snapshots.data(options);

    return {
      uid: snapshots.id,
      ...data,
    };
  },
};

export const FindTeammates: React.FC<FindTeammatesProps> = ({}) => {
  const [index, setIndex] = useState(0); // 0-5, if they reach 10 that's the end for today
  const [user] = useAuthState(auth);

  // select a batch of 10 random users from the database
  const q = query(
    collection(db, Collections.users),
    where("__name__", "!=", user?.uid),
    limit(5)
  ).withConverter(usersConverter);

  const [users, loading] = useCollectionData(q);
  const idxUser = users?.[index];

  if (!idxUser) {
    return (
      <div className="flex justify-center items-center mt-6">
        <div className="flex justify-center bg-black p-4 rounded-md shadow-lg w-full md:w-5/6 lg:w-3/4 xl:w-2/3 mx-auto text-white">
          No more users for the day
        </div>
      </div>
    );
  }

  const renderColoredName = (name: string) => {
    const words = name.split(" ");
    return (
      <>
        <span className="text-hacker-green">{words[0]}</span>
        {words.length > 1 && (
          <>
            <span className="text-hacker-green">{"_"}</span>
            <span className="text-match-pink">{words.slice(1).join("")}</span>
          </>
        )}
      </>
    );
  };

  // Function to check for an existing conversation
  const checkForExistingConversation = async (
    currentUserUid: any,
    targetUserUid: any
  ) => {
    const conversationsRef = collection(db, Collections.conversations);

    // You need to check both possible orders of user IDs
    const q1 = query(
      conversationsRef,
      where("participants", "==", [currentUserUid, targetUserUid])
    );
    const q2 = query(
      conversationsRef,
      where("participants", "==", [targetUserUid, currentUserUid])
    );

    const querySnapshot1 = await getDocs(q1);
    const querySnapshot2 = await getDocs(q2);

    // If a conversation is found, return the first match
    const existingConversation =
      querySnapshot1.docs[0]?.data() || querySnapshot2.docs[0]?.data();

    return existingConversation;
  };

  // Refactor the onClick event for the Yes button
  const handleCreateOrNavigateToConversation = async () => {
    if (user && idxUser) {
      const existingConversation = await checkForExistingConversation(
        user.uid,
        idxUser.uid
      );

      if (!existingConversation) {
        // If conversation does not exist, create it
        const docRef = await addDoc(collection(db, Collections.conversations), {
          type: ConversationType.dm,
          participants: [user.uid, idxUser.uid],
          names: [user.displayName, idxUser.displayName],
        });
      }
      // Update the index after handling the conversation
      setIndex(index + 1);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center mt-0">
        {/* Yes button on the left */}
        <button
          onClick={handleCreateOrNavigateToConversation}
          className="bg-hacker-green text-white font-bold text-lg rounded-full flex items-center justify-center"
          style={{ width: "80px", height: "80px", lineHeight: "80px" }} // Force the button to be circular with specific size
        >
          Yes
        </button>

        {/* Black box container */}
        <a className="flex flex-col bg-black p-4 rounded-md shadow-lg mx-6 my-4 w-full md:w-5/6 lg:w-3/4 xl:w-2/3 cursor-pointer">
          <Link href={`/profile/${idxUser.uid}`}>
            <div className="flex flex-col bg-black p-4 rounded-md shadow-lg mx-6 my-4 w-full md:w-5/6 lg:w-3/4 xl:w-2/3">
              {loading ? (
                <CgSpinner className="animate-spin" />
              ) : (
                <div className="flex flex-col items-start w-full ml-20">
                  {" "}
                  {/* Align items to start and add left margin */}
                  <div className="flex items-center mb-4 w-full">
                    <Image
                      src={idxUser.photoUrl || "default-avatar.png"}
                      alt={idxUser.displayName || "User"}
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                    <h1 className="text-3xl font-bold text-white ml-12">
                      {idxUser.displayName
                        ? renderColoredName(idxUser.displayName)
                        : "Name not provided"}
                    </h1>
                  </div>
                  <div className="mt-3 w-full">
                    <ul className="list-disc space-y-2 text-white pl-5 mb-6">
                      <li>
                        Location: {idxUser.location || "Location not provided"}
                      </li>
                      <li>
                        College: {idxUser.college || "College not provided"}
                      </li>
                      <li>Major: {idxUser.major || "Major not provided"}</li>
                      <li className="text-white">
                        Skills: {idxUser.skills || "No skills provided"}
                      </li>
                      <li>
                        Number of hackathons:{" "}
                        {idxUser.hackathons || "Not specified"}
                      </li>
                      <li>
                        Current Hackathon:{" "}
                        {idxUser.currentHackathon || "Not participating"}
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </Link>
        </a>

        {/* No button on the right */}
        <button
          onClick={() => setIndex(index + 1)}
          className="bg-match-pink text-white font-bold text-lg rounded-full flex items-center justify-center"
          style={{ width: "80px", height: "80px", lineHeight: "80px" }} // Force the button to be circular with specific size
        >
          No
        </button>
      </div>
      {/* <div className="flex items-center justify-center mt-4">
        <div className="w-full md:w-5/6 lg:w-3/4 xl:w-2/3">

          <SearchBar />
        </div>
      </div> */}
    </div>
  );
};
