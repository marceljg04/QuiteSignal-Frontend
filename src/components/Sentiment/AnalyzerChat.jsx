import { useState, useRef, useEffect } from "react";
import { getMyJournal, getEntries, createEntry, appendBatch, getEntry} from "../../api/journal";

export default function AnalyzerChat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [journal, setJournal] = useState(null);
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [lastSentIndex, setLastSentIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const initPromiseRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!initPromiseRef.current) {
      initPromiseRef.current = (async () => {
        try {
          const journalRes = await getMyJournal();
          const journalId = journalRes.data.journal_id;

          setJournal({
            id: journalId,
            title: journalRes.data.title,
          });

          const entriesRes = await getEntries(journalId);
          let entryId;
          if (entriesRes.data.length === 0) {
            const newEntry = await createEntry(journalId);
            entryId = newEntry.data.entry_id;
          } else {
            const lastEntry = entriesRes.data[entriesRes.data.length - 1];
            entryId = lastEntry.entry_id;
          }
          setActiveEntryId(entryId);

          const entryRes = await getEntry(journalId, entryId);
          const existingTexts = entryRes.data.texts || [];

          console.log("Existing entry texts:", existingTexts);

          const initialMessages = existingTexts.map(text => ({
            text,
            sender: "user",
            editable: false,
          }));

          setMessages(initialMessages);
          setLastSentIndex(initialMessages.length);

          setIsReady(true);
        } catch (err) {
          console.error(err);
          setError("Error initializing journal");
        }
      })();
    }
  }, []);


  const handleAddMessage = () => {
    const trimmedText = text.trim().slice(0, 300); // limitar a 300 caracteres
    if (!trimmedText) {
      setError("Please enter a phrase");
      return;
    }
    setError("");
    setMessages((prev) => [
      ...prev,
      { text: trimmedText, sender: "user", editable: true },
    ]);
    setText("");
  };
  
  const handleSendAll = async () => {
    if (!isReady) {
      setError("Journal not ready yet");
      return;
    }

    // Obtener SOLO mensajes nuevos
    const newMessages = messages
      .slice(lastSentIndex)
      .filter((msg) => msg.sender === "user")
      .map((msg) => msg.text);

    if (newMessages.length === 0) {
      setError("No new phrases to send");
      return;
    }

    try {
      const res = await appendBatch(journal.id, activeEntryId, newMessages);
      console.log("Append response:", res);

      // Bloquear edición de mensajes enviados
      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx < messages.length && msg.sender === "user"
            ? { ...msg, editable: false }
            : msg
        )
      );

      // Marcar hasta dónde se envió
      setLastSentIndex(messages.length);

      // Mostrar label devuelto por el backend
      const label = res?.data?.label ?? "unknown";
      setMessages((prev) => [
        ...prev,
        {
          text: `Saved ${newMessages.length} new phrase${newMessages.length > 1 ? "s" : ""}. Sentiment label: ${label}`,
          sender: "ai",
        },
      ]);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to append entry");
    }
  }

  const handleEditMessage = (idx, newText) => {
    const trimmedText = newText.slice(0, 300); // limitar a 300 caracteres
    setMessages((prev) =>
      prev.map((msg, i) => (i === idx ? { ...msg, text: trimmedText } : msg))
    );
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddMessage();
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-4 bg-gray-800 dark:bg-gray-900 rounded-xl">
      {error && (
        <div className="w-full mb-4 px-4 py-2 text-center rounded-lg bg-red-900 text-red-300 font-medium border border-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col h-[75vh] bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-inner">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-10 select-none">
              <p className="text-lg font-semibold">Start Analysis</p>
              <p>Enter phrases and press 'Add' before hitting 'Send All'.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "user" && msg.editable ? (
                  <textarea
                     className="px-4 py-2 max-w-[80%] flex-1 rounded-xl text-base shadow-md bg-indigo-600 text-white resize-none"
                    value={msg.text}
                    onChange={(e) => handleEditMessage(idx, e.target.value)}
                    rows={2}
                  />
                ) : (
                  <div
                    className={`px-4 py-3 max-w-[80%] rounded-xl text-base shadow-md transition-colors duration-150 break-words overflow-hidden ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <hr className="my-3 border-gray-700" />

        <div className="pt-2">
          <div className="flex items-end mb-4">
            <textarea
              className="textarea flex-1 h-[5rem]"
              placeholder="Enter a phrase..."
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 300))}
              onKeyDown={handleKeyDown}
              rows={3}
            />
            <button
              className="btn-small ml-box btn-success h-[6rem] flex items-center justify-center"
              onClick={handleAddMessage}
              disabled={!text.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <button
            className="w-full py-3 font-bold text-lg rounded-xl bg-gray-700 hover:bg-gray-800 text-white transition-colors duration-150 shadow-lg disabled:opacity-30"
            onClick={handleSendAll}
            disabled={
              !isReady ||
              messages.length === 0 ||
              messages.length === lastSentIndex ||
              messages[messages.length - 1]?.sender === "ai"
            }
          >
            Send All Phrases ({messages.filter((msg) => msg.sender === "user").length})
          </button>
        </div>
      </div>
    </div>
  );
}