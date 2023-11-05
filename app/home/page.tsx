"use client";
import { CreateTeamModal } from "@/components/CreateTeamModal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/client";
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
  const [convoId, setConvoId] = useState<string>("");
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
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
            setConvoId={setConvoId}
            setState={setState}
            setName={setName}
          />
        )}

        <h1 className="text-xl font-bold mt-4 mb-2">Direct Messages</h1>
        {user && !authLoading && (
          <DMList
            setConvoId={setConvoId}
            setState={setState}
            setName={setName}
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
            <DirectMessage name={name} convoId={convoId} />
          )}
        </div>
      )}
    </div>
  );
}
