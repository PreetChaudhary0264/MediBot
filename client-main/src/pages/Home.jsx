import { Link } from "react-router-dom";
import "../styles/Home.css";
import hero from '.././assets/hero.webp'

export default function Home() {
  return (
    <div className="home">
      {/* 1️⃣ Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Understand Your Medical Reports with Ease 🩺</h1>
          <p>
            MediBot turns complex medical reports into simple explanations,
            helping you understand your health better — instantly.
          </p>
          <Link to="/upload" className="cta-btn">
            Upload Your Report
          </Link>
        </div>
        <img
          src={hero}
          alt="Medical Analysis"
          className="hero-img"
        />
      </section>

      {/* 2️⃣ Features Section */}
      <section className="features-section">
        <h2>Why Choose MediBot?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📄 Easy Uploads</h3>
            <p>Upload PDFs or images of your medical reports in seconds.</p>
          </div>
          <div className="feature-card">
            <h3>🤖 AI-Powered Analysis</h3>
            <p>Get clear, understandable insights from complex medical data.</p>
          </div>
          <div className="feature-card">
            <h3>💬 Interactive Chatbot</h3>
            <p>Ask questions and get instant AI-driven responses about your report.</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Secure & Private</h3>
            <p>Your medical data stays confidential — always protected.</p>
          </div>
        </div>
      </section>

      {/* 3️⃣ How It Works Section */}
      <section className="how-section">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <p>Upload your medical report in PDF or image format.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <p>MediBot processes and explains your results in simple terms.</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <p>Chat with MediBot to clarify doubts and learn more.</p>
          </div>
        </div>
      </section>

      {/* 4️⃣ Testimonials Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials">
          <div className="testimonial-card">
            <p>
              “MediBot helped me finally understand my blood test results — it’s
              like having a friendly doctor explain things clearly!”
            </p>
            <h4>— Riya Sharma</h4>
          </div>
          <div className="testimonial-card">
            <p>
              “I uploaded my MRI report and got clear insights instantly. So
              helpful and stress-free.”
            </p>
            <h4>— Aman Gupta</h4>
          </div>
        </div>
      </section>

      {/* 5️⃣ Footer Section */}
      <footer className="footer">
        <p>
          ⚠️ Disclaimer: MediBot explanations are AI-generated. Always consult
          your doctor for medical advice.
        </p>
        <hr />
        <p>Made by <span className="love">Preet ❤️</span> — turning code into care.</p>
      </footer>
    </div>
  );
}
