import type { ApiEvent, ApiInvitation, ApiPerson } from "../types/invitation";

export type InviteStore = {
  event?: { datetime?: string };
  quotes?: string;
  bride?: {
    ig?: string;
    fullName?: string;
    order?: string;
    father?: string;
    mother?: string;
    city?: string;
    photo?: string;
  };
  groom?: {
    ig?: string;
    fullName?: string;
    order?: string;
    father?: string;
    mother?: string;
    city?: string;
    photo?: string;
  };
  gallery?: Array<string>;
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

function coalesceString(...values: Array<string | null | undefined>): string | undefined {
  for (const value of values) {
    if (value != null) {
      return value;
    }
  }

  return undefined;
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatFullDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return dateFormatter.format(date);
}

function formatTimeRange(start?: string | null, end?: string | null): string | undefined {
  if (!start) return undefined;
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return undefined;

  if (!end) {
    return `${timeFormatter.format(startDate)} WIB`;
  }

  const endDate = new Date(end);
  if (Number.isNaN(endDate.getTime())) {
    return `${timeFormatter.format(startDate)} WIB`;
  }

  return `${timeFormatter.format(startDate)} - ${timeFormatter.format(endDate)} WIB`;
}

function mapPerson(person?: ApiPerson | null): InviteStore["bride"] | undefined {
  if (!person) return undefined;
  return {
    fullName: person.full_name ?? undefined,
    ig: person.instagram_username ?? undefined,
    order: person.child_order != null ? `Anak ke-${person.child_order}` : undefined,
    father: person.father_name ?? undefined,
    mother: person.mother_name ?? undefined,
    city: person.address ?? undefined,
  };
}

function mapEvent(event?: ApiEvent | null) {
  if (!event) return undefined;
  return {
    dateText: formatFullDate(event.start_at),
    timeText: formatTimeRange(event.start_at, event.end_at),
    place: event.location?.name ?? event.location?.address_line ?? undefined,
    mapsUrl: event.location?.map_link ?? undefined,
  };
}

function pickEvent(events: ApiEvent[] | undefined, type: string): ApiEvent | undefined {
  return events?.find((event) => event.event_type === type);
}

export function transformInvitation(invitation: ApiInvitation): InviteStore {
  const ceremony = pickEvent(invitation.events, "ceremony");
  const reception = pickEvent(invitation.events, "reception") ?? pickEvent(invitation.events, "engagement");

  return {
    event: {
      datetime: coalesceString(invitation.wedding_date, ceremony?.start_at, reception?.start_at),
    },
    quotes: invitation.quote?.quote ?? undefined,
    bride: mapPerson(invitation.bride),
    groom: mapPerson(invitation.groom),
    gallery: invitation.gallery?.map((item) => item.image_url).filter((url): url is string => Boolean(url)) ?? [],
    akad: mapEvent(ceremony),
    resepsi: mapEvent(reception),
    rsvpCount: invitation.events_count ?? undefined,
    inviteNote: invitation.quote?.author ?? invitation.design?.description ?? undefined,
    alsoInvite: [],
    gift: undefined,
  };
}