import { useState } from "react";
import { uploadReport } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/Upload.css";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!file) {
    setError("Please upload a report before proceeding.");
    return;
  }
  setLoading(true);
  setError("");

  try {
    const res = await uploadReport(file);
    console.log("Upload successful:", res);
    navigate("/reports");
  } catch (err) {
    console.error("Upload failed:", err);
    setError("Upload failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="page">
      {/* Upload Section */}
      <section className="upload-section">
        <div className="upload-box">
          <h2>Upload Your Medical Report</h2>

          <form onSubmit={handleSubmit} className="upload-form">
            <div
              className={`drop-zone ${dragging ? "dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <p>
                {file
                  ? `📄 ${file.name}`
                  : "Drag & drop your report here or click to select"}
              </p>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload & Analyze"}
            </button>
          </form>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="info-section">
        <h3>How MediBot Helps You</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>🩺 Simple Report Analysis</h4>
            <p>Upload your report and get easy-to-understand explanations instantly.</p>
          </div>
          <div className="info-card">
            <h4>💬 Chat with MediBot</h4>
            <p>Ask questions about your report and get instant AI-powered answers.</p>
          </div>
          <div className="info-card">
            <h4>📊 Keep All Reports Organized</h4>
            <p>Access your past uploads anytime in one convenient place.</p>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="disclaimer-section">
        <p>
          ⚠️ The explanations and insights provided are AI-generated.  
          Always consult your doctor for medical advice and confirmation.
        </p>
      </section>
    </div>
  );
}

