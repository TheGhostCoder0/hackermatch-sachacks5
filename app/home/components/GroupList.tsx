import { Collections, ConversationType, auth, db } from "@/app/firebase/client";
import { collection, query, where } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { State } from "../page";
import { convosConverter } from "./DMList";

interface GroupListProps {
  setState: (state: State) => void;
  setConvoId: (id: string) => void;
  setName: (name: string) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  setConvoId,
  setState,
  setName,
}) => {
  const [user] = useAuthState(auth);

  const q = query(
    collection(db, Collections.conversations),

    // this doesn't work :(
    where("participants", "array-contains", user?.uid),
    where("type", "==", ConversationType.team)
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
              setName(conversation.name);
              setState(State.DirectMessage);
              setConvoId(conversation.id);
            }}
            key={conversation.id}
          >
            {/* team conversations have a name */}
            {conversation.name}
          </button>
        );
      })}
    </div>
  );
};
