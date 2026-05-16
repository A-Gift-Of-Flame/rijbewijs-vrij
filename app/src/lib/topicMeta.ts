import type { Lang } from './types';

export interface TopicDisplay {
  label: Record<Lang, string>;
  emoji: string;
}

export const TOPIC_DISPLAY: Record<string, TopicDisplay> = {
  right_of_way: {
    emoji: '🚦',
    label: {
      nl: 'Voorrang',
      en: 'Right of Way',
      fr: 'Priorité',
      de: 'Vorfahrt',
    },
  },
  speed_limits: {
    emoji: '🚀',
    label: {
      nl: 'Snelheidslimieten',
      en: 'Speed Limits',
      fr: 'Limitations de vitesse',
      de: 'Geschwindigkeitsbegrenzungen',
    },
  },
  traffic_signs: {
    emoji: '🪧',
    label: {
      nl: 'Verkeersborden',
      en: 'Traffic Signs',
      fr: 'Panneaux de signalisation',
      de: 'Verkehrszeichen',
    },
  },
  road_markings: {
    emoji: '🛣️',
    label: {
      nl: 'Wegmarkeringen',
      en: 'Road Markings',
      fr: 'Marquages routiers',
      de: 'Fahrbahnmarkierungen',
    },
  },
  safe_distances: {
    emoji: '📏',
    label: {
      nl: 'Veilige afstand',
      en: 'Safe Distances',
      fr: 'Distances de sécurité',
      de: 'Sicherheitsabstände',
    },
  },
  alcohol_drugs: {
    emoji: '🍺',
    label: {
      nl: 'Alcohol & drugs',
      en: 'Alcohol & Drugs',
      fr: 'Alcool & drogues',
      de: 'Alkohol & Drogen',
    },
  },
  motorway: {
    emoji: '🛣️',
    label: {
      nl: 'Autosnelweg',
      en: 'Motorway',
      fr: 'Autoroute',
      de: 'Autobahn',
    },
  },
  vulnerable_road_users: {
    emoji: '🚶',
    label: {
      nl: 'Kwetsbare weggebruikers',
      en: 'Vulnerable Road Users',
      fr: 'Usagers vulnérables',
      de: 'Schwache Verkehrsteilnehmer',
    },
  },
  vehicle_safety: {
    emoji: '🔧',
    label: {
      nl: 'Voertuigveiligheid',
      en: 'Vehicle Safety',
      fr: 'Sécurité du véhicule',
      de: 'Fahrzeugsicherheit',
    },
  },
  first_aid: {
    emoji: '🚑',
    label: {
      nl: 'Eerste hulp',
      en: 'First Aid',
      fr: 'Premiers secours',
      de: 'Erste Hilfe',
    },
  },
  environmental: {
    emoji: '🌿',
    label: {
      nl: 'Milieu',
      en: 'Environmental',
      fr: 'Environnement',
      de: 'Umwelt',
    },
  },
};
