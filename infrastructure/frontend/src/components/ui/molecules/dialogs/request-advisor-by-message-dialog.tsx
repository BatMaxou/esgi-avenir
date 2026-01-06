import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/atoms/dialog";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Image from "next/image";
import advisorRequestImage from "../../../../../public/assets/images/advisor-request.png";
import { FilledButton } from "../buttons/filled-button";
import { useState } from "react";
import { SendMessageForm } from "../forms/form-send-message";
import { InputEndIcon } from "../inputs/input-end-icon";
import { MessageItem } from "../../atoms/message";
import { useAuth } from "@/contexts/AuthContext";
import { GetHydratedPrivateChannelResponseInterface } from "../../../../../../../application/services/api/resources/PrivateChannelResourceInterface";
import { useChannel } from "@/contexts/ChannelContext";
import { LoadingLink } from "../links/loading-link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../atoms/tooltip";

const RequestAdvisorByMessageDialog = () => {
  const t = useTranslations("components.dialogs.requestAdvisorByMessage");
  const { user } = useAuth();
  const { getAllPrivateChannels } = useChannel();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showTitleChannelForm, setShowTitleChannelForm] = useState(false);
  const [title, setTitle] = useState("");
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [sentMessage, setSentMessage] = useState("");
  const [channel, setChannel] = useState<
    GetHydratedPrivateChannelResponseInterface | undefined
  >(undefined);

  const handleShowTitleForm = () => {
    setShowTitleChannelForm(true);
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      setShowTitleChannelForm(false);
      setShowMessageForm(true);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setShowMessageForm(false);
      setShowTitleChannelForm(false);
      setTitle("");
      setIsMessageSent(false);
      setSentMessage("");
      setChannel(undefined);
    }
  };

  const handleGoToMessages = async () => {
    handleOpenChange(false);
  };

  const handleMessageSent = async (
    message: string,
    newChannel?: GetHydratedPrivateChannelResponseInterface
  ) => {
    setSentMessage(message);
    setIsMessageSent(true);
    setChannel(newChannel);
    await getAllPrivateChannels();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <form>
        <DialogTrigger asChild>
          <div className="absolute right-6 bottom-8">
            <Tooltip>
              <TooltipTrigger>
                <div className="w-12 h-12 text-3xl rounded-full bg-primary-red border-2 border-primary-red hover:bg-white hover:text-primary-red cursor-pointer font-bold text-white flex items-center justify-center">
                  ?
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{t("request_an_advisor")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </DialogTrigger>
        <DialogContent
          className={`data-[state=open]:zoom-in-100! data-[state=open]:slide-in-from-bottom-20 data-[state=open]:duration-600 sm:top-auto sm:right-4 sm:bottom-20 sm:left-auto sm:m-6 sm:p-0 sm:translate-x-0 sm:translate-y-0 ${
            isMessageSent && channel
              ? "sm:max-w-[450px] sm:min-h-[400px] sm:max-h-[400px] sm:h-full sm:flex sm:flex-col"
              : "sm:max-w-[375px]"
          }`}
        >
          <DialogHeader>
            <DialogTitle className="border-b p-4">
              {showMessageForm && title ? title : t("title")}
            </DialogTitle>
          </DialogHeader>
          <div
            className={`flex flex-col  gap-4 px-8 ${
              isMessageSent && channel
                ? "pt-8 h-full justify-start items-center"
                : "py-16 justify-center items-center"
            }`}
          >
            {isMessageSent && channel ? (
              <>
                <ul className="w-full flex flex-col gap-2">
                  <MessageItem
                    message={{
                      content: sentMessage,
                      user: {
                        id: user.id!,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        roles: user.roles,
                      },
                      channel: {
                        id: 0,
                      },
                    }}
                    user={user}
                  />
                </ul>
                <span className="text-center text-sm text-gray-600 mt-4">
                  {t("messageSentConfirmation")}
                </span>
                {pathname.endsWith("/messages") ? (
                  <FilledButton
                    className="w-fit mt-4"
                    label={t("close")}
                    onClick={handleGoToMessages}
                  />
                ) : (
                  <LoadingLink href="/messages" className="mt-4">
                    <FilledButton
                      className="w-fit"
                      label={t("goToMessages")}
                      onClick={handleGoToMessages}
                    />
                  </LoadingLink>
                )}
              </>
            ) : (
              <>
                <Image
                  src={advisorRequestImage}
                  alt="Advisor"
                  width={100}
                  height={100}
                />
                <span className="text-center">
                  {showMessageForm
                    ? t("messageDescription")
                    : showTitleChannelForm
                    ? t("titleDescription")
                    : t("description")}
                </span>
                {!showMessageForm && !showTitleChannelForm && (
                  <FilledButton
                    type="button"
                    className="w-full"
                    label={t("request")}
                    onClick={() => handleShowTitleForm()}
                  />
                )}
              </>
            )}
          </div>

          {showTitleChannelForm && !showMessageForm && (
            <DialogFooter className="p-4 border-t">
              <form onSubmit={handleTitleSubmit} className="w-full">
                <InputEndIcon
                  iconActive={title !== ""}
                  submitDisabled={title === ""}
                  placeholder={t("titlePlaceholder")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  name="title"
                />
              </form>
            </DialogFooter>
          )}

          {showMessageForm && !isMessageSent && (
            <DialogFooter className="p-4 border-t">
              <SendMessageForm
                isAdvisorRequest={true}
                requestTitle={title}
                onMessageSent={handleMessageSent}
              />
            </DialogFooter>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default RequestAdvisorByMessageDialog;
