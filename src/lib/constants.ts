export const CATEGORIES = [
  "Sanitär",
  "Heizung",
  "Elektrik",
  "Dach",
  "Maler",
  "Tischlerei",
  "Fliesen",
  "Garten- und Landschaftsbau",
  "Sonstiges",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  NEU: "Neu",
  ZUGEWIESEN: "Zugewiesen",
  IN_BEARBEITUNG: "In Bearbeitung",
  ERLEDIGT: "Erledigt",
  STORNIERT: "Storniert",
};

export const STATUS_ORDER = [
  "NEU",
  "ZUGEWIESEN",
  "IN_BEARBEITUNG",
  "ERLEDIGT",
  "STORNIERT",
] as const;

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  NEU: "bg-blue-100 text-blue-800 ring-blue-600/20",
  ZUGEWIESEN: "bg-amber-100 text-amber-800 ring-amber-600/20",
  IN_BEARBEITUNG: "bg-purple-100 text-purple-800 ring-purple-600/20",
  ERLEDIGT: "bg-green-100 text-green-800 ring-green-600/20",
  STORNIERT: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

export const URGENCY_LABELS: Record<string, string> = {
  NORMAL: "Normal",
  DRINGEND: "Dringend",
};

export const SOURCE_LABELS: Record<string, string> = {
  FORMULAR: "Formular",
  EMAIL: "E-Mail",
};
