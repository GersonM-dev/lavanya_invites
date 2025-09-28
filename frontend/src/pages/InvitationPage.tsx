import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { ApiInvitation } from "../types/invitation";
import { ApiError, fetchInvitation } from "../services/api";
import { transformInvitation } from "../utils/transformInvitation";
import { resolveTheme } from "../config/themes";
import "../styles/status-pages.css";

interface InvitationState {
  status: "idle" | "loading" | "success" | "error";
  data?: ApiInvitation;
  error?: string;
}

export default function InvitationPage() {
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<InvitationState>({ status: "idle" });
  const [version, setVersion] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!slug) {
      setState({ status: "error", error: "Invitation not found." });
      return;
    }

    let isActive = true;

    setState({ status: "loading" });
    setIsReady(false);

    fetchInvitation(slug)
      .then((data) => {
        if (!isActive) return;
        setState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        if (error instanceof ApiError) {
          setState({
            status: "error",
            error: error.status === 404 ? "Invitation not found." : error.message,
          });
        } else if (error instanceof Error) {
          setState({ status: "error", error: error.message });
        } else {
          setState({ status: "error", error: "Unexpected error." });
        }
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  useEffect(() => {
    if (state.status !== "success" || !state.data) return;
    if (typeof window === "undefined") return;

    const payload = transformInvitation(state.data);
    window.localStorage.setItem("invite.data", JSON.stringify(payload));
    setVersion((prev) => prev + 1);
    setIsReady(true);

    return () => {
      window.localStorage.removeItem("invite.data");
    };
  }, [state]);

  const ThemeComponent = useMemo(() => {
    if (state.status !== "success" || !state.data) {
      return null;
    }

    return resolveTheme(state.data.design_id);
  }, [state]);

  if (state.status === "loading" || (state.status === "success" && !isReady)) {
    return (
      <section className="invite-status invite-status--loading" aria-busy>
        <div className="invite-status__spinner" aria-hidden />
        <p>Loading invitation…</p>
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="invite-status invite-status--error" role="alert">
        <h1>Oops!</h1>
        <p>{state.error ?? "Unable to load invitation."}</p>
      </section>
    );
  }

  if (state.status !== "success" || !ThemeComponent) {
    return null;
  }

  return <ThemeComponent key={`${state.data?.slug ?? "invite"}-${version}`} />;
}