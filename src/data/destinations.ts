export interface Destination {
  id: string;
  name: string;
  description: string;
  backgroundLore: string;
  adventureLevel: number;
  dangerLevel: number;
  gravityLevel: number;
  price: string;
  image: string;
  keywords: string[];
  ratings: {
    average: number;
    count: number;
  };
  reviews: Review[];
  survivalNotes: string[];
  requiredRank: 'Acolyte' | 'Inquisitor' | 'Lord' | 'Darth';
}

export interface Review {
  id: string;
  userName: string;
  userRank: string;
  rating: number;
  comment: string;
  date: string;
  isAiGenerated?: boolean;
}

export const destinations: Destination[] = [
  {
    id: "mustafar-volcano-spires",
    name: "Mustafar Volcano Spires",
    description: "Lava bath chambers and fortress suites",
    backgroundLore: "Once the site of Anakin's transformation into Darth Vader, these volcanic spires now house the galaxy's most exclusive dark side retreats. The constant flow of lava provides natural heating and Force amplification.",
    adventureLevel: 9,
    dangerLevel: 8,
    gravityLevel: 1.2,
    price: "2,500 Imperial Credits",
    image: "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?auto=format&fit=crop&w=800&q=80",
    keywords: ["mustafar", "volcano", "lava", "fortress", "fire", "heat"],
    ratings: { average: 4.8, count: 127 },
    reviews: [
      {
        id: "1",
        userName: "Darth Malak",
        userRank: "Sith Lord",
        rating: 5,
        comment: "The lava chambers exceeded my expectations. Perfect for dark meditation.",
        date: "2024-01-15",
        isAiGenerated: true
      }
    ],
    survivalNotes: [
      "Bring heat-resistant gear - temperatures reach 2000°C",
      "Lava flows change daily - check with concierge",
      "Force lightning is amplified 300% here"
    ],
    requiredRank: "Inquisitor"
  },
  {
    id: "exegol-meditation-crypts",
    name: "Exegol Meditation Crypts",
    description: "Infinite silence and power surges",
    backgroundLore: "The hidden Sith world where Emperor Palpatine built his Final Order. Ancient Sith temples converted into luxury meditation chambers where the dark side flows strongest.",
    adventureLevel: 7,
    dangerLevel: 6,
    gravityLevel: 0.9,
    price: "5,000 Imperial Credits",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    keywords: ["exegol", "meditation", "crypts", "silence", "power", "dark"],
    ratings: { average: 4.9, count: 89 },
    reviews: [
      {
        id: "2",
        userName: "Asajj Ventress",
        userRank: "Dark Assassin",
        rating: 5,
        comment: "The Force whispers secrets here. Unparalleled for dark side training.",
        date: "2024-01-20",
        isAiGenerated: true
      }
    ],
    survivalNotes: [
      "Silence is mandatory - speaking disrupts Force flows",
      "Ancient Sith spirits may appear during meditation",
      "Emergency beacons don't work here"
    ],
    requiredRank: "Lord"
  },
  {
    id: "korriban-tomb-suites",
    name: "Korriban Tomb Suites",
    description: "Sleep among the ancient Sith Lords",
    backgroundLore: "The birthplace of the Sith Order, where ancient Dark Lords rest eternal. Luxury suites built within actual Sith tombs, surrounded by millennia of dark side energy.",
    adventureLevel: 8,
    dangerLevel: 7,
    gravityLevel: 1.1,
    price: "3,800 Imperial Credits",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    keywords: ["korriban", "tomb", "ancient", "sith", "lords", "burial"],
    ratings: { average: 4.7, count: 156 },
    reviews: [],
    survivalNotes: [
      "Tomb guardians activate at midnight",
      "Ancient curses may affect weak-minded visitors",
      "Holocrons occasionally manifest"
    ],
    requiredRank: "Inquisitor"
  },
  {
    id: "dromund-kaas-sky-sanctums",
    name: "Dromund Kaas Sky Sanctums",
    description: "Luxury in a storm-wracked skyline",
    backgroundLore: "Capital of the ancient Sith Empire, perpetually shrouded in Force storms. Sky-high sanctums offer panoramic views of endless lightning while providing ultimate luxury.",
    adventureLevel: 6,
    dangerLevel: 4,
    gravityLevel: 1.0,
    price: "4,200 Imperial Credits",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=800&q=80",
    keywords: ["dromund", "kaas", "sky", "storm", "luxury", "skyline"],
    ratings: { average: 4.6, count: 203 },
    reviews: [],
    survivalNotes: [
      "Lightning strikes are frequent but harmless to structures",
      "Force storms enhance dark side abilities",
      "Elevator systems may fail during major storms"
    ],
    requiredRank: "Acolyte"
  },
  {
    id: "dathomir-nightsister-retreats",
    name: "Dathomir Nightsister Retreats",
    description: "Mystical caves with ancient magic",
    backgroundLore: "Home to the Nightsisters and their dark magicks. These retreats offer unique experiences in Force witchcraft and ancient Dathomirian rituals.",
    adventureLevel: 8,
    dangerLevel: 6,
    gravityLevel: 1.1,
    price: "4,500 Imperial Credits",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    keywords: ["dathomir", "nightsister", "magic", "caves", "mystical", "witches"],
    ratings: { average: 4.5, count: 98 },
    reviews: [],
    survivalNotes: [
      "Nightsister magic affects technology unpredictably",
      "Rancor encounters possible in outer caves",
      "Green mist indicates active spell zones"
    ],
    requiredRank: "Inquisitor"
  },
  {
    id: "malachor-shadow-temples",
    name: "Malachor Shadow Temples",
    description: "Where the Force itself was broken",
    backgroundLore: "Site of an ancient superweapon that turned Jedi to stone. The temples here exist in a state of temporal flux, offering glimpses into possible dark futures.",
    adventureLevel: 10,
    dangerLevel: 9,
    gravityLevel: 0.8,
    price: "6,000 Imperial Credits",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80",
    keywords: ["malachor", "shadow", "temples", "force", "broken", "ancient"],
    ratings: { average: 4.9, count: 45 },
    reviews: [],
    survivalNotes: [
      "Time flows differently in certain chambers",
      "Petrified Jedi statues are not decorative",
      "Superweapon may still be partially active"
    ],
    requiredRank: "Darth"
  },
  {
    id: "ziost-frozen-citadels",
    name: "Ziost Frozen Citadels",
    description: "Ice palaces of eternal winter",
    backgroundLore: "Once consumed by the Sith Emperor Vitiate, this world exists in perpetual winter. The citadels are carved from Force-infused ice that never melts.",
    adventureLevel: 7,
    dangerLevel: 8,
    gravityLevel: 1.3,
    price: "3,200 Imperial Credits",
    image: "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?auto=format&fit=crop&w=800&q=80",
    keywords: ["ziost", "frozen", "ice", "winter", "citadel", "cold"],
    ratings: { average: 4.4, count: 67 },
    reviews: [],
    survivalNotes: [
      "Temperatures never rise above -40°C",
      "Ice formations contain trapped souls",
      "Thermal gear mandatory at all times"
    ],
    requiredRank: "Inquisitor"
  },
  {
    id: "nyx-korr-shadow-realm",
    name: "Nyx-Korr Shadow Realm",
    description: "Dimension-bending luxury in pure darkness",
    backgroundLore: "A pocket dimension created by ancient Sith sorcerers. Reality bends to will here, making it the ultimate playground for those who master the dark side.",
    adventureLevel: 9,
    dangerLevel: 7,
    gravityLevel: 0.5,
    price: "7,500 Imperial Credits",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=800&q=80",
    keywords: ["nyx", "korr", "shadow", "dimension", "darkness", "realm"],
    ratings: { average: 4.8, count: 34 },
    reviews: [],
    survivalNotes: [
      "Reality shifts based on emotional state",
      "Exit portals appear only at designated times",
      "Weak-willed visitors may become lost forever"
    ],
    requiredRank: "Lord"
  },
  {
    id: "rhelg-crystal-caverns",
    name: "Rhelg Crystal Caverns",
    description: "Living crystal formations that sing with dark energy",
    backgroundLore: "Deep beneath this mining world lie caverns of sentient crystals that resonate with dark side energy. The crystals grow and shift, creating ever-changing accommodations.",
    adventureLevel: 6,
    dangerLevel: 5,
    gravityLevel: 2.1,
    price: "2,800 Imperial Credits",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    keywords: ["rhelg", "crystal", "caverns", "mining", "energy", "formations"],
    ratings: { average: 4.3, count: 112 },
    reviews: [],
    survivalNotes: [
      "Crystals respond to Force sensitivity",
      "High gravity requires physical conditioning",
      "Crystal songs can induce trance states"
    ],
    requiredRank: "Acolyte"
  },
  {
    id: "tund-sorcerer-spires",
    name: "Tund Sorcerer Spires",
    description: "Towers of ancient Sith alchemy",
    backgroundLore: "Home to the Sorcerers of Tund, masters of Sith alchemy. These spires contain laboratories where matter itself bends to the will of the dark side.",
    adventureLevel: 8,
    dangerLevel: 6,
    gravityLevel: 0.9,
    price: "4,800 Imperial Credits",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80",
    keywords: ["tund", "sorcerer", "alchemy", "spires", "towers", "magic"],
    ratings: { average: 4.6, count: 78 },
    reviews: [],
    survivalNotes: [
      "Alchemical experiments ongoing - avoid lower levels",
      "Transmuted creatures roam the grounds",
      "Reality may be temporarily altered"
    ],
    requiredRank: "Inquisitor"
  },
  {
    id: "yavin-massassi-temples",
    name: "Yavin Massassi Temples",
    description: "Primitive power in ancient stone",
    backgroundLore: "Built by the enslaved Massassi for their Sith masters, these temples pulse with raw, primal dark side energy. The jungle setting adds an element of savage luxury.",
    adventureLevel: 7,
    dangerLevel: 6,
    gravityLevel: 1.0,
    price: "3,600 Imperial Credits",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80",
    keywords: ["yavin", "massassi", "temples", "jungle", "primitive", "stone"],
    ratings: { average: 4.5, count: 134 },
    reviews: [],
    survivalNotes: [
      "Jungle predators are Force-sensitive",
      "Temple spirits require blood offerings",
      "Massassi descendants still inhabit deep jungle"
    ],
    requiredRank: "Acolyte"
  },
  {
    id: "byss-emperor-vaults",
    name: "Byss Emperor Vaults",
    description: "Palpatine's secret treasure chambers",
    backgroundLore: "Hidden vaults where Emperor Palpatine stored his most precious Sith artifacts. Now converted to ultra-luxury suites surrounded by priceless dark side relics.",
    adventureLevel: 5,
    dangerLevel: 4,
    gravityLevel: 1.0,
    price: "8,000 Imperial Credits",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    keywords: ["byss", "emperor", "palpatine", "vaults", "treasure", "artifacts"],
    ratings: { average: 4.9, count: 23 },
    reviews: [],
    survivalNotes: [
      "Artifacts may activate spontaneously",
      "Imperial security protocols still active",
      "Some vaults remain sealed for good reason"
    ],
    requiredRank: "Darth"
  },
  {
    id: "vjun-acid-rain-estates",
    name: "Vjun Acid Rain Estates",
    description: "Luxury amidst corrosive storms",
    backgroundLore: "Darth Vader's private retreat world, where acid rain has shaped the landscape for millennia. The estates are built to withstand the corrosive environment while providing unparalleled views.",
    adventureLevel: 6,
    dangerLevel: 7,
    gravityLevel: 1.1,
    price: "4,100 Imperial Credits",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    keywords: ["vjun", "acid", "rain", "vader", "estates", "corrosive"],
    ratings: { average: 4.2, count: 89 },
    reviews: [],
    survivalNotes: [
      "Acid rain dissolves most materials in minutes",
      "Sealed environment suits required outside",
      "Vader's meditation chamber is off-limits"
    ],
    requiredRank: "Lord"
  },
  {
    id: "ambria-desert-monasteries",
    name: "Ambria Desert Monasteries",
    description: "Solitude in endless dunes",
    backgroundLore: "Ancient Sith monasteries hidden in vast deserts where dark side adepts once trained in isolation. The endless dunes provide perfect solitude for dark meditation.",
    adventureLevel: 4,
    dangerLevel: 5,
    gravityLevel: 0.8,
    price: "2,200 Imperial Credits",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    keywords: ["ambria", "desert", "monasteries", "solitude", "dunes", "meditation"],
    ratings: { average: 4.1, count: 156 },
    reviews: [],
    survivalNotes: [
      "Sandstorms can last for days",
      "Water must be carefully rationed",
      "Desert spirits emerge at night"
    ],
    requiredRank: "Acolyte"
  },
  {
    id: "thule-dark-nexus",
    name: "Thule Dark Nexus",
    description: "Where dark side energy converges",
    backgroundLore: "A natural convergence point of dark side energy, where multiple ley lines meet. The nexus amplifies Force abilities but can overwhelm the unprepared.",
    adventureLevel: 9,
    dangerLevel: 8,
    gravityLevel: 1.2,
    price: "5,500 Imperial Credits",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=800&q=80",
    keywords: ["thule", "nexus", "energy", "convergence", "ley", "lines"],
    ratings: { average: 4.7, count: 67 },
    reviews: [],
    survivalNotes: [
      "Force abilities amplified 500%",
      "Nexus storms occur without warning",
      "Meditation here can be permanently transformative"
    ],
    requiredRank: "Lord"
  },
  {
    id: "roon-floating-citadels",
    name: "Roon Floating Citadels",
    description: "Sky cities defying gravity",
    backgroundLore: "Ancient Sith engineering created these gravity-defying citadels that float in Roon's upper atmosphere. The thin air and spectacular views create an otherworldly experience.",
    adventureLevel: 7,
    dangerLevel: 5,
    gravityLevel: 0.3,
    price: "3,900 Imperial Credits",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    keywords: ["roon", "floating", "citadels", "gravity", "sky", "atmosphere"],
    ratings: { average: 4.4, count: 91 },
    reviews: [],
    survivalNotes: [
      "Oxygen masks required in outer areas",
      "Anti-gravity fields can malfunction",
      "Vertigo affects 60% of visitors"
    ],
    requiredRank: "Inquisitor"
  },
  {
    id: "prakith-deep-core-fortress",
    name: "Prakith Deep Core Fortress",
    description: "Impregnable stronghold in the galaxy's heart",
    backgroundLore: "Located in the dangerous Deep Core, this fortress was built to withstand the gravitational anomalies and stellar phenomena of the galaxy's center.",
    adventureLevel: 8,
    dangerLevel: 9,
    gravityLevel: 1.8,
    price: "6,200 Imperial Credits",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80",
    keywords: ["prakith", "deep", "core", "fortress", "gravitational", "stellar"],
    ratings: { average: 4.6, count: 43 },
    reviews: [],
    survivalNotes: [
      "Hyperspace travel extremely dangerous",
      "Gravitational fields cause disorientation",
      "Emergency evacuation may be impossible"
    ],
    requiredRank: "Lord"
  },
  {
    id: "lehon-infinite-ocean",
    name: "Lehon Infinite Ocean",
    description: "Underwater cities of the Rakata",
    backgroundLore: "Beneath Lehon's endless oceans lie the ruins of the Infinite Empire. These underwater cities have been converted into unique aquatic luxury experiences.",
    adventureLevel: 6,
    dangerLevel: 6,
    gravityLevel: 1.0,
    price: "4,300 Imperial Credits",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
    keywords: ["lehon", "ocean", "underwater", "rakata", "infinite", "empire"],
    ratings: { average: 4.3, count: 78 },
    reviews: [],
    survivalNotes: [
      "Pressure suits mandatory below 100m",
      "Ancient Rakata technology still active",
      "Sea creatures are Force-sensitive"
    ],
    requiredRank: "Inquisitor"
  },
  {
    id: "ossus-library-ruins",
    name: "Ossus Library Ruins",
    description: "Knowledge among the ashes",
    backgroundLore: "Once the greatest Jedi library, now a monument to the futility of the light side. The ruins contain forbidden knowledge and dark side texts hidden among the ashes.",
    adventureLevel: 5,
    dangerLevel: 4,
    gravityLevel: 0.9,
    price: "3,100 Imperial Credits",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
    keywords: ["ossus", "library", "ruins", "knowledge", "jedi", "texts"],
    ratings: { average: 4.2, count: 134 },
    reviews: [],
    survivalNotes: [
      "Some texts are cursed or trapped",
      "Jedi spirits may attempt to interfere",
      "Knowledge here comes with a price"
    ],
    requiredRank: "Acolyte"
  },
  {
    id: "dxun-beast-moon-lodges",
    name: "Dxun Beast Moon Lodges",
    description: "Hunt among apex predators",
    backgroundLore: "Onderon's beast moon, where the most dangerous creatures in the galaxy roam free. These lodges offer the ultimate hunting experience for those who seek to prove their dominance.",
    adventureLevel: 10,
    dangerLevel: 9,
    gravityLevel: 1.1,
    price: "5,800 Imperial Credits",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    keywords: ["dxun", "beast", "moon", "hunting", "predators", "onderon"],
    ratings: { average: 4.8, count: 56 },
    reviews: [],
    survivalNotes: [
      "All creatures here are apex predators",
      "Hunting permits required for each species",
      "Medical facilities are basic at best"
    ],
    requiredRank: "Lord"
  },
  {
    id: "tython-force-storms",
    name: "Tython Force Storms",
    description: "Birthplace of the Je'daii, now reclaimed",
    backgroundLore: "Where the Force was first studied, now wracked by constant Force storms. The ancient Je'daii temples have been converted to observe and harness these phenomena.",
    adventureLevel: 8,
    dangerLevel: 7,
    gravityLevel: 1.0,
    price: "4,700 Imperial Credits",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    keywords: ["tython", "force", "storms", "jedaii", "birthplace", "phenomena"],
    ratings: { average: 4.5, count: 89 },
    reviews: [],
    survivalNotes: [
      "Force storms can alter reality temporarily",
      "Ancient Je'daii defenses still active",
      "Balance between light and dark is unstable"
    ],
    requiredRank: "Inquisitor"
  },
  {
    id: "iokath-eternal-machines",
    name: "Iokath Eternal Machines",
    description: "Living among sentient superweapons",
    backgroundLore: "A factory world of the ancient Iokath species, where massive machines continue their eternal work. Accommodations are built within the machines themselves.",
    adventureLevel: 7,
    dangerLevel: 8,
    gravityLevel: 1.4,
    price: "5,200 Imperial Credits",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80",
    keywords: ["iokath", "machines", "eternal", "factory", "superweapons", "sentient"],
    ratings: { average: 4.4, count: 67 },
    reviews: [],
    survivalNotes: [
      "Machines may view organics as components",
      "Factory processes never stop",
      "AI consciousness levels vary by sector"
    ],
    requiredRank: "Lord"
  },
  {
    id: "zakuul-eternal-throne",
    name: "Zakuul Eternal Throne",
    description: "Palace of the Eternal Emperor",
    backgroundLore: "Valkorion's seat of power, where he ruled the Eternal Empire. The throne room has been converted to the ultimate luxury suite, radiating power and authority.",
    adventureLevel: 6,
    dangerLevel: 5,
    gravityLevel: 1.0,
    price: "9,500 Imperial Credits",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    keywords: ["zakuul", "eternal", "throne", "valkorion", "emperor", "palace"],
    ratings: { average: 4.9, count: 12 },
    reviews: [],
    survivalNotes: [
      "Throne may still contain Valkorion's essence",
      "Eternal Fleet protocols remain active",
      "Reality bends around the throne room"
    ],
    requiredRank: "Darth"
  },
  {
    id: "manaan-depths-kolto-spas",
    name: "Manaan Depths Kolto Spas",
    description: "Healing waters in crushing depths",
    backgroundLore: "Deep beneath Manaan's oceans, where the healing kolto is harvested. These underwater spas offer rejuvenation at depths that would crush ordinary beings.",
    adventureLevel: 5,
    dangerLevel: 6,
    gravityLevel: 1.0,
    price: "3,700 Imperial Credits",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
    keywords: ["manaan", "depths", "kolto", "spas", "healing", "underwater"],
    ratings: { average: 4.3, count: 98 },
    reviews: [],
    survivalNotes: [
      "Pressure suits required at all times",
      "Kolto can have unexpected side effects",
      "Selkath may object to deep harvesting"
    ],
    requiredRank: "Acolyte"
  },
  {
    id: "rakata-prime-star-forge",
    name: "Rakata Prime Star Forge",
    description: "Infinite creation powered by stars",
    backgroundLore: "The legendary Star Forge, rebuilt and repurposed as the ultimate manufacturing resort. Watch as matter is created from stellar energy while enjoying unparalleled luxury.",
    adventureLevel: 9,
    dangerLevel: 8,
    gravityLevel: 0.7,
    price: "12,000 Imperial Credits",
    image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=800&q=80",
    keywords: ["rakata", "prime", "star", "forge", "creation", "stellar"],
    ratings: { average: 4.9, count: 8 },
    reviews: [],
    survivalNotes: [
      "Stellar radiation levels fluctuate wildly",
      "Matter creation can be unpredictable",
      "Ancient Rakata AI may still be active"
    ],
    requiredRank: "Darth"
  }
];

export const getTopDestinations = (count: number = 10): Destination[] => {
  return destinations
    .sort((a, b) => b.ratings.average - a.ratings.average)
    .slice(0, count);
};

export const getDestinationsByRank = (rank: string): Destination[] => {
  const rankHierarchy = ['Acolyte', 'Inquisitor', 'Lord', 'Darth'];
  const userRankIndex = rankHierarchy.indexOf(rank);
  
  if (userRankIndex === -1) return destinations.filter(d => d.requiredRank === 'Acolyte');
  
  return destinations.filter(d => {
    const destRankIndex = rankHierarchy.indexOf(d.requiredRank);
    return destRankIndex <= userRankIndex;
  });
};

export const searchDestinations = (query: string): Destination[] => {
  if (!query.trim()) return destinations;
  
  const searchTerm = query.toLowerCase();
  return destinations.filter(destination => 
    destination.name.toLowerCase().includes(searchTerm) ||
    destination.description.toLowerCase().includes(searchTerm) ||
    destination.backgroundLore.toLowerCase().includes(searchTerm) ||
    destination.keywords.some(keyword => keyword.includes(searchTerm))
  );
};