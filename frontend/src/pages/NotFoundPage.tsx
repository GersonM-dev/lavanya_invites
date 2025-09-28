import { Link } from "react-router-dom";
import "../styles/status-pages.css";

export default function NotFoundPage() {
  return (
    <section className="invite-status invite-status--error" role="alert">
      <h1>404</h1>
      <p>The page you requested could not be found.</p>
      <p>
        <Link to="/" className="invite-link">
          Back to home
        </Link>
      </p>
    </section>
  );
}