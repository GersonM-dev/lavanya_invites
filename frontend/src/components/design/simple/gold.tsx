import React, { useEffect, useMemo, useRef, useState } from "react";
import leftImg from "../../../assets/picture.jpg";
import rightBg from "../../../assets/background1.png";
import musicUrl from "../../../assets/audio/sampai-jadi-debu.mp3";
import { createPortal } from "react-dom";
import BridePict from "../../../assets/BridePict.jpg";
import GroomPict from "../../../assets/GroomPict.jpg";
import {
    Heart, Images, Calendar, MapPin, Clipboard, Check, Volume2, VolumeX,
    Instagram, Clock3, Package, X
} from "lucide-react";

import "./gold.theme.css";                    // atau "./gold.theme.css"

/* ===================== Helpers & Types ===================== */
type PicItem = { src: string; caption?: string };

type InviteStore = {
    event?: { datetime?: string };
    quotes?: string;
    bride?: {
        ig?: string; fullName?: string; order?: string;
        father?: string; mother?: string; city?: string; photo?: string;
    };
    groom?: {
        ig?: string; fullName?: string; order?: string;
        father?: string; mother?: string; city?: string; photo?: string;
    };
    gallery?: Array<string | PicItem>;
    akad?: { dateText?: string; timeText?: string; place?: string; mapsUrl?: string };
    resepsi?: { dateText?: string; timeText?: string; place?: string; mapsUrl?: string };
    rsvpCount?: number;
    inviteNote?: string;
    alsoInvite?: string[];
    gift?: {
        qrisImage?: string;
        banks?: { bankName: string; accountNumber: string; accountName: string; qr?: string }[];
        bank?: { bankName: string; accountNumber: string; accountName: string; qr?: string };
        address?: string;
        whatsapp?: string;
    };
};

const getInviteData = (): InviteStore => {
    try {
        return JSON.parse(localStorage.getItem("invite.data") || "{}");
    } catch {
        return {};
    }
};

const formatFullDate = (iso?: string, locale = "en-US") =>
    iso
        ? new Date(iso).toLocaleDateString(locale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Thursday, November 6, 2025";

/** Centralized store loader to avoid duplicate localStorage parsing */
function useInviteStore(): InviteStore {
    const [store, setStore] = useState<InviteStore>(() => getInviteData());
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === "invite.data" || e.key === "invitation.builder") {
                setStore(getInviteData());
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);
    return store;
}

/* ===================== Main Component ===================== */
export default function CoverSplit() {
    const rightRef = useRef<HTMLDivElement>(null);
    const store = useInviteStore();

    const extractPrimary = (value?: string | null) => {
        const trimmed = value?.trim();
        return trimmed && trimmed.length > 0 ? trimmed : undefined;
    };

    const heroGroomName = extractPrimary(store?.groom?.fullName) ?? 'Aimlesson';
    const heroBrideName = extractPrimary(store?.bride?.fullName) ?? 'Pxxtria';

    // confetti: stabil (tidak berubah setiap re-render)
    const confetti = useMemo(
        () =>
            Array.from({ length: 14 }).map(() => ({
                top: `${Math.random() * 90 + 5}%`,
                left: `${Math.random() * 45 + 5}%`,
                delay: `${Math.random() * 3}s`,
            })),
        []
    );

    // scroll helper (panel kanan)
    const scrollRightTo = (id: string) => {
        const right = rightRef.current;
        const target = document.getElementById(id);
        if (!right || !target) return;
        right.scrollTo({ top: target.offsetTop - 8, behavior: "smooth" });
    };

    // Tanggal hero
    const heroDateText = formatFullDate(store?.event?.datetime);

    // RSVP
    const [rsvpOpen, setRsvpOpen] = useState(false);

    return (
        <section className="splitPage theme-gold">
            {/* KIRI */}
            <div className="split left">
                <img
                    src={leftImg}
                    alt="Couple"
                    className="coverImg"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />
                <div className="leftOverlay" />
                <h1 className="coupleName">
                    {heroGroomName} <br /> & {heroBrideName}
                </h1>
                <div className="confettiWrap" aria-hidden>
                    {confetti.map((c, i) => (
                        <span
                            key={i}
                            className="confetti"
                            style={{ top: c.top, left: c.left, animationDelay: c.delay }}
                        />
                    ))}
                </div>
            </div>

            {/* KANAN */}
            <div
                ref={rightRef}
                className="split right"
                style={rightBg ? { backgroundImage: `url(${rightBg})` } : undefined}
            >
                <div className="rightInner">
                    <div className="heroArch">
                        <p className="topLabel">THE WEDDING OF</p>
                        <h2 className="goldNames">
                            John <span className="amp">&</span> wendy
                        </h2>
                        <p className="dateText">{heroDateText}</p>
                        <ScrollCue />
                    </div>

                    {/* Quotes */}
                    <section className="quotesSection">
                        <QuotesCard store={store} />
                    </section>

                    {/* Couple */}
                    <CoupleSection store={store} />

                    {/* Galleries */}
                    <StoryGallerySection store={store} />

                    {/* Dates, Location, RSVP, dsb */}
                    <DatePages store={store} />
                    <LocationSection store={store} />
                    <RsvpSection store={store} onOpen={() => setRsvpOpen(true)} />
                    <AlsoInviteSection store={store} />
                    <GiftSection store={store} />
                    <WishesSection />
                </div>

                {/* Arch SVG */}
                <svg viewBox="0 0 600 700" className="archSvg" aria-hidden>
                    <defs>
                        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#C08E3D" />
                            <stop offset="50%" stopColor="#E8C478" />
                            <stop offset="100%" stopColor="#B5812D" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M80 540 V160 a220 220 0 0 1 440 0 V540"
                        fill="none"
                        stroke="url(#gold)"
                        strokeWidth="8"
                    />
                </svg>
            </div>

            {/* Music button */}
            <MusicToggle className="musicBtn--seam" />

            {/* Toolbar tengah */}
            <ul className="midToolbar" aria-label="Quick actions">
                <li><button title="Couple" onClick={() => scrollRightTo("couple")}><Heart aria-hidden /></button></li>
                <li><button title="Galleries" onClick={() => document.getElementById("galleries")?.scrollIntoView({ behavior: "smooth" })}><Images aria-hidden /></button></li>
                <li><button title="Date" onClick={() => scrollRightTo("date")}><Calendar aria-hidden /></button></li>
                <li><button title="Location" onClick={() => scrollRightTo("location")}><MapPin aria-hidden /></button></li>
            </ul>

            {/* Drawer/modal form RSVP */}
            <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
        </section>
    );
}

/* ===================== Small Components ===================== */
function ScrollCue() {
    const go = (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById("quotes")?.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <a href="#quotes" onClick={go} className="scrollCue">
            <div className="mouse">
                <div className="dot" />
            </div>
            <span>scroll down</span>
        </a>
    );
}

/* ===== QuotesCard ===== */
function QuotesCard({ store }: { store: InviteStore }) {
    let text: string | undefined;
    let source: string | undefined;

    try {
        const rawQuotes =
            store?.quotes ??
            JSON.parse(localStorage.getItem("invitation.builder") || "{}")?.quotes;
        if (rawQuotes) {
            text = String(rawQuotes);
            const m = text.match(/—\s*(.*)$/);
            if (m) source = m[1];
        }
    } catch {
        /* ignore */
    }

    const fallback = {
        meaning:
            'Dan mereka keduanya akan menjadi satu daging, jadi mereka tidak lagi menjadi dua orang, melainkan satu. Oleh karena itu apa yang telah dipersatukan Tuhan, janganlah manusia memisahkan."',
        src: "Markus 10:8-9",
    };

    return (
        <section id="quotes" className="sectionCard quotesBlock">
            <div className="quotesDecorTop" aria-hidden />
            {text ? (
                <>
                    <blockquote className="qMeaning">{text}</blockquote>
                    {source && <div className="qSource">— {source}</div>}
                </>
            ) : (
                <>
                    <blockquote className="qMeaning">{fallback.meaning}</blockquote>
                    <div className="qSource">{fallback.src}</div>
                </>
            )}
        </section>
    );
}

/* ===== Couple ===== */
type Person = {
    ig?: string;
    fullname: string;
    order: string;
    father: string;
    mother: string;
    city?: string;
    photo?: string;
};

function CoupleSection({ store }: { store: InviteStore }) {
    const bride: Person = {
        ig: store?.bride?.ig ?? undefined,
        fullname: store?.bride?.fullName ?? '',
        order: store?.bride?.order ?? '',
        father: store?.bride?.father ?? '',
        mother: store?.bride?.mother ?? '',
        city: store?.bride?.city ?? '',
        photo: store?.bride?.photo || BridePict,
    };

    const groom: Person = {
        ig: store?.groom?.ig ?? undefined,
        fullname: store?.groom?.fullName ?? '',
        order: store?.groom?.order ?? '',
        father: store?.groom?.father ?? '',
        mother: store?.groom?.mother ?? '',
        city: store?.groom?.city ?? '',
        photo: store?.groom?.photo || GroomPict,
    };

    return (
        <section id="couple" className="coupleSection">
            <h3 className="coupleHeading">The Wedding Of</h3>

            <div className="coupleWrap">
                <ProfileCard person={bride} variant="bride" />
                <div className="dividerHR" />
                <ProfileCard person={groom} variant="groom" />
            </div>
        </section>
    );
}

function ProfileCard({
    person,
    variant,
}: {
    person: Person;
    variant: "bride" | "groom";
}) {
    return (
        <article className={`profileCard ${variant}`}>
            <div className="avatarWrap">
                {person.photo ? (
                    <img
                        className="avatar"
                        src={person.photo}
                        alt={person.fullname}
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="avatar avatar--placeholder">
                        <span>
                            IMAGE NOT
                            <br />
                            FOUND
                        </span>
                    </div>
                )}
            </div>

            {person.ig && (
                <div className="ig">
                    <Instagram className="ico" aria-hidden /> @{person.ig}
                </div>
            )}


            <h4 className="fullname">{person.fullname}</h4>
            <p className="order">{person.order}</p>
            <p className="parents">
                {person.father} <br /> {person.mother}
            </p>
            {person.city && <p className="city">{person.city}</p>}
        </article>
    );
}

/* ===== STORY / FULL-WIDTH AUTO SLIDES ===== */
function StoryGallerySection({ store }: { store: InviteStore }) {
    const railRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const [pics, setPics] = useState<PicItem[]>([]);
    const [loaded, setLoaded] = useState<Record<number, boolean>>({});

    const defaultPics: PicItem[] = [
        { src: "/photos/gal1.jpg" },
        { src: "/photos/gal2.jpg" },
        { src: "/photos/gal3.jpg" },
    ];

    // sumber gambar: store.gallery → /gallery.json → fallback
    useEffect(() => {
        try {
            if (Array.isArray(store?.gallery) && store.gallery.length) {
                setPics(
                    store.gallery.map((it) => (typeof it === "string" ? { src: it } : it))
                );
                return;
            }
        } catch {
            /* ignore */
        }
        fetch("/gallery.json")
            .then((r) => (r.ok ? r.json() : []))
            .then((arr) => {
                if (Array.isArray(arr) && arr.length) {
                    setPics(arr.map((it: any) => (typeof it === "string" ? { src: it } : it)));
                } else {
                    setPics(defaultPics);
                }
            })
            .catch(() => setPics(defaultPics));
    }, [store?.gallery]);

    // paksa preload SEMUA gambar begitu daftar pics tersedia
    useEffect(() => {
        if (!pics.length) return;
        pics.forEach((p) => {
            const img = new Image();
            img.decoding = "async";
            img.src = p.src;
        });
    }, [pics]);

    // sinkronkan dot saat di-scroll manual
    useEffect(() => {
        const el = railRef.current;
        if (!el) return;
        const onScroll = () => setActive(Math.round(el.scrollLeft / el.clientWidth));
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    // autoplay 4.5s
    useEffect(() => {
        const el = railRef.current;
        if (!el || pics.length <= 1) return;
        const id = window.setInterval(() => {
            setActive((prev) => {
                const next = (prev + 1) % pics.length;
                el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
                return next;
            });
        }, 4500);
        return () => clearInterval(id);
    }, [pics.length]);

    // preload 1–2 slide berikutnya
    useEffect(() => {
        if (!pics.length) return;
        const preload = (idx: number) => {
            const p = pics[idx];
            if (!p) return;
            const img = new Image();
            img.src = p.src;
        };
        preload((active + 1) % pics.length);
        preload((active + 2) % pics.length);
    }, [active, pics]);

    const go = (i: number) => {
        const el = railRef.current;
        if (!el) return;
        const idx = Math.max(0, Math.min(i, pics.length - 1));
        el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
    };

    const markLoaded = (i: number) => setLoaded((m) => ({ ...m, [i]: true }));

    return (
        <section id="galleries" className="gallerySection story storyPage">
            <div className="galleryHeader">
                <h3 className="galleryTitle">Precious moment</h3>
                <p className="galleryCaption">
                    "Creating memories is a priceless gift. Memories last a lifetime; objects
                    last only a short time."
                </p>
            </div>

            <div className="storyWrap">
                <div className="storyRail" ref={railRef}>
                    {pics.map((p, i) => (
                        <figure
                            className="storyItem"
                            key={i}
                            style={{ background: "transparent" }}
                        >
                            <img
                                className="storyMedia"
                                src={p.src}
                                alt={`Moment ${i + 1}`}
                                loading="eager"
                                fetchPriority={i < 2 ? "high" : "auto"}
                                decoding="async"
                                sizes="100vw"
                                style={{
                                    background: "#FFF7E8",
                                    opacity: loaded[i] ? 1 : 0.001,
                                    transition: "opacity .25s ease",
                                }}
                                onLoad={() => markLoaded(i)}
                            />
                            {p.caption && (
                                <figcaption className="storyCaption">{p.caption}</figcaption>
                            )}
                        </figure>
                    ))}
                </div>

                <button
                    className="storyNav prev"
                    onClick={() => go(active - 1)}
                    aria-label="Previous"
                >
                    ‹
                </button>
                <button
                    className="storyNav next"
                    onClick={() => go(active + 1)}
                    aria-label="Next"
                >
                    ›
                </button>
            </div>

            <div className="storyDots">
                {pics.map((_, i) => (
                    <button
                        key={i}
                        className={i === active ? "is-active" : ""}
                        onClick={() => go(i)}
                        aria-label={`Go to ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

/* ====== DATE PAGES (full page) ====== */
function DatePages({ store }: { store: InviteStore }) {
    const eventISO: string = store?.event?.datetime || "2025-11-06T09:00:00+07:00";

    const akad = {
        title: "Pemberkatan",
        dateText: store?.akad?.dateText || "Tuesday, November 18, 2025",
        timeText: store?.akad?.timeText || "at 09:00 WIB - finish",
        place:
            store?.akad?.place || "Gereja Katolik Katedral Kristus Raja Purwokerto",
        mapsUrl: store?.akad?.mapsUrl || "https://maps.app.goo.gl/LVBSQdPLg3uvw7Nz6",
    };

    const resepsi = {
        title: "Reception",
        dateText: store?.resepsi?.dateText || "Saturday, November 19th, 2025",
        timeText: store?.resepsi?.timeText || "at 15:00 WIB - finish",
        place: store?.resepsi?.place || "ASTON Purwokerto Hotel & Convention Center",
        mapsUrl: store?.resepsi?.mapsUrl || "https://maps.app.goo.gl/7ZR4TqEqyecQLaCs9",
    };

    return (
        <section id="date" className="datePages">
            {/* Page 1: Save the Date */}
            <section className="dateSection dateHero">
                <div className="dateHeroCard">
                    <h3 className="saveTitle">Save the Date</h3>
                    <Countdown targetISO={eventISO} />
                    <p className="saveSub">{formatFullDate(eventISO)}</p>
                </div>
            </section>

            {/* Page 2: Akad */}
            <DateCard {...akad} />

            {/* Page 3: Resepsi */}
            <DateCard {...resepsi} />
        </section>
    );
}

function DateCard({
    title,
    dateText,
    timeText,
    place,
    mapsUrl,
}: {
    title: string;
    dateText: string;
    timeText: string;
    place: string;
    mapsUrl: string;
}) {
    return (
        <section className="dateSection">
            <div className="dateCard">
                <h3 className="dateCardTitle">{title}</h3>
                <p className="dateLine">{dateText}</p>
                <p className="dateLine"><Clock3 className="ico" aria-hidden /> {timeText}</p>
                <p className="datePlace"><MapPin className="ico" aria-hidden /> {place}</p>
                <a className="dateBtn outline" href={mapsUrl} target="_blank" rel="noreferrer">
                    see location
                </a>
            </div>
        </section>
    );
}

function Countdown({ targetISO }: { targetISO: string }) {
    const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        const tick = () => {
            const now = new Date().getTime();
            const t = new Date(targetISO).getTime() - now;
            const d = Math.max(0, Math.floor(t / (24 * 3600e3)));
            const h = Math.max(0, Math.floor((t % (24 * 3600e3)) / 3600e3));
            const m = Math.max(0, Math.floor((t % 3600e3) / 60e3));
            const s = Math.max(0, Math.floor((t % 60e3) / 1e3));
            setLeft({ d, h, m, s });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetISO]);

    return (
        <>
            <div className="countDays">{left.d}</div>
            <div className="countLabel">DAYS</div>
            <div className="countRow">
                <div>
                    <b>{left.h}</b>
                    <span>HOURS</span>
                </div>
                <div>
                    <b>{left.m}</b>
                    <span>MINUTES</span>
                </div>
                <div>
                    <b>{left.s}</b>
                    <span>SECONDS</span>
                </div>
            </div>
        </>
    );
}

/* ===== LOCATION PAGE (scrollable) ===== */
function LocationSection({ store }: { store: InviteStore }) {
    const defaultPlace = "ASTON Purwokerto Hotel & Convention Center";
    const defaultLatLng = "-7.417284,109.244905";
    const defaultMapsUrl =
        "https://www.google.com/maps/place/ASTON+Purwokerto+Hotel+%26+Convention+Center/@-7.4172787,109.2402916,17z/data=!3m1!4b1!4m9!3m8!1s0x2e655e8d2f347f67:0xea62bc175447bf91!5m2!4m1!1i2!8m2!3d-7.417284!4d109.244905!16s%2Fg%2F11cff4lxp?entry=ttu";

    const place = store?.resepsi?.place || store?.akad?.place || defaultPlace;
    const mapsUrl = store?.resepsi?.mapsUrl || store?.akad?.mapsUrl || defaultMapsUrl;

    const embedUrl = `https://www.google.com/maps?q=${place === defaultPlace ? defaultLatLng : encodeURIComponent(place)
        }&z=17&output=embed`;

    return (
        <section id="location" className="locationSection">
            <div className="mapCard">
                <div className="mapWrap">
                    <iframe
                        className="mapFrame"
                        src={embedUrl}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map Location"
                    />
                </div>

                <p className="locationAddress"><MapPin className="ico" aria-hidden /> {place}</p>


                <div className="dateActions">
                    <a className="dateBtn" href={mapsUrl} target="_blank" rel="noreferrer">
                        open in google maps
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ===== RSVP SECTION ===== */
function RsvpSection({
    onOpen,
    store,
}: {
    onOpen: () => void;
    store: InviteStore;
}) {
    const count = Number(store?.rsvpCount) || 310;

    return (
        <section id="rsvp" className="rsvpSection">
            <div className="rsvpInner">
                <h3 className="rsvpTitle">RSVP</h3>
                <p className="rsvpDesc">
                    <b>{count} guest</b> response will join. Please send your response too.
                </p>
                <button className="rsvpBtn" onClick={onOpen}>
                    Send your response
                </button>
            </div>
        </section>
    );
}

/* ===== RSVP DRAWER / MODAL ===== */
function RsvpModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [name, setName] = useState("");
    const [wa, setWa] = useState("");
    const [company, setCompany] = useState("");
    const [answer, setAnswer] = useState<"yes" | "no" | "">("");

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { name, wa, company, answer, at: new Date().toISOString() };
        const list = JSON.parse(localStorage.getItem("rsvp.list") || "[]");
        list.push(payload);
        localStorage.setItem("rsvp.list", JSON.stringify(list));
        onClose();
        alert("Thank you! Your response is recorded.");
    };

    if (!open) return null;

    return (
        <>
            <div className="rsvpOverlay" onClick={onClose} />

            <aside
                className="rsvpDrawer"
                role="dialog"
                aria-modal="true"
                aria-label="RSVP Form"
            >
                <header className="rsvpHead">
                    <h4>confirmation of attendance</h4>
                    <button className="rsvpClose" onClick={onClose} aria-label="Close">
                        <X aria-hidden />
                    </button>
                </header>

                <div className="rsvpIllustration" aria-hidden />

                <form className="rsvpForm" onSubmit={submit}>
                    <label className="rsvpField">
                        <span>Your full name</span>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Your full name"
                        />
                    </label>

                    <label className="rsvpField">
                        <span>Whatsapp number</span>
                        <input
                            value={wa}
                            onChange={(e) => setWa(e.target.value)}
                            required
                            placeholder="6289xxxxxxx"
                            type="tel"
                            inputMode="numeric"
                        />
                    </label>

                    <label className="rsvpField">
                        <span>Address/Company</span>
                        <input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Address/Company"
                        />
                    </label>

                    <fieldset className="rsvpChoice">
                        <legend>Your Response</legend>
                        <label>
                            <input
                                type="radio"
                                name="resp"
                                value="yes"
                                checked={answer === "yes"}
                                onChange={() => setAnswer("yes")}
                            />
                            Yes, I would like to come
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="resp"
                                value="no"
                                checked={answer === "no"}
                                onChange={() => setAnswer("no")}
                            />
                            Sorry, I can't
                        </label>
                    </fieldset>

                    <button className="rsvpSubmit" type="submit">
                        Send your response
                    </button>
                </form>
            </aside>
        </>
    );
}

/* ===== Also Invite ===== */
function AlsoInviteSection({ store }: { store: InviteStore }) {
    const note =
        store?.inviteNote ||
        "It is an honor and happiness for us if, Mr / Mrs / Brother / i. Thank you for coming to give us your blessing.";

    const groups: string[] =
        Array.isArray(store?.alsoInvite) && store.alsoInvite.length
            ? store.alsoInvite
            : ["Keluarga Besar Bapak Sujono", "Keluarga Besar PT Emence", "Teman Teman SMKN 1"];

    return (
        <section id="also-invite" className="alsoInviteSection">
            <p className="thankNote">{note}</p>

            <div className="inviteBlock">
                <h4 className="inviteTitle">also invite:</h4>
                <ul className="inviteList">
                    {groups.map((g, i) => (
                        <li key={i}>{g}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

/* ===== Amplop Digital / Gift ===== */
function GiftSection({ store }: { store: InviteStore }) {
    const qrisImg = store?.gift?.qrisImage;

    // Fallback single bank → array
    const singleBank = store?.gift?.bank || {
        bankName: "BCA",
        accountNumber: "1234567890",
        accountName: "John & wendy",
        qr: "" as string | undefined,
    };

    const banks: Array<{
        bankName: string;
        accountNumber: string;
        accountName: string;
        qr?: string;
    }> =
        Array.isArray(store?.gift?.banks) && store.gift.banks.length
            ? store.gift.banks
            : [singleBank];

    const shipAddr = store?.gift?.address || "Jl. Contoh No. 123, Purwokerto, Jawa Tengah";
    const waTarget = store?.gift?.whatsapp || "6281234567890";

    const [method, setMethod] = useState<"qris" | "transfer" | "send">("qris");
    const [form, setForm] = useState({ name: "", email: "", amount: "", message: "" });

    const [openQR, setOpenQR] = useState<number | null>(null);
    const [justCopied, setJustCopied] = useState<string | null>(null);

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm({ ...form, [e.target.name]: e.target.value });

    const copyText = async (t: string) => {
        try {
            await navigator.clipboard.writeText(t);
            setJustCopied(t);
            setTimeout(() => setJustCopied(null), 1200);
        } catch {
            alert("Copied");
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const title = method === "qris" ? "QRIS" : method === "transfer" ? "Direct Transfer" : "Send Gift";
        const msg = `Halo, saya ingin mengirim hadiah.
Metode: ${title}
Nama: ${form.name}
Email: ${form.email}
Nominal/Estimasi: ${form.amount}
Pesan: ${form.message}`;
        const url = `https://wa.me/${waTarget}?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <section id="gift" className="panelSection giftSection">
            <div className="panelCard giftCard">
                <h3 className="panelTitle">Send your gift</h3>
                <p className="panelSub">
                    Catatan kado atau ucapan terima kasih bisa Anda tulis di bawah ini.
                </p>

                {/* Metode */}
                <div className="giftMethods">
                    {/* QRIS */}
                    <div className={`giftInfo ${method === "qris" ? "is-active" : ""}`}>
                        <label className="giftRadio">
                            <input
                                type="radio"
                                checked={method === "qris"}
                                onChange={() => setMethod("qris")}
                            />
                            <b>QRIS</b>
                            <span className="muted">
                                e-wallet (OVO, Gopay, DANA, LinkAja, ShopeePay) & mobile banking
                            </span>
                        </label>

                        {method === "qris" && (
                            <div className="qrisBox">
                                {qrisImg ? (
                                    <img className="qrisImg" src={qrisImg} alt="QRIS" />
                                ) : (
                                    <div className="qrisPlaceholder">QRIS image goes here</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Direct Transfer (kartu bank) */}
                    <label className="giftRadio line">
                        <input
                            type="radio"
                            checked={method === "transfer"}
                            onChange={() => setMethod("transfer")}
                        />
                        <b>Direct Transfer</b>
                    </label>

                    {method === "transfer" && (
                        <div className="bankCards">
                            {banks.map((b, i) => (
                                <div key={i} className="bankCard">
                                    <div className="bankHead">{b.bankName}</div>

                                    <div className="bankNo">
                                        {b.accountNumber}
                                        <button type="button" className="copyBtn" title="Copy account number" onClick={() => copyText(b.accountNumber)}>
                                            <Clipboard aria-hidden />
                                        </button>
                                        {justCopied === b.accountNumber && <div className="copiedHint"><Check aria-hidden /> Copied!</div>}
                                    </div>

                                    <div className="bankOwner">a/n {b.accountName}</div>

                                    {justCopied === b.accountNumber && (
                                        <div className="copiedHint">Copied!</div>
                                    )}

                                    {b.qr && (
                                        <>
                                            <button
                                                type="button"
                                                className="qrToggle"
                                                onClick={() => setOpenQR(openQR === i ? null : i)}
                                            >
                                                {openQR === i ? "hide QR" : "show QR"}
                                            </button>
                                            {openQR === i && (
                                                <img
                                                    className="bankQR"
                                                    src={b.qr}
                                                    alt={`QR ${b.bankName}`}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Send Gift (alamat) */}
                    <label className="giftRadio line">
                        <input
                            type="radio"
                            checked={method === "send"}
                            onChange={() => setMethod("send")}
                        />
                        <b>Send Gift</b>
                        <span className="muted">Kirim kado ke alamat berikut</span>
                    </label>

                    {method === "send" && (
                        <div className="addrBox">
                            <Package className="ico" aria-hidden /> {shipAddr}
                        </div>
                    )}

                </div>

                {/* Form */}
                <form className="giftForm" onSubmit={submit}>
                    <div className="giftField">
                        <span>Your full name</span>
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Nama lengkap"
                            required
                        />
                    </div>
                    <div className="giftField">
                        <span>Your email address</span>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="nama@email.com"
                            required
                        />
                    </div>
                    <div className="giftField">
                        <span>Amount / estimation</span>
                        <input
                            name="amount"
                            value={form.amount}
                            onChange={onChange}
                            placeholder="cth: 300.000"
                            inputMode="numeric"
                        />
                    </div>
                    <div className="giftField">
                        <span>Your message</span>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={onChange}
                            rows={3}
                            placeholder="Tulis pesan"
                        />
                    </div>

                    <button className="giftSubmit" type="submit">
                        make a gift now
                    </button>
                </form>
            </div>
        </section>
    );
}

/* ===== Wishes ===== */
function WishesSection() {
    type Wish = { name: string; city?: string; message: string };

    const load = (): Wish[] => {
        try {
            const s = localStorage.getItem("invite.wishes");
            if (s) return JSON.parse(s);
        } catch {
            /* ignore */
        }
        return [
            { name: "Dee", city: "Bogor", message: "Beautiful 💞" },
            {
                name: "Our Wedding Link",
                city: "Bekasi",
                message:
                    "Beautiful design matters. happy for all of you that want going to married",
            },
        ];
    };

    const [wishes, setWishes] = useState<Wish[]>(load());
    const [form, setForm] = useState<Wish>({ name: "", city: "", message: "" });

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm({ ...form, [e.target.name]: e.target.value });

    const initials = (s: string) =>
        (s || "A")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((v) => v[0]?.toUpperCase())
            .join("");

    const save = (arr: Wish[]) =>
        localStorage.setItem("invite.wishes", JSON.stringify(arr));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: Wish = {
            name: form.name?.trim() || "Anonymous",
            city: form.city?.trim(),
            message: form.message?.trim() || "",
        };
        const next = [...wishes, data];
        setWishes(next);
        save(next);
        setForm({ name: "", city: "", message: "" });
    };

    return (
        <section id="wishes" className="panelSection wishesSection">
            <div className="panelCard wishesCard">
                <h3 className="panelTitle wishesTitle">Wishes</h3>

                {/* LIST */}
                <ul className="wishesList" aria-live="polite">
                    {wishes.map((w, i) => (
                        <li key={i} className="wishItem">
                            <div className="wishAvatar" aria-hidden>
                                {initials(w.name)}
                            </div>
                            <div className="wishBubble">
                                <div className="wishName">{w.name}</div>
                                {w.city && <div className="wishCity">at {w.city}</div>}
                                {w.message && <div className="wishMsg">“{w.message}”</div>}
                            </div>
                        </li>
                    ))}
                </ul>

                {/* FORM */}
                <form className="wishForm" onSubmit={submit}>
                    <div className="wishField">
                        <label>Your full name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Your full name"
                            required
                        />
                    </div>
                    <div className="wishField">
                        <label>Your address</label>
                        <textarea
                            name="city"
                            value={form.city}
                            onChange={onChange}
                            placeholder="City / address (optional)"
                            rows={2}
                        />
                    </div>
                    <div className="wishField">
                        <label>Send a wish:</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={onChange}
                            placeholder="ex: congrats for this event"
                            rows={3}
                            required
                        />
                    </div>
                    <button className="wishSubmit" type="submit">
                        submit now
                    </button>
                </form>
            </div>
        </section>
    );
}

/* ===== MusicToggle ===== */
function MusicToggle({ className }: { className?: string }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);

    const toggle = async () => {
        const a = audioRef.current;
        if (!a) return;
        if (playing) {
            a.pause();
            setPlaying(false);
        } else {
            try {
                await a.play();
                setPlaying(true);
            } catch {
                // biarkan saja kalau gagal autoplay; tombol tetap muncul
            }
        }
    };

    const classes = `musicBtn ${playing ? "is-playing" : "is-paused"} ${className ?? ""}`;

    // Render tombol + audio ke <body> agar tidak ketimpa overlay/stacking-context
    return createPortal(
        <>
            <audio ref={audioRef} src={musicUrl} loop preload="auto" />
            <button
                className={classes}
                onClick={toggle}
                aria-label={playing ? "Pause music" : "Play music"}
                aria-pressed={playing}
                type="button"
            >
                <span className="musicIcon" aria-hidden>
                    {playing ? <Volume2 /> : <VolumeX />}
                </span>
            </button>
        </>,
        document.body
    );
}
