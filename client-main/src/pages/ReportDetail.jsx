import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchReport, fetchMessages, sendMessage } from "../utils/api";
import "../styles/ReportDetail.css";

export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [rep, msgs] = await Promise.all([
        fetchReport(id),
        fetchMessages(id),
      ]);
      setReport(rep.data);
      setMessages(msgs.data);
    };
    load();

    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, [id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSending(true);
    try {
      const res = await sendMessage(id, input);
      setMessages((prev) => [...prev, res.data.userMessage, res.data.aiMessage]);
      setInput("");
    } finally {
      setSending(false);
    }
  };

  if (!report) return <p className="loading-text">Loading report...</p>;

  return (
    <div className="report-detail-container">
      <div className="report-summary">
        <h2>{report.filename}</h2>
        {!report.explanation ? (
          <p className="processing">Analyzing report... Please wait.</p>
        ) : (
          <p className="explanation">{report.explanation}</p>
        )}
      </div>

      {report.explanation && (
        <div className="chat-area">
          <h3>Chat with MediBot</h3>
          <div className="chat-window">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`message ${m.role === "user" ? "user" : "bot"}`}
              >
                {m.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about this report..."
            />
            <button disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

