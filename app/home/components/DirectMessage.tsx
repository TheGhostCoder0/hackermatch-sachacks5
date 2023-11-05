import React from "react";

interface DirectMessageProps {
  convoId: string;
}

export const DirectMessage: React.FC<DirectMessageProps> = ({ convoId }) => {
  return <div>{convoId}</div>;
};
