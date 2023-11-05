import { Collections, ConversationType, auth, db } from "@/app/firebase/client";
import {
  FirestoreDataConverter,
  addDoc,
  collection,
  limit,
  query,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CgSpinner } from "react-icons/cg";

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

  if (!idxUser) return <div>No more users for the day</div>;

  return (
    <div>
      {loading ? (
        <CgSpinner className="animate-spin" />
      ) : (
        <div className="flex flex-col">
          <img
            src={idxUser.photoUrl}
            alt={idxUser.displayName}
            className="rounded-full h-24 w-24"
          />
          {idxUser.displayName}
          <div>
            <button
              onClick={() => {
                // add to dms
                addDoc(collection(db, Collections.conversations), {
                  type: ConversationType.dm,
                  participants: [user?.uid, idxUser.uid],
                  names: [user?.displayName, idxUser.displayName],
                });
                setIndex(index + 1);
              }}
              className="bg-green-500 py-2 px-4 rounded mr-2"
            >
              Yes
            </button>
            <button
              onClick={() => setIndex(index + 1)}
              className="bg-red-500 py-2 px-4 rounded"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
