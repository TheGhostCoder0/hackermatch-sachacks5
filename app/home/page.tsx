"use client";
import { CreateTeamModal } from "@/components/CreateTeamModal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ConversationType, auth } from "../firebase/client";
import { DMList } from "./components/DMList";
import { DirectMessage } from "./components/DirectMessage";
import { FindTeammates } from "./components/FindTeammates";
import { GroupList } from "./components/GroupList";

export enum State {
  FindTeammates,
  DirectMessage,
}

export default function Home() {
  const [state, setState] = useState<State>(State.FindTeammates);
  const [name, setName] = useState<string>("");
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [groupMemberList, setGroupMemberList] = useState<string>("");
  const [conversation, setConversation] = useState<any>();
  const [conversationType, setConversationType] = useState<ConversationType>(
    ConversationType.dm // filler for now
  );
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    // redirect user if they're unauthenticated
    if (!user && !authLoading) {
      router.push("/login");
    }
  });

  return (
    <div
      className="px-10 flex-grow"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(150px, 25%) 1fr",
        height: "calc(100vh - 140px)",
      }}
    >
      {/* sidebar with black background */}
      <div className="flex flex-col p-2 bg-black mx-2 mr-12">
        {/* Find Teammates button with white background and rounded corners */}
        <div className="px-2">
          <button
            onClick={() => setState(State.FindTeammates)}
            className="text-xl bg-white text-black rounded-md hover:bg-match-pink hover:text-white transition duration-200 ease-in-out px-3 py-3 my-1 w-full"
          >
            Find Teammates
          </button>
        </div>

        {/* Team title with transparent background */}
        <h1 className="text-xl font-bold ml-3 mt-4 mb-2 text-white bg-transparent">
          Teams
        </h1>

        {/* Create Team button with white background and rounded corners */}
        <div className="mb-2 px-2">
          <button
            onClick={() => setShowCreateTeamModal(true)}
            className="text-xl w-full bg-white text-black hover:bg-match-pink hover:text-white transition duration-200 ease-in-out rounded-md px-3 py-3 my-1 w-full"
          >
            Create Team
          </button>
        </div>

        {showCreateTeamModal && (
          <CreateTeamModal
            title="Create Team"
            onClose={() => setShowCreateTeamModal(false)}
          />
        )}
        <div className="flex flex-col">
          {/* Active teams list (assuming GroupList component handles its own styling) */}
          {user && !authLoading && (
            <GroupList
              setConversation={setConversation}
              setState={setState}
              setName={setName}
              setGroupMemberList={setGroupMemberList}
              setConversationType={setConversationType}
            />
          )}

          {/* Direct Message title with transparent background */}
          <h1 className="text-xl font-bold ml-3 mt-4 mb-2 text-white bg-transparent">
            Direct Messages
          </h1>

          {/* Direct messages list (assuming DMList component handles its own styling) */}
          {user && !authLoading && (
            <DMList
              setConversation={setConversation}
              setState={setState}
              setName={setName}
              setConversationType={setConversationType}
            />
          )}
        </div>
      </div>

      {/* right content */}
      {user && !authLoading && (
        <div>
          {state == State.FindTeammates ? (
            <>
              <h1 className="font-bold text-2xl mb-4">Find Teammates</h1>
              <FindTeammates />
            </>
          ) : (
            <DirectMessage
              name={name}
              conversation={conversation}
              groupMemberList={groupMemberList}
              conversationType={conversationType}
            />
          )}
        </div>
      )}
    </div>
  );
}
