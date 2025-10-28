import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div><Link to="/" className="navbar-logo">Medibot</Link></div>
      <nav className="navbar-links">
        <Link to="/upload">Upload</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
}

