import { useMemo } from "react";

import {
  Message,
  WebsocketMessage,
} from "../../../../../../domain/entities/Message";
import { User } from "../../../../../../domain/entities/User";
import { RoleEnum } from "../../../../../../domain/enums/RoleEnum";
import { Icon } from "@iconify/react";

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
        isMe
          ? "self-end bg-light-orange"
          : `mt-4 ${
              message.user?.roles.includes(RoleEnum.DIRECTOR) &&
              "bg-primary-red text-white!"
            }`
      }`}
    >
      {!isMe && (
        <span className="flex items-center text-sm absolute top-0 -translate-y-full w-max left-0 text-gray-600">
          {message.user?.roles.includes(RoleEnum.DIRECTOR) && (
            <Icon
              icon="mdi:shield-star"
              className="inline mr-1 text-primary-red"
              width={16}
              height={16}
            />
          )}
          {`${message.user?.firstName} ${message.user?.lastName}`}
        </span>
      )}
      <p
        className={`wrap-anywhere ${
          isMe || message.user?.roles.includes(RoleEnum.DIRECTOR)
            ? "text-white"
            : "text-gray-600"
        }`}
      >
        {message.content}
      </p>
    </li>
  );
};
