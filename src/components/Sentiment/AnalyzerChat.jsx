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
  const [sentimentLabel, setSentimentLabel] = useState("unknown");
  const [entries, setEntries] = useState([]);

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
          setEntries(entriesRes.data || []);
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

  const loadEntry = async (entryId) => {
    setActiveEntryId(entryId);
    setMessages([]);
    setLastSentIndex(0);

    const entryRes = await getEntry(journal.id, entryId);
    const texts = entryRes.data.texts || [];

    const loadedMessages = texts.map(text => ({
      text,
      sender: "user",
      editable: false,
    }));

    setMessages(loadedMessages);
    setLastSentIndex(loadedMessages.length);

    const storedLabels = JSON.parse(localStorage.getItem("entrySentiments") || "{}");
    setSentimentLabel(storedLabels[entryId] || "unknown");
  };

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

      setMessages((prev) =>
        prev.map((msg, idx) =>
          idx < messages.length && msg.sender === "user"
            ? { ...msg, editable: false }
            : msg
        )
      );

      setLastSentIndex(messages.length);

      const label = res?.data?.label ?? "unknown";
      setSentimentLabel(label);

      const storedLabels = JSON.parse(localStorage.getItem("entrySentiments") || "{}");
      storedLabels[activeEntryId] = label;
      localStorage.setItem("entrySentiments", JSON.stringify(storedLabels));
      setMessages((prev) => [
        ...prev,
        {
          text: `Saved ${newMessages.length} new paragraph${newMessages.length > 1 ? "s" : ""}.`,
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
    
  <div className="flex max-w-7xl mx-auto w-full p-4 gap-4">
    <div className="w-64 bg-gray-900 rounded-xl p-4 border border-gray-700 flex flex-col">
      <h2 className="text-white font-bold mb-3">Entries</h2>

      <div className="flex-1 overflow-y-auto space-y-2">
        {entries.map(entry => (
          <button
            key={entry.entry_id}
            onClick={() => loadEntry(entry.entry_id)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
              entry.entry_id === activeEntryId
                ? "bg-indigo-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {new Date(entry.created_at).toLocaleDateString()}
          </button>
        ))}
      </div>
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">{journal?.title || "Loading..."}</h1>
      </div>

      {error && (
        <div className="w-full mb-4 px-4 py-2 text-center rounded-lg bg-red-900 text-red-300 font-medium border border-red-700">
          {error}
        </div>
      )}

      <div className="relative flex flex-col h-[75vh] bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-inner">
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
    {sentimentLabel !== "unknown" && (
    <div className="absolute top-1/2 -translate-y-1/2 right-10 translate-x-[-35px] flex items-center space-x-3">
      <span className="text-white font-bold text-2xl select-none">
        {sentimentLabel.toUpperCase()}
      </span>

      <button
        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 ${
          sentimentLabel === "positive"
            ? "bg-green-500"
            : sentimentLabel === "negative"
            ? "bg-red-500"
            : "bg-gray-400"
        }`}
        title={`Sentiment: ${sentimentLabel}`}
      >
        {sentimentLabel === "positive" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {sentimentLabel === "negative" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {sentimentLabel === "neutral" && (
          <div className="w-6 h-6 rounded-full bg-white" />
        )}
      </button>
  </div>
)}

  </div>
  
);
}