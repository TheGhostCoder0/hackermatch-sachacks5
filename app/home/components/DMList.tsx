import { Collections, ConversationType, auth, db } from "@/app/firebase/client";
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

export const addIdConverter: FirestoreDataConverter<any> = {
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
  setConversationType: (type: ConversationType) => void;
  setState: (state: State) => void;
  setName: (name: string) => void;
  setConversation: (conversation: any) => void;
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

export const DMList: React.FC<DMListProps> = ({
  setConversationType,
  setState,
  setName,
  setConversation,
}) => {
  const [user] = useAuthState(auth);
  const q = query(
    collection(db, Collections.conversations),
    where("participants", "array-contains", user?.uid),
    where("type", "==", ConversationType.dm)
  ).withConverter(addIdConverter);

  const [conversations, loading] = useCollectionData(q);
  if (!user) return <div>Not logged in</div>;
  if (loading) return <div>Loading...</div>;
  if (!conversations) return <div>You have no DMs :(</div>;

  return (
    <div className="flex flex-col bg-black px-2 py-1">
      {conversations.map((conversation) => (
        <button
          className="bg-white text-black hover:bg-hacker-green hover:text-white rounded-md px-3 py-1 my-1 w-full text-left"
          onClick={() => {
            setName(getName(conversation.names, user?.displayName as string));
            setState(State.DirectMessage);
            setConversation(conversation);
            setConversationType(ConversationType.dm);
          }}
          key={conversation.id}
        >
          {getName(conversation.names, user?.displayName as string)}
        </button>
      ))}
    </div>
  );
};
