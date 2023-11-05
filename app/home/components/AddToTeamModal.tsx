import { Collections, ConversationType, auth, db } from "@/app/firebase/client";
import { Modal } from "@/components/Modal";
import {
  arrayUnion,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Select, { SingleValue } from "react-select";
import { toast } from "react-toastify";
import { addIdConverter } from "./DMList";

interface AddToTeamModalProps {
  onClose: () => void;
  name: string;
  otherPersonsId: string;
}

export const AddToTeamModal: React.FC<AddToTeamModalProps> = ({
  name,
  otherPersonsId,
  onClose,
}) => {
  const [user] = useAuthState(auth);
  const q = query(
    collection(db, Collections.conversations),
    where("participants", "array-contains", user?.uid),
    where("type", "==", ConversationType.team)
  ).withConverter(addIdConverter);

  const [conversations, loading] = useCollectionData(q);
  const options = conversations?.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  const [value, setValue] = useState<
    SingleValue<{
      value: any;
      label: any;
    }>
  >();

  return (
    <Modal title={`Add ${name} to a team`} onClose={onClose}>
      <Select
        className="mb-4"
        isLoading={loading}
        options={options}
        value={value}
        onChange={(selected) => {
          console.log("selected", selected);
          setValue(selected);
        }}
      />
      <button
        onClick={() => {
          // add this person to this conversation
          const convoId = value?.value;
          updateDoc(doc(db, Collections.conversations, convoId), {
            participants: arrayUnion(otherPersonsId),
            names: arrayUnion(name),
          });
          toast.success(`Added ${name} to team!`);
          onClose();
        }}
        className="text-lg bg-blue-500 text-white rounded-md hover:scale-110 transition duration-200 ease-in-out px-4 py-2"
      >
        Submit
      </button>
    </Modal>
  );
};
