
import { InstagramPost } from './types';

export interface UpcomingProject {
  id: string;
  title: string;
  date: string;
  description: string;
  status: 'UPCOMING' | 'LIVE' | 'ARCHIVED';
  tag: string;
}

export const UPCOMING_PROJECTS: UpcomingProject[] = [
  {
    id: 'proj-1',
    title: 'GRIME GATHERING III: THE AWAKENING',
    date: 'JAN 15 2026',
    description: 'A massive industrial space gathering featuring the best of HK Grime and UK Bass. Limited ticket release.',
    status: 'UPCOMING',
    tag: 'LIVE EVENT'
  },
  {
    id: 'proj-2',
    title: 'VEE COLLECTIVE ARTBOOK V1',
    date: 'FEB 02 2026',
    description: 'Pre-orders for our first physical archive documenting the 2013-2025 journey. Hardcover, 300 pages.',
    status: 'UPCOMING',
    tag: 'MERCH DROP'
  }
];

// Curated high-fidelity placeholder images that strictly match the visual descriptions in the PDF (P.1 - P.4)
const PDF_THEMED_IMAGES = [
  // Page 1: Rap Battles & Red Beanies
  "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?auto=format&fit=crop&q=80&w=800", // Rap Battle Poster vibe
  "https://images.unsplash.com/photo-1520156557489-35733238637c?auto=format&fit=crop&q=80&w=800", // Blue/Purple Club lighting
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800", // Guy in red beanie/mask
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800", // Yellow/Red abstract graphic
  "https://images.unsplash.com/photo-1594623930572-300a3011d9ae?auto=format&fit=crop&q=80&w=800", // Mellow Grime Event art
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800", // Portrait in low light
  "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800", // Grime artist portrait
  "https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=800", // VEE Red/White poster

  // Page 2: Studio & Gear
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800", // DJ Mixer close-up
  "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=800", // Studio monitors
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800", // Studio Mic
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800", // Audio Interface/Gear
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800", // Metallic teeth detail
  "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800", // Desert "Mask On/Off"
  "https://images.unsplash.com/photo-1514119412350-e174d90d280e?auto=format&fit=crop&q=80&w=800", // B&W City "ACHCHILL"
  "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&q=80&w=800", // Album Cover Grid

  // Page 3: Graphics & Collective
  "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800", // Collective Group Shot
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800", // Hands illustration "Life is not perfect"
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800", // Typography/Quote "EE"
  "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800", // Underground gathering
  "https://images.unsplash.com/photo-1517230878791-4d28214057c2?auto=format&fit=crop&q=80&w=800", // Standing on Business portrait
  "https://images.unsplash.com/photo-1514525253361-bee8d488fbfe?auto=format&fit=crop&q=80&w=800", // Haysen Cheng North American Tour
  "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&q=80&w=800", // Yellow high contrast graphic
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=800", // Crowds/Reflections

  // Page 4: Lifestyle & Live
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", // Deadlift / Gym vibe
  "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=800", // Live performance Wiley
  "https://images.unsplash.com/photo-1526218626217-dc65a29bb444?auto=format&fit=crop&q=80&w=800", // Modern HK streetwear
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800", // Showreel 2024
];

const PDF_CONTENT_LIST = [
  { caption: "地下城 II RAP BATTLE - 24 AUG $380 @ Mellow Grime", tags: ["#hkhiphop", "#rapbattle"] },
  { caption: "Mellow Grime Friday Hip-Hop Night - Vibing & Freestyle", tags: ["#fridaynight", "#mellowgrime"] },
  { caption: "1300 일삼공공 - Brr session recording in progress", tags: ["#studio", "#production"] },
  { caption: "VEE Gathering: Hon Rapper Hip-Hop HK showcase", tags: ["#gathering", "#veehk"] },
  { caption: "Anyway write some bars - Studio setup with DJ equipment", tags: ["#bars", "#beats"] },
  { caption: "Grime Gathering: 28th NOV (Fri) 9pm $180 Entry", tags: ["#grime", "#event"] },
  { caption: "Do you think differently? Mask On vs. Off? Creative reflections.", tags: ["#philosophy", "#art"] },
  { caption: "Haysen Cheng - North American Tour 2025 Dates", tags: ["#tour", "#haysencheng"] },
  { caption: "Yo look at this - New studio additions and sound check", tags: ["#gear", "#studio"] },
  { caption: "Standing on Business!! Portrait of the collective core members.", tags: ["#team", "#collective"] },
  { caption: "Fred again.. x Skepta - Skepta.. Fred project review", tags: ["#skepta", "#fredagain"] },
  { caption: "WAVYSOUND: 新世代冒險家 Featuring Haysen Cheng", tags: ["#adventure", "#visuals"] },
  { caption: "Everybody Loves HipHop - Parental Advisory vibe session", tags: ["#hiphopculture"] },
  { caption: "Life is not perfect - Hands shaking graphic design", tags: ["#graphics", "#concept"] },
  { caption: "EE Quote: Life starts where the comfort zone ends. Aesthetic typography.", tags: ["#motivation"] },
  { caption: "YOYOU - Underground gathering reflections and aftermovie coming.", tags: ["#underground"] },
  { caption: "Metallic Teeth aesthetic - Visual experiments for the next drop.", tags: ["#aesthetic", "#3d"] },
  { caption: "ACHCHILL - The unique sound of the city at 3AM.", tags: ["#citylife", "#vibes"] },
  { caption: "Grid of inspiration - A collection of classic album covers.", tags: ["#inspiration"] },
  { caption: "Wiley freestyle - on the daily's crazy performance", tags: ["#wiley", "#freestyle"] },
  { caption: "G.man character design - Yellow & Black high contrast work.", tags: ["#illustration"] },
  { caption: "VEE Red Logo - Exploring branding concepts for 2026.", tags: ["#branding"] },
  { caption: "Studio monitor close-up - Precision sound engineering.", tags: ["#audio"] },
  { caption: "Desert landscape - The thinking process behind the latest project.", tags: ["#desert", "#creative"] },
  { caption: "Deadlift 40kg session - Balancing life and grind.", tags: ["#fitness", "#lifestyle"] },
  { caption: "VEE PARTY 2023 - Best moments from the warehouse rave.", tags: ["#party", "#memories"] },
  { caption: "90's Hip Hop influence - Revisiting the roots of the sound.", tags: ["#90s", "#retro"] },
  { caption: "Showreel 2024 - A compilation of all collective projects.", tags: ["#showreel"] }
];

export const MOCK_POSTS: InstagramPost[] = Array.from({ length: 588 }, (_, i) => {
  const isFromPdf = i < PDF_CONTENT_LIST.length;
  const pdfItem = isFromPdf ? PDF_CONTENT_LIST[i] : null;
  const themedImageUrl = isFromPdf ? PDF_THEMED_IMAGES[i % PDF_THEMED_IMAGES.length] : null;
  
  return {
    id: `post-${i}`,
    imageUrl: themedImageUrl || `https://picsum.photos/seed/vee-archive-${i + 2000}/800/800`,
    caption: pdfItem 
      ? `${pdfItem.caption} ${pdfItem.tags.join(' ')}`
      : [
          "Captured moments in the city. 🌆 #Vee",
          "Aesthetics of the underground. #Archive",
          "Current frequency. ✨ #VeeCollective",
          "Historical frames. #Est2013",
          "The vision continues. #ModernArt",
          "Refining the craft. #Production",
          "Textures of HK. #Urban",
          "Exploring new horizons. #Creative"
        ][i % 8],
    timestamp: new Date(Date.now() - (i * 0.7) * 86400000).toISOString(),
    likes: Math.floor(Math.random() * 12000) + 1000,
    comments: Math.floor(Math.random() * 500) + 50,
    permalink: `https://www.instagram.com/veeeeeeeeeehk/`
  };
});
