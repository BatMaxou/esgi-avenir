import { useMemo } from "react";

import {
  Message,
  WebsocketMessage,
} from "../../../../../../domain/entities/Message";
import { User } from "../../../../../../domain/entities/User";

export const MessageItem = ({
  message,
  user,
}: {
  message: Message | WebsocketMessage;
  user: Partial<User> | null;
}) => {
  const isMe = useMemo(() => message.user?.id === user?.id, [message, user]);

  return (
    <li
      className={`relative flex p-4 border rounded-lg shadow-sm w-fit max-w-[70%] ${
        isMe ? "self-end bg-light-orange" : ""
      }`}
    >
      {!isMe && (
        <span
          className={`text-sm absolute top-0 -translate-y-full block w-max ${
            isMe ? "right-0 text-white" : "left-0 text-gray-600"
          }`}
        >
          {`${message.user?.firstName} ${message.user?.lastName}`}
        </span>
      )}
      <p className={`wrap-anywhere ${isMe ? "text-white" : "text-gray-600"}`}>
        {message.content}
      </p>
    </li>
  );
};
