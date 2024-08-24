import { userMessages } from "@/app/components/common/messages";

import MessageCard from "@/app/components/common/message-card";
export default function MessageNotification() {

    const messages = [
        {
            role: "user",
            message: userMessages[0],
        },
    ];

    return (
        <div className="my-5">
            <div className="flex flex-col gap-4 px-1">
                {messages.map(({ role, message }, index) => (
                    <MessageCard
                        key={index}
                        attempts={index === 1 ? 2 : 1}
                        avatar={
                            role === "assistant"
                                ? "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatar_ai.png"
                                : "https://d2u8k2ocievbld.cloudfront.net/memojis/male/6.png"
                        }
                        currentAttempt={index === 1 ? 2 : 1}
                        message={message}
                        messageClassName={role === "user" ? "bg-content3 text-content3-foreground" : ""}
                        showFeedback={role === "assistant"}
                    />
                ))}
            </div>
        </div>
    );
}

