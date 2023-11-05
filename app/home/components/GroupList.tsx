import { Collections, ConversationType, auth, db } from "@/app/firebase/client";
import { collection, query, where } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { State } from "../page";
import { addIdConverter } from "./DMList";

interface GroupListProps {
  setConversationType: (type: ConversationType) => void;
  setConversation: (conversation: any) => void;
  setGroupMemberList: (memberList: string) => void;
  setState: (state: State) => void;
  setName: (name: string) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  setConversationType,
  setConversation,
  setGroupMemberList,
  setState,
  setName,
}) => {
  const [user] = useAuthState(auth);

  const q = query(
    collection(db, Collections.conversations),
    where("participants", "array-contains", user?.uid),
    where("type", "==", ConversationType.team)
  ).withConverter(addIdConverter);
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
              let names = "";
              for (let i = 0; i < conversation.names.length; i++) {
                names += conversation.names[i] + ", ";
              }
              names = names.slice(0, -2);
              setGroupMemberList(names);
              setConversation(conversation);
              setConversationType(ConversationType.team);
              setName(conversation.name);
              setState(State.DirectMessage);
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
