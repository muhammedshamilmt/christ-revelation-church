export type GalleryMediaType = 'image' | 'video';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Worship' | 'Gatherings' | 'Conferences' | 'Fellowship' | 'Youth' | 'Prayer';
  mediaType?: GalleryMediaType;
  imageUrl: string;
  videoUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  date: string;
  location?: string;
  description: string;
  aspectRatio?: 'tall' | 'wide' | 'square';
  featured?: boolean;
}

export const ALLOWED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif'] as const;
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.webm', '.mov', '.avi', '.m4v'] as const;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export const GALLERY_CATEGORIES = [
  'All',
  'Worship',
  'Gatherings',
  'Conferences',
  'Fellowship',
  'Youth',
  'Prayer',
] as const;

export const GALLERY_ITEM_CATEGORIES = [
  'Worship',
  'Gatherings',
  'Conferences',
  'Fellowship',
  'Youth',
  'Prayer',
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Sunday Celebration & Praise',
    category: 'Worship',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3562-scaled.jpeg',
    date: 'December 2025',
    location: 'Main Sanctuary',
    description: 'Congregation uplifting their voices in joyful adoration during our Sunday morning service.',
    aspectRatio: 'wide',
  },
  {
    id: 'gal-02',
    title: 'Worship Team In Harmony',
    category: 'Worship',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3553-scaled.jpeg',
    date: 'December 2025',
    location: 'Altar Platform',
    description: 'Anointed choir and musical team leading the house into deep, heartfelt presence of God.',
    aspectRatio: 'tall',
  },
  {
    id: 'gal-03',
    title: 'United in Deep Intercession',
    category: 'Prayer',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3551-scaled.jpeg',
    date: 'December 2025',
    location: 'Main Sanctuary',
    description: 'Believers joined in powerful corporate prayer, standing in faith for families and nations.',
    aspectRatio: 'square',
  },
  {
    id: 'gal-04',
    title: 'Atmosphere of Surrender',
    category: 'Worship',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3549-scaled.jpeg',
    date: 'December 2025',
    location: 'Main Auditorium',
    description: 'Worshippers lifting hands in reverent devotion, encountering the transformative love of Christ.',
    aspectRatio: 'tall',
  },
  {
    id: 'gal-05',
    title: 'Family Fellowship & Warmth',
    category: 'Fellowship',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3531-scaled.jpeg',
    date: 'December 2025',
    location: 'Fellowship Hall',
    description: 'Warm smiles and authentic connection as brothers and sisters share life together.',
    aspectRatio: 'wide',
  },
  {
    id: 'gal-06',
    title: 'Preaching the Word with Power',
    category: 'Gatherings',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg',
    date: 'December 2025',
    location: 'Pulpit',
    description: 'Dynamic biblical preaching opening scriptures and equipping disciples for everyday victory.',
    aspectRatio: 'square',
  },
  {
    id: 'gal-07',
    title: 'Holy Communion of Grace',
    category: 'Gatherings',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3517-scaled.jpeg',
    date: 'December 2025',
    location: 'Sanctuary Table',
    description: 'Remembering the finished work of the Cross in reverence, gratitude, and unity.',
    aspectRatio: 'tall',
  },
  {
    id: 'gal-08',
    title: 'Next Gen Youth on Fire',
    category: 'Youth',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3450-scaled.jpeg',
    date: 'December 2025',
    location: 'Youth Center',
    description: 'Passionate young believers worshiping unashamedly and building lifelong kingdom friendships.',
    aspectRatio: 'wide',
  },
  {
    id: 'gal-09',
    title: 'Annual Ministry Summit',
    category: 'Conferences',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3570-scaled.jpeg',
    date: 'December 2025',
    location: 'Main Auditorium',
    description: 'Key leaders and guest ministers converging to impart vision, wisdom, and spiritual fire.',
    aspectRatio: 'square',
  },
  {
    id: 'gal-10',
    title: 'Sounds of Glory and Majesty',
    category: 'Worship',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3568-scaled.jpeg',
    date: 'December 2025',
    location: 'Sanctuary Stage',
    description: 'A vibrant orchestral and vocal expression giving glory to the King of Kings.',
    aspectRatio: 'tall',
  },
  {
    id: 'gal-11',
    title: 'Hands Lifted High in Faith',
    category: 'Prayer',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3566-scaled.jpeg',
    date: 'December 2025',
    location: 'Auditorium Floor',
    description: 'Touching heaven through heartfelt supplication and expectant faith.',
    aspectRatio: 'wide',
  },
  {
    id: 'gal-12',
    title: 'Faithful Multitudes Gathered',
    category: 'Gatherings',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3561-scaled.jpeg',
    date: 'December 2025',
    location: 'Auditorium',
    description: 'A full auditorium of believers united under one roof to magnify the Lord.',
    aspectRatio: 'square',
  },
  {
    id: 'gal-13',
    title: 'Sunday Worship Glow',
    category: 'Worship',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3559-scaled.jpeg',
    date: 'December 2025',
    location: 'Main Sanctuary',
    description: 'Warm lighting and celestial acoustics filling the room as praise resounds.',
    aspectRatio: 'tall',
  },
  {
    id: 'gal-14',
    title: 'Youth Choir in Harmony',
    category: 'Youth',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3554-scaled.jpeg',
    date: 'December 2025',
    location: 'Stage Wings',
    description: 'Inspiring young voices singing hymns of hope and contemporary anthems of grace.',
    aspectRatio: 'wide',
  },
  {
    id: 'gal-15',
    title: 'String and Rhythm Ministry',
    category: 'Worship',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3552-scaled.jpeg',
    date: 'December 2025',
    location: 'Musicians Section',
    description: 'Skilled instrumentalists offering their talents as a fragrant offering unto God.',
    aspectRatio: 'square',
  },
  {
    id: 'gal-16',
    title: 'Celebration of Joy and Grace',
    category: 'Gatherings',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3548-scaled.jpeg',
    date: 'December 2025',
    location: 'Main Floor',
    description: 'Exuberant praise as the church celebrates answered prayers and kingdom breakthroughs.',
    aspectRatio: 'tall',
  },
  {
    id: 'gal-17',
    title: 'Welcoming New Believers',
    category: 'Fellowship',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3546-scaled.jpeg',
    date: 'December 2025',
    location: 'Welcome Lounge',
    description: 'Greeting newcomers with warmth, personalized care, and loving hospitality.',
    aspectRatio: 'wide',
  },
  {
    id: 'gal-18',
    title: 'Pastoral Blessing & Benediction',
    category: 'Conferences',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3544-scaled.jpeg',
    date: 'December 2025',
    location: 'Altar',
    description: 'Pronouncing the favor, peace, and blessing of God over the congregation.',
    aspectRatio: 'square',
  },
  {
    id: 'gal-19',
    title: 'Next Gen Camp & Praise',
    category: 'Youth',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3540-scaled.jpeg',
    date: 'December 2025',
    location: 'Youth Hall',
    description: 'Engaging, fun, and Spirit-led sessions nurturing children and teens in God’s truth.',
    aspectRatio: 'tall',
  },
  {
    id: 'gal-20',
    title: 'Altar of Healing & Hope',
    category: 'Prayer',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3536-scaled.jpeg',
    date: 'December 2025',
    location: 'Front Altar',
    description: 'Pastors and elders laying on hands, releasing God’s miraculous restoration and peace.',
    aspectRatio: 'wide',
  },
  {
    id: 'gal-21',
    title: 'Evening Revival Awakening',
    category: 'Conferences',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3533-scaled.jpeg',
    date: 'December 2025',
    location: 'Main Auditorium',
    description: 'Special night session charged with passionate prayer, revival, and divine impartation.',
    aspectRatio: 'tall',
  },
  {
    id: 'gal-22',
    title: 'Community In One Accord',
    category: 'Fellowship',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3455-scaled.jpeg',
    date: 'December 2025',
    location: 'Church Courtyard',
    description: 'Intergenerational bonding across generations, reflecting the beauty of the body of Christ.',
    aspectRatio: 'square',
  },
  {
    id: 'gal-23',
    title: 'Dedicated Watchmen Intercession',
    category: 'Prayer',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3454-scaled.jpeg',
    date: 'December 2025',
    location: 'Prayer Chapel',
    description: 'Dedicated prayer intercessors anchoring the ministry in continuous prayer and fasting.',
    aspectRatio: 'wide',
  },
  {
    id: 'gal-24',
    title: 'Kingdom Legacy & Celebration',
    category: 'Gatherings',
    imageUrl: 'https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3447-scaled.jpeg',
    date: 'December 2025',
    location: 'Main Sanctuary',
    description: 'Commemorating milestones of faith and God’s unchanging faithfulness throughout the seasons.',
    aspectRatio: 'square',
  },
];
