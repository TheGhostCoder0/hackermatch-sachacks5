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
    <div className="flex flex-col bg-black px-2 py-1">
      {conversations.map((conversation) => (
        <button
          className="bg-white text-black hover:bg-hacker-green hover:text-white rounded-md px-3 py-1 my-1 w-full text-left"
          onClick={() => {
            let names = conversation.names.join(", ");
            setGroupMemberList(names);
            setConversation(conversation);
            setConversationType(ConversationType.team);
            setName(conversation.name);
            setState(State.DirectMessage);
          }}
          key={conversation.id}
        >
          {conversation.name}
        </button>
      ))}
    </div>
  );
};
