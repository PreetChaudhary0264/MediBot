import "../styles/Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">
      {/* HEADER */}
      <section className="contact-header">
        <h1>Get in Touch</h1>
        <p>
          Have a question, feedback, or just want to say hi?  
          I’d love to hear from you. Fill out the form below or reach out directly!
        </p>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-container">
        <div className="contact-info">
          <h2>Let’s Connect</h2>
          <p>
            Whether it’s about collaborations, ideas, or improvements —  
            I’m always open to meaningful conversations about health, AI, and technology.
          </p>

          <div className="contact-details">
            <p><strong>Email:</strong> spary264preet@gmail.com</p>
            <p><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/preet-chaudhary-5523a0306" target="_blank" rel="noreferrer">Preet Chaudhary</a></p>
            <p><strong>GitHub:</strong> <a href="https://github.com/PreetChaudhary0264" target="_blank" rel="noreferrer">Preet Chaudhary</a></p>
          </div>
        </div>

        {/* CONTACT FORM */}
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
          <h3>Send a Message</h3>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea rows="5" placeholder="Your Message" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="contact-footer">
        <hr />
        <p>Made by <span className="love">Preet</span> — turning code into care.</p>
      </footer>
    </div>
  );
}
