import { useState, useRef, useEffect } from "react";

export default function AnalyzerChat() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  const handleAddMessage = () => {
    if (!text.trim()) {
      setError("Please enter a phrase");
      return;
    }
    setError("");
    setMessages((prev) => [
      ...prev,
      { text: text.trim(), sender: "user" },
    ]);
    setText("");
  };

  const handleSendAll = () => {
    if (messages.length === 0) {
      setError("No phrases to analyze");
      return;
    }

    const userMessagesCount = messages.filter(
      (msg) => msg.sender === "user"
    ).length;

    // Simular respuesta del "AI"
    setMessages((prev) => [
      ...prev,
      {
        text: `Analyzing ${userMessagesCount} phrases. This is a simulated response...`,
        sender: "ai",
      },
    ]);
    setError("");
  };

  // Auto scroll hacia abajo
  useEffect(() => {
    requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [messages]);

  // Manejo de la tecla Enter para añadir mensaje
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddMessage();
    }
  };

  return (
    // CAMBIO CLAVE: Quitamos h-screen y flex-col del principal.
    // Usamos max-w-4xl mx-auto para centrarlo y p-4 para padding interno.
    <div className="max-w-4xl mx-auto w-full p-4 bg-gray-800 dark:bg-gray-900 rounded-xl shadow-2xl">
      
      {/* 1. Área de Errores */}
      {error && (
        <div className="w-full mb-4 px-4 py-2 text-center rounded-lg bg-red-900 text-red-300 font-medium border border-red-700">
          {error}
        </div>
      )}

      {/* 2. Chat Zone y Control de Altura (EL CONTENEDOR PRINCIPAL DEL CHAT) */}
      {/* Usamos 'h-[65vh]' para darle una altura fija (65% del viewport) y usar 'flex flex-col' */}
      <div className="flex flex-col h-[65vh] bg-gray-900 rounded-xl p-4 border border-gray-700 shadow-inner">

        {/* Contenedor de Mensajes con Scroll. flex-1 toma el espacio disponible. */}
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
                    <div
                    className={`px-4 py-3 max-w-[80%] rounded-xl text-base shadow-md transition-colors duration-150
                        ${
                        msg.sender === "user"
                            ? "bg-indigo-600 text-white rounded-br-lg"
                            : "bg-gray-700 text-gray-100 rounded-tl-lg"
                        }`}
                    >
                    {msg.text}
                    </div>
                </div>
                ))
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Separador visual opcional (línea sutil) */}
        <hr className="my-3 border-gray-700"/>

        {/* 3. Input Zone: Pegada a la parte inferior del contenedor del chat */}
        <div className="pt-2">
            
            <div className="flex items-end mb-4">
                <textarea
                    className={`textarea flex-1 min-h-[5rem]`} // Usamos tu clase 'textarea'
                    placeholder="Enter a phrase..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={3}
                />

                <button
                    className={`btn-small ml-box btn-success h-[5rem] flex items-center justify-center`}
                    onClick={handleAddMessage}
                    disabled={!text.trim()}
                    title="Add phrase (Enter)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>

            {/* Botón Send All */}
            <button
              className={`w-full py-3 font-bold text-lg rounded-xl bg-gray-700 hover:bg-gray-800 text-white transition-colors duration-150 shadow-lg disabled:opacity-30`}
              onClick={handleSendAll}
              disabled={messages.length === 0 || messages[messages.length - 1]?.sender === "ai"}
              title="Send all accumulated phrases for analysis"
            >
              Send All Phrases ({messages.filter(msg => msg.sender === "user").length})
            </button>
        </div>
      </div>
    </div>
  );
}