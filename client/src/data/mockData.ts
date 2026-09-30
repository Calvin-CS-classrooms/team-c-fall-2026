export interface CampusLocation {
  id: string;
  name: string;
  subtitle: string;
  category: 'Libraries' | 'Lounges' | 'Dining/Cafes' | 'Labs' | 'Outdoors';
  rating: number;
  reviewCount: number;
  vibeTag: string;
  metricTag: string;
  metricIcon: string;
  statusTag: string;
  statusColor: string;
  statusDotColor: string;
  image: string;
  detailImages?: string[];
  locationDetails?: string;
  hoursToday?: string;
  metrics?: {
    noiseScore: number;
    noiseText: string;
    noiseSub: string;
    capacityScore: number;
    capacityText: string;
    capacitySub: string;
    deviceScore: number;
    deviceText: string;
    deviceSub: string;
    atmosphereScore: number;
    atmosphereText: string;
    atmosphereSub: string;
  };
  liveMetrics?: {
    temperature: string;
    wifiSpeed: string;
    openDesks: number;
    hoursLeft: string;
  };
  studentTake?: {
    quote: string;
    author: string;
    major: string;
    timeAgo: string;
  };
}

export const CALVIN_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDN1PJsbLG7YXa-T3QtEzjiZOGSao-iYO4a1n-A6DuOSOuEq0be3ehqS7E4cIVSV7fMN1qzZ1M6ehjmB6oLelyl_Hd-JTLNl9gys6OL1nrrUwzz6HVLZoTTR-F7ndLvrjnZrZNrdKNWQfeUY5m8uj5Dj_AOyB2KDLmfUGtI3mPGZgWNK9y6EBgkW9mZTpN9E5retpdY-weQGVrPihmuLaQf3HYJrkv1W5fHc7KpuND_hVPWV6Zh2oGK';

export const CAMPUS_LOCATIONS: CampusLocation[] = [
  {
    id: 'hekman-library',
    name: 'Hekman Library',
    subtitle: 'Main Campus Center • Floors 1–4',
    category: 'Libraries',
    rating: 4.7,
    reviewCount: 142,
    vibeTag: 'Quiet Study',
    metricTag: 'Strong',
    metricIcon: 'wifi',
    statusTag: 'Quiet',
    statusColor: '#006837',
    statusDotColor: '#00a859',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCUOzzZ1WDtAMe96B8f2wd3T3m9bErm9Xeug6oK5F2h1vMwhpR9tEN4gU3Lm1XNiZXDqcKDKEvXstgh6vxSxFH5ecg_eXMjITe0n3dgYKidopLMM8oe5WIJvmVrHTe-wf7_HYjH2mj31eQXICds_zs1ZNHR6vR2UR7Y7JTiE23PLFqOWzAZDXdGzHickv83l5Pxj2zBDk9o85tgJoscUrJIyqz2BPdqfonPAp221DxoVUiesIbgSofr',
    detailImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdf2aoel0obnIfOiWnGYWzWN6pcg6D9qVVOgdBobUYlNU0jPbq-rUYBuDm_NP2rP3b3DyNlfWhyew2oXJ5TaRFuW60mOfCG6kapnvUO_RIErDL8CiI7qIz4ZqQxyRZYIQFJjIj4Uzr1HHpIgeX_YU8WevM8IuKrpRIagDhJ_MDrI-Esi4d6fCalko6UUynhQVHZgGYT9KQVXqoRihf-ydEGdCnYLz1eHNPcTSQjz4vleb2WwnZPXG4',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA_yMFdAPaj1QTf_KFJ3iKtsbPMQmgufwbROg7ydJ9AQpaR8hX1PD_PtcGfzYVMSZ6rz3brS4wCn_KGI_nfMQ4ZxeoP4rVGZmGLER_nKhMBirWHUo7rpiXQ8bMSkFcQuJocXurXSq3CV-6KN-EV6-g3jRT2W_7W6-as83ifAVXJgp9X5HuGahptHQqpBBW2NHRUr9EDc3VA7gXwWodc0ufp9cEY1Br6GvRtjgq-O_ikkFIIcPyhyGC2',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDo0icVZz-Ji17fQDgVinnCq_9zomTd6ndrJnPSMu5nU6QMUc-U4eg9fvAyJowPQ076rZrTkrkUBzr-kn8tg60BQ3TR998j3K9D6JQ0yQM_DaKTDywF4VmoYEqX6G-m2MbvRxyyEgQkpIj0N81gooqOG2oWTJ1Mt8r9fDt407JWXQk_0Xkq4PSglKCLcTXQKnli1g3xWelpUlSwBT8TTo2NDvZz13cO39j9hIph2KGq-6fsFrNWzbCN',
    ],
    locationDetails: 'North Campus • 2nd Floor East Wing (Near Periodicals)',
    hoursToday: 'Open today • 7:00 AM – 11:00 PM',
    metrics: {
      noiseScore: 4.8,
      noiseText: 'Noise Level',
      noiseSub: 'Whisper quiet / Silent study policy strictly honored',
      capacityScore: 4.5,
      capacityText: 'Capacity & Seating',
      capacitySub: 'Seats ~85, typically 20+ desks open at night',
      deviceScore: 4.7,
      deviceText: 'Device Access & Outlets',
      deviceSub: 'Wall & table power at every desk, strong eduroam',
      atmosphereScore: 4.6,
      atmosphereText: 'Atmosphere & Lighting',
      atmosphereSub: 'Warm reading lamps, large exterior tree-view windows',
    },
    liveMetrics: {
      temperature: '69°F • Ideal',
      wifiSpeed: '220 Mbps',
      openDesks: 18,
      hoursLeft: '4h left',
    },
    studentTake: {
      quote:
        'Best spot on campus during finals week. Never have to hunt for a plug, and the gentle HVAC hum makes it easy to lock in.',
      author: 'Junior',
      major: 'Computer Science Major',
      timeAgo: '3 days ago',
    },
  },
  {
    id: 'spoelhof-fieldhouse',
    name: 'Spoelhof Fieldhouse',
    subtitle: 'Athletics Complex • 1st Floor',
    category: 'Lounges',
    rating: 4.3,
    reviewCount: 98,
    vibeTag: 'Active / Daylight',
    metricTag: 'Bright',
    metricIcon: 'wb-sunny',
    statusTag: 'Moderate',
    statusColor: '#92400e',
    statusDotColor: '#f59e0b',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBDqDgOI1uolpq9VQAVHAvPRJ1-ADO31KtOUyT04C_g6sXOuV0q1iNuYEt8Tt44N-KxuJXrSadHuoW7Brv4oX3UBGBIaLDeaXOY9u09X1xOlgUhxY-8XpMMGgFihMg6JKm4uIVx6Z2BIQj-6n1apaB96Y6fROZ28vmKeamtDd6ExXg3JJfTGwa-L46sJ9QqaldtpJqWaGIIGQxX_IvGJXWZTJjY374qjK_enREUKhs5aQ9HyZExdZw0',
    locationDetails: 'Athletics Complex • 1st Floor Main Atrium',
    hoursToday: 'Open today • 6:00 AM – 10:00 PM',
    metrics: {
      noiseScore: 3.5,
      noiseText: 'Noise Level',
      noiseSub: 'Moderate conversational background sound',
      capacityScore: 4.8,
      capacityText: 'Capacity & Seating',
      capacitySub: 'Spacious lounge seating and tall tables',
      deviceScore: 3.9,
      deviceText: 'Device Access & Outlets',
      deviceSub: 'Outlets along pillar perimeters',
      atmosphereScore: 4.7,
      atmosphereText: 'Atmosphere & Lighting',
      atmosphereSub: 'High ceiling glass atrium with natural daylight',
    },
    liveMetrics: {
      temperature: '71°F • Comfortable',
      wifiSpeed: '180 Mbps',
      openDesks: 32,
      hoursLeft: '3h left',
    },
  },
  {
    id: 'devries-greenhouse',
    name: 'DeVries Greenhouse Lounge',
    subtitle: 'Science Complex • 3rd Floor',
    category: 'Labs',
    rating: 4.8,
    reviewCount: 76,
    vibeTag: 'Super Quiet',
    metricTag: 'Plants',
    metricIcon: 'eco',
    statusTag: 'Silent',
    statusColor: '#006837',
    statusDotColor: '#00a859',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDlnWZ4IfsvkUpPPKH7dgPewWr5xjPRpdm8ExEGUCUi4HGBnjLE1c4moJVvyywZgKSOCNY8mnUCNKciRd9olXIppsvCgJjT06cE2SCKWytJLjmFUJi1-BfWM_AgrxiwRYqwXM86PF7cq8PzzR-8VUTp2K4j1JbmrU2H1KJU-ZBynNPRMvZ72u5M4I8vvBOd8GrUoSWQRKkLR_BHkCQtaNR4sWXVAEaXH7QrV-0Hr303sO8Q3i5CKhJH',
    locationDetails: 'Science Complex • 3rd Floor Solarium',
    hoursToday: 'Open today • 8:00 AM – 9:00 PM',
    metrics: {
      noiseScore: 4.9,
      noiseText: 'Noise Level',
      noiseSub: 'Tranquil sanctuary with gentle water feature',
      capacityScore: 3.8,
      capacityText: 'Capacity & Seating',
      capacitySub: 'Limited seating: 12 cozy armchairs',
      deviceScore: 4.1,
      deviceText: 'Device Access & Outlets',
      deviceSub: 'Floor receptacles near seating clusters',
      atmosphereScore: 5.0,
      atmosphereText: 'Atmosphere & Lighting',
      atmosphereSub: 'Living botanical greenery and skylight glow',
    },
    liveMetrics: {
      temperature: '73°F • Warm & Humid',
      wifiSpeed: '195 Mbps',
      openDesks: 4,
      hoursLeft: '2h left',
    },
  },
  {
    id: 'commons-dining',
    name: 'Commons Dining & Loft',
    subtitle: 'Commons Building • 2nd Floor',
    category: 'Dining/Cafes',
    rating: 4.1,
    reviewCount: 215,
    vibeTag: 'Social / Coffee',
    metricTag: 'Coffee Bar',
    metricIcon: 'local-cafe',
    statusTag: 'Bustling',
    statusColor: '#92400e',
    statusDotColor: '#f59e0b',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQvRwphu9b4et3yTEBJV4n0MPJSGawf_4jHBHprfnQW0I0-u6k8-yLT9VK0xjLgfk6NmHJsSOKbnh0gP478_3hKFlf5BI8LjtORQoeBNR9yADRl2YcQ_-N_D5qSyRl6cdO8H_JLcWNdbYiA7hL5CG1G1bl5ck8xC_D6duKGddOSXEVTjYkUCmi-DrK-522du0k682tNyu-k57Vwx9rN8BWLxsscIfwaIXOxJk3tAYaaX9GK5Q74lEb',
    locationDetails: 'Commons Building • 2nd Floor Mezzanine',
    hoursToday: 'Open today • 7:30 AM – 11:30 PM',
    metrics: {
      noiseScore: 2.8,
      noiseText: 'Noise Level',
      noiseSub: 'Energetic campus hub with coffee chatter',
      capacityScore: 4.9,
      capacityText: 'Capacity & Seating',
      capacitySub: 'Abundant booths, tables, and bar stools',
      deviceScore: 4.2,
      deviceText: 'Device Access & Outlets',
      deviceSub: 'Built-in AC and USB ports in high-top benches',
      atmosphereScore: 4.5,
      atmosphereText: 'Atmosphere & Lighting',
      atmosphereSub: 'Warm Edison lighting, artisan coffee aromas',
    },
    liveMetrics: {
      temperature: '70°F • Cozy',
      wifiSpeed: '240 Mbps',
      openDesks: 25,
      hoursLeft: '4.5h left',
    },
  },
  {
    id: 'cfac-lounges',
    name: 'CFAC Practice Lounges',
    subtitle: 'Arts Center • Ground Floor',
    category: 'Lounges',
    rating: 4.6,
    reviewCount: 64,
    vibeTag: 'Focused',
    metricTag: 'Piano Labs',
    metricIcon: 'music-note',
    statusTag: 'Acoustic',
    statusColor: '#006837',
    statusDotColor: '#00a859',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDeAXkGROMgYMQdOXMdchmyI2Ri_n7H1cFbFxiXKbLVLyuwxI89sRYlvLeqIRGc2ypQJ4cM7dSktVNRzp6MrmuZayRXOn2xTu6OcZLFYSNdbjYutezhc6TBpoI7XIhSHqYGFOCVfNolUBtUyxkfv9ROOXZ7xWkXz-cXsPrsllu_aofkVIBM4l6-ZQqnL9mdfLViRsYxw3rHh0iDCMKXgxnUbe3YwMSZ-Jm5JNO1Y_3k_g7VkX4b0REl',
    locationDetails: 'Covenant Fine Arts Center • Ground Level Alcove',
    hoursToday: 'Open today • 7:00 AM – Midnight',
    metrics: {
      noiseScore: 4.6,
      noiseText: 'Noise Level',
      noiseSub: 'Acoustic dampening with faint distant piano notes',
      capacityScore: 3.9,
      capacityText: 'Capacity & Seating',
      capacitySub: 'Individual carrels and practice nooks',
      deviceScore: 4.5,
      deviceText: 'Device Access & Outlets',
      deviceSub: 'Direct wall plugs in each practice booth',
      atmosphereScore: 4.8,
      atmosphereText: 'Atmosphere & Lighting',
      atmosphereSub: 'Dramatic warm architectural illumination',
    },
    liveMetrics: {
      temperature: '68°F • Crisp',
      wifiSpeed: '210 Mbps',
      openDesks: 8,
      hoursLeft: '5h left',
    },
  },
];
