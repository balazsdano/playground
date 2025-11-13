import { useState } from "react";
import Markdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";
import { type Message } from "./types.js";
import { sendMessage } from "./mastraConnector.js";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  const onSubmit = async () => {
    if (input.length === 0) {
      return;
    }
    setSending(true);

    const newUserMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
    };

    const responseText = await sendMessage(messages, newUserMessage);

    const newAssistantMessage: Message = {
      id: uuidv4(),
      role: "assistant",
      content: responseText,
    };

    const updatedMessages = [...messages, newUserMessage, newAssistantMessage];

    setMessages(updatedMessages);
    setInput("");
    setSending(false);
  };

  return (
    <div id="chat">
      <ol id="msg-list">
        {messages.map(({ role, content }) => (
          <li className="msg-item">
            <div className="msg-role">{role}</div>
            <div className="msg-cont">
              <Markdown>{content}</Markdown>
            </div>
          </li>
        ))}
      </ol>

      <div id="msg-form">
        <textarea
          id="msg-input"
          value={input}
          onChange={(ev) => setInput(ev.target.value)}
          disabled={sending}
        />
        <button
          id="msg-submit"
          type="submit"
          onClick={onSubmit}
          disabled={sending || input.length === 0}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
