import { Collections, ConversationType, auth, db } from "@/app/firebase/client";
import { addDoc, collection, orderBy, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { AddToTeamModal } from "./AddToTeamModal";
import { addIdConverter } from "./DMList";

interface DirectMessageProps {
  conversation: any;
  name: string;
  groupMemberList: string;
  conversationType: ConversationType;
}

const Msg: React.FC<{ isSender: boolean; content: string }> = ({
  isSender,
  content,
}) => {
  const bgcolor = isSender ? "bg-blue-500" : "bg-gray-500";
  const color = isSender ? "text-white" : "text-black";
  const justify = isSender ? "justify-end" : "justify-start";

  return (
    <div className={`flex ${justify}`}>
      <div className={`${bgcolor} ${color} rounded-full px-4 py-2`}>
        {content}
      </div>
    </div>
  );
};

export const DirectMessage: React.FC<DirectMessageProps> = ({
  name,
  groupMemberList,
  conversationType,
  conversation,
}) => {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState<string>("");
  const [showAddToTeamModal, setShowAddToTeamModal] = useState(false);

  // get all the messages in this convo
  const q = query(
    collection(db, Collections.messages),
    where("convoId", "==", conversation.id),
    orderBy("createdAt")
  ).withConverter(addIdConverter);
  const [messages, loading] = useCollectionData(q);

  if (loading) return <div>Loading...</div>;
  if (!messages) return <div>Broken somehow lol</div>;

  const otherPersonsId = conversation.participants.filter(
    (id: string) => id != user?.uid
  )[0];

  return (
    <div className="flex flex-col">
      <div className="flex">
        <h1 className="font-bold text-3xl underline mr-4">{name}</h1>
        {conversationType == ConversationType.dm && (
          <>
            <button
              onClick={() => setShowAddToTeamModal(true)}
              className="text-lg bg-blue-500 text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-4 py-2"
            >
              Add to team
            </button>
            {showAddToTeamModal && (
              <AddToTeamModal
                name={name}
                otherPersonsId={otherPersonsId}
                onClose={() => setShowAddToTeamModal(false)}
              />
            )}
          </>
        )}
      </div>
      {conversationType == ConversationType.team && (
        <div className="text-md">Members: {groupMemberList}</div>
      )}

      {/* messages */}
      {messages.length == 0 && <div>You have no messages here</div>}
      <div>
        {messages.map((message) => {
          return (
            <Msg
              key={message.id}
              isSender={message.senderId == user?.uid}
              content={message.content}
            />
          );
        })}
      </div>

      {/* input */}
      <div>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Message..."
        />
        <button
          onClick={() => {
            addDoc(collection(db, Collections.messages), {
              content: message,
              convoId: conversation.id,
              createdAt: new Date(),
              senderId: user?.uid,
              senderName: user?.displayName,
            });
          }}
          className="text-lg bg-blue-500 text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};
