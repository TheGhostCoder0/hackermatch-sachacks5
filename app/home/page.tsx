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
      className="px-10"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(150px, 25%) 1fr",
      }}
    >
      {/* sidebar */}
      <div className="flex flex-col p-2">
        <div>
          <button
            onClick={() => setState(State.FindTeammates)}
            className="text-xl bg-blue-500 text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-4 py-2"
          >
            Find Teammates
          </button>
        </div>

        <h1 className="text-xl font-bold mt-4 mb-2">Teams</h1>
        <div className="mb-2">
          <button
            onClick={() => setShowCreateTeamModal(true)}
            className="text-xl bg-blue-500 text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-4 py-2"
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
        {user && !authLoading && (
          <GroupList
            setConversation={setConversation}
            setState={setState}
            setName={setName}
            setGroupMemberList={setGroupMemberList}
            setConversationType={setConversationType}
          />
        )}

        <h1 className="text-xl font-bold mt-4 mb-2">Direct Messages</h1>
        {user && !authLoading && (
          <DMList
            setConversation={setConversation}
            setState={setState}
            setName={setName}
            setConversationType={setConversationType}
          />
        )}
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
