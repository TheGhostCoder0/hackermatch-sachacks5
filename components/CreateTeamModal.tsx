import React from "react";
import { Modal } from "./Modal";

interface CreateTeamModalProps {
  title: string;
  onClose: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  title,
  onClose,
}) => {
  return (
    <Modal title={title} onClose={onClose}>
      uhh
    </Modal>
  );
};
