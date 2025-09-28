import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Crown, Feather, Palette, ChevronUp, ChevronDown } from "lucide-react";

type Key = "gold" | "classic" | "modern";
type Opt = { key: Key; label: string; path: string; Icon: React.FC<any> };

const OPTIONS: Opt[] = [
  { key: "gold",    label: "Gold",    path: "/",        Icon: Crown   },
  { key: "classic", label: "Classic", path: "/classic", Icon: Feather },
  { key: "modern",  label: "Modern",  path: "/modern",  Icon: Palette },
];

export default function DesignSplit() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // cari opt aktif dari URL
  const active = OPTIONS.find(o => o.path === pathname) ?? OPTIONS[0];

  // klik di luar untuk menutup
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const go = (p: string) => {
    setOpen(false);
    if (p !== pathname) nav(p);
  };

  const ui = (
    <div
      ref={wrapRef}
      className="designSwitch"
      role="region"
      aria-label="Theme switcher"
      data-variant={active.key}
    >
      {/* Floating pill button */}
      <button
        className="chip"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        title={`Theme • ${active.label}`}
      >
        <span className="thumb" aria-hidden>
          <active.Icon size={18} />
        </span>
        <span className="chipText">
          <b className="chipLead">Theme</b>
          <span className="chipSep"> • </span>
          <span className="chipName">{active.label}</span>
        </span>
        <span className="chev" aria-hidden>
          {open ? <ChevronDown size={16}/> : <ChevronUp size={16}/>}
        </span>
      </button>

      {/* Popover */}
      {open && (
        <div className="switchMenu" role="menu">
          {OPTIONS.map(o => {
            const isActive = o.path === pathname;
            return (
              <button
                key={o.path}
                className={`opt ${isActive ? "is-active" : ""}`}
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => go(o.path)}
                type="button"
                title={o.label}
                data-variant={o.key}
              >
                <span className="optIcon" aria-hidden><o.Icon size={16} /></span>
                <span className="optLabel">{o.label}</span>
                {isActive && <span className="optBadge">Current</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return createPortal(ui, document.body);
}
