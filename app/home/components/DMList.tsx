import { Collections, auth, db } from "@/app/firebase/client";
import {
  FirestoreDataConverter,
  collection,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { State } from "../page";

const convosConverter: FirestoreDataConverter<any> = {
  toFirestore: (data: any) => data,
  fromFirestore: (snapshots, options) => {
    const data = snapshots.data(options);

    return {
      id: snapshots.id,
      ...data,
    };
  },
};

interface DMListProps {
  setState: (state: State) => void;
  setConvoId: (id: string) => void;
}

const getName = (names: string[], userName: string) => {
  let name = "";
  for (let i = 0; i < names.length; i++) {
    if (names[i] != userName) {
      name = names[i];
    }
  }

  return name;
};

export const DMList: React.FC<DMListProps> = ({ setConvoId, setState }) => {
  const [user] = useAuthState(auth);
  const q = query(
    collection(db, Collections.conversations),
    where("participants", "array-contains", user?.uid)
  ).withConverter(convosConverter);

  const [conversations, loading] = useCollectionData(q);
  if (!user) return <div>Not logged in</div>;
  if (loading) return <div>Loading...</div>;
  if (!conversations) return <div>You have no DMs :(</div>;

  return (
    <div>
      {conversations.map((conversation) => {
        return (
          <button
            className="border px-4 py-2 rounded"
            onClick={() => {
              setState(State.DirectMessage);
              setConvoId(conversation.id);
            }}
            key={conversation.id}
          >
            {/* hopefully this doesn't break anything */}
            {getName(conversation.names, user?.displayName as string)}
          </button>
        );
      })}
    </div>
  );
};
