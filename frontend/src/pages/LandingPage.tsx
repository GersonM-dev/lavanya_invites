import "../styles/status-pages.css";

export default function LandingPage() {
  return (
    <section className="invite-status">
      <h1>Lavanya Invitation</h1>
      <p>
        Welcome to the invitation portal. Administrators can create and manage wedding invitations
        from the Filament dashboard.
      </p>
      <p>
        To view an invitation, open the unique link that looks like
        <br />
        <code>https://invite.example.com/your-slug</code>
      </p>
    </section>
  );
}