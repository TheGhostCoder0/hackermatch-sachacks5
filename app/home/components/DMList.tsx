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

export const DMList: React.FC<DMListProps> = ({ setConvoId, setState }) => {
  const [user] = useAuthState(auth);
  const q = query(
    collection(db, Collections.conversations),
    where("participants", "array-contains", user?.uid)
  ).withConverter(convosConverter);

  const [conversations, loading] = useCollectionData(q);
  if (loading) return <div>Loading...</div>;

  if (!conversations) return <div>You have no DMs :(</div>;

  // get the other person's name
  let name = "";
  for (let i = 0; i < conversations.length; i++) {
    if (conversations[i].participants[0] == user?.uid) {
      name = conversations[i].names[1];
    } else {
      name = conversations[i].names[0];
    }
  }

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
            {name}
          </button>
        );
      })}
    </div>
  );
};
