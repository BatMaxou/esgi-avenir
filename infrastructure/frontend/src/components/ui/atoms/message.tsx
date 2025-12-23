import { useMemo } from "react";

import { Message, WebsocketMessage } from "../../../../../../domain/entities/Message";
import { User } from "../../../../../../domain/entities/User";

export const MessageItem = ({ message, user }: { message: Message|WebsocketMessage, user: Partial<User>|null }) => {
  const isMe = useMemo(() => message.user?.id === user?.id, [message, user]);

  return <li className={`relative flex p-4 border rounded-lg shadow-sm w-fit ${isMe ? 'self-end' : ''}`}>
    {!isMe && <span className={`text-gray-600 text-sm absolute top-0 -translate-y-full block w-max ${isMe ? 'right-0' : 'left-0'}`}>
      {`${message.user?.firstName} ${message.user?.lastName}`}
    </span>}
    <p className="text-gray-600">{message.content}</p>
  </li>
}


