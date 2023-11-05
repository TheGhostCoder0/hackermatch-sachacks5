import { Collections, ConversationType, auth, db } from "@/app/firebase/client";
import { addDoc, collection, orderBy, query, where } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
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
  const bgcolor = isSender ? "bg-hacker-green" : "bg-match-pink";
  const color = "text-white";
  const justify = isSender ? "justify-end" : "justify-start";

  return (
    <div className={`flex ${justify} mb-4`}>
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // get all the messages in this convo
  const q = query(
    collection(db, Collections.messages),
    where("convoId", "==", conversation.id),
    orderBy("createdAt")
  ).withConverter(addIdConverter);
  const [messages, loading] = useCollectionData(q);

  const scrollToBottom = () => {
    // Step 2: Define the scrollToBottom function
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Step 3: Scroll to bottom every time messages change
    scrollToBottom();
  }, [messages]);

  if (loading)
    return (
      <div
        className="flex flex-col bg-black animate-pulse"
        style={{ height: "calc(100vh - 140px)" }}
      >
        <div className="flex-none">
          {/* Top Bar Skeleton */}
          <div className="flex items-center p-4">
            <div className="bg-gray-300 p-4 rounded-md shadow flex justify-center items-center">
              <div className="h-8 bg-gray-200 w-48"></div>
            </div>
            {/* Conditional button skeleton */}
            {conversationType == ConversationType.dm && (
              <div className="ml-6 h-10 bg-gray-200 rounded-md w-32"></div>
            )}
          </div>
          {conversationType == ConversationType.team && (
            <div
              className="bg-gray-300 h-6 mb-2 rounded-md shadow flex justify-center items-center ml-4"
              style={{ maxWidth: "fit-content", width: "20%" }}
            ></div>
          )}
        </div>

        {/* Messages Container Skeleton */}
        <div className="flex-1 overflow-auto p-4">
          <div className="text-white">
            {/* We can just have a div with a set height to mimic the space that messages would take up */}
            <div className="h-64 bg-gray-700 rounded-md"></div>
          </div>
        </div>

        {/* Message Input Skeleton */}
        <div className="flex-none p-4">
          <div className="flex items-stretch bg-gray-200 border border-gray-300 text-gray-700 text-sm rounded-lg w-full">
            <div className="flex-1 p-2.5 bg-transparent border-none outline-none"></div>
            <div className="bg-gray-200 p-2.5 rounded-r-lg"></div>
          </div>
        </div>
      </div>
    );
  if (!messages) return <div>Broken somehow lol</div>;

  const otherPersonsId = conversation.participants.filter(
    (id: string) => id != user?.uid
  )[0];

  const sendMessage = async () => {
    if (message.trim() === "") return; // Prevents sending an empty message

    await addDoc(collection(db, Collections.messages), {
      content: message,
      convoId: conversation.id,
      createdAt: new Date(),
      senderId: user?.uid,
      senderName: user?.displayName,
    });

    setMessage(""); // Clear the message input after sending
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      className="flex flex-col bg-black rounded-md"
      style={{ height: "calc(100vh - 140px)" }}
    >
      <div className="flex-none">
        {/* Top Bar */}
        <div className="flex items-center p-4 space-x-6">
          {/* Team Name */}
          <div className="bg-white p-4 rounded-md shadow flex items-center">
            <h1 className="font-bold text-3xl underline">{name}</h1>
          </div>

          {/* Conditional Add to Team Button */}
          {conversationType === ConversationType.dm && (
            <button
              onClick={() => setShowAddToTeamModal(true)}
              className="text-lg bg-white text-black rounded-md hover:bg-hacker-green hover:text-white hover:scale-110 transition duration-200 ease-in-out px-8 py-4"
            >
              Add to team
            </button>
          )}

          {/* Conditional Members display */}
          {conversationType === ConversationType.team && (
            <div
              className="text-md bg-white p-4 rounded-md shadow flex items-center text-black"
              style={{ maxWidth: "fit-content" }}
            >
              Members: {groupMemberList}
            </div>
          )}

          {/* Modal for Adding to Team */}
          {showAddToTeamModal && conversationType === ConversationType.dm && (
            <AddToTeamModal
              name={name}
              otherPersonsId={otherPersonsId}
              onClose={() => setShowAddToTeamModal(false)}
            />
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-auto p-4">
        {messages.length == 0 ? (
          <div className="text-white">You have no messages here</div>
        ) : (
          messages.map((msg) => (
            <Msg
              key={msg.id}
              isSender={msg.senderId == user?.uid}
              content={msg.content}
            />
          ))
        )}
        <div ref={messagesEndRef} /> {/* Step 4: Place the ref here */}
      </div>

      {/* Message Input */}
      <div className="flex-none p-4">
        <div className="flex items-stretch bg-white border border-gray-300 text-gray-900 text-sm rounded-lg w-full">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            id="message-input"
            type="text"
            placeholder="Message..."
            className="flex-1 p-2.5 bg-transparent border-none outline-none dark:placeholder-black dark:text-black"
          />
          <button
            onClick={sendMessage}
            className="bg-white text-black text-md p-2.5 rounded-r-lg transition ease-in-out duration-200"
            type="button"
          >
            {/* SVG Icon */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <polygon className="triangle" points="6,4 20,12 6,20" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
