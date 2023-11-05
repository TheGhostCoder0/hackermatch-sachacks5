import { Collections, ConversationType, auth, db } from "@/app/firebase/client";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { Modal } from "./Modal";

interface CreateTeamModalProps {
  title: string;
  onClose: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  title,
  onClose,
}) => {
  const [user] = useAuthState(auth);
  const [teamName, setTeamName] = useState<string>("");

  return (
    <Modal title={title} onClose={onClose}>
      <input
        type="text"
        placeholder="Team Name"
        className="text-black rounded-md bg-black5 border-gray-200 border-2 px-4 py-2 mr-4"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />

      <button
        onClick={() => {
          if (teamName.length < 1) {
            toast.error("Team name can't be empty");
            return;
          }

          // teams have a set name
          addDoc(collection(db, Collections.conversations), {
            name: teamName,
            type: ConversationType.team,
            names: [user?.displayName],
            participants: [user?.uid],
            creatorUid: user?.uid,
          });
          toast.success("Team created!");
          onClose();
        }}
        className="text-lg bg-hacker-green hover:bg-match-pink text-white rounded-md transition duration-200 px-4 py-2"
      >
        Submit
      </button>
    </Modal>
  );
};
