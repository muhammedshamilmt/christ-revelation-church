export interface SermonSection {
  heading?: string;
  text: string;
  bullets?: string[];
  image?: string;
}

export interface Sermon {
  id: string;
  numericId: number;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string;
  category: "Worship" | "Prayer" | "Faith" | "Grace";
  tags: string[];
  scripture: string;
  readTime: string;
  duration: string;
  rating: number;
  image: string;
  secondaryImage?: string;
  videoEmbedUrl?: string;
  videoTitle?: string;
  pullQuote: string;
  speaker: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  content: SermonSection[];
}

export const SERMONS: Sermon[] = [
  {
    id: "worship-opens-doors",
    numericId: 1,
    slug: "worship-opens-doors",
    title: "Worship Opens Doors",
    subtitle: "Stepping through the spiritual doorway from struggle into strength, fear into faith, and chaos into peace.",
    excerpt:
      "Worship is more than the songs we sing or the words we speak—it is the key that opens doors into the very presence of God.",
    date: "August 28, 2025",
    category: "Worship",
    tags: ["WORSHIP", "FAITH", "BREAKTHROUGH"],
    scripture: "Acts 16:25-26",
    readTime: "4 MIN READ",
    duration: "28 MIN WATCH",
    rating: 5,
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pixabay-236321-scaled.jpg",
    videoEmbedUrl: "https://www.youtube.com/embed/nNyo7lREMq8?feature=oembed",
    videoTitle: "Guided Prayer with Worship",
    pullQuote:
      "Don’t wait for the door to open to start worshiping—begin now. The door of blessing, favor, and breakthrough is opened to those who worship in spirit and in truth.",
    speaker: {
      name: "Pastor Manoj Nair",
      role: "Senior Pastor",
      avatar:
        "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
      bio: "Driven by a profound mission to bring sinners to Christ, extend a guiding hand to those in need, and prepare believers for their divine purpose.",
    },
    content: [
      {
        heading: "The Key Into God’s Presence",
        text: "Worship is more than the songs we sing or the words we speak—it is the key that opens doors into the very presence of God. When we enter into genuine, heartfelt worship, we step through a spiritual doorway that leads us from the ordinary into the extraordinary, from struggle into strength, from fear into faith, and from chaos into peace.",
      },
      {
        heading: "Shifting the Atmosphere",
        text: "In the Bible, worship consistently unlocks divine encounters. When Paul and Silas sang hymns in a prison cell, the doors literally swung open and chains fell off (Acts 16:25-26). Their worship didn’t just invite God’s presence—it shifted the atmosphere. That same spiritual principle applies today: worship opens doors that no man can shut. It opens the door of heaven to pour grace over hardship, the door of joy in times of sorrow, and the door of revelation when we need direction.",
      },
      {
        heading: "Entering the Throne Room of God",
        text: "Worship transforms locked situations. Every time you choose to praise instead of panic, heaven responds. Every song lifted in faith breaks barriers in the spirit. Through worship, you’re not just entering a church building—you’re entering the throne room of God. And where His presence dwells, blessings overflow, healing is released, and freedom is found.",
      },
      {
        heading: "Worship in Your Waiting",
        text: "Don’t wait for the door to open to start worshiping—begin now. Worship in your waiting, and watch how God turns your waiting room into a birthing room for miracles. When you lift your hands, you’re not just reaching up—you’re unlocking heaven. The door of blessing, favor, and breakthrough is opened to those who worship in spirit and in truth.",
      },
    ],
  },
  {
    id: "prayer-is-the-key",
    numericId: 2,
    slug: "prayer-is-the-key",
    title: "Prayer is the Key",
    subtitle: "The master key that unlocks heaven’s doors and brings God’s transformative power into our everyday lives.",
    excerpt:
      "Prayer is not just a spiritual practice—it is the master key that unlocks heaven’s doors and brings God’s power into our lives.",
    date: "August 28, 2025",
    category: "Prayer",
    tags: ["PRAYER", "FAITH", "GRACE"],
    scripture: "Luke 6:12 • Matthew 26:39 • James 5:16 • Acts 16:25-26",
    readTime: "5 MIN READ",
    duration: "32 MIN LISTEN",
    rating: 5,
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pavel-danilyuk-8814997-scaled.jpg",
    secondaryImage:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-ranit-das-2154541727-33572731-scaled.jpg",
    pullQuote:
      "The effective, fervent prayer of a righteous man avails much (James 5:16). Prayer changes circumstances, yes, but most importantly, it changes us.",
    speaker: {
      name: "Pastor Manoj Nair",
      role: "Senior Pastor",
      avatar:
        "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
      bio: "Driven by a profound mission to bring sinners to Christ, extend a guiding hand to those in need, and prepare believers for their divine purpose.",
    },
    content: [
      {
        heading: "The Master Key That Unlocks Heaven’s Doors",
        text: "Prayer is not just a spiritual practice—it is the master key that unlocks heaven’s doors and brings God’s power into our lives. It is the divine connection between humanity and our Creator—the sacred line where we speak, listen, and align our hearts with His perfect will. Through prayer, the ordinary becomes extraordinary, and what seems impossible becomes possible through faith in God.",
      },
      {
        heading: "The Foundation of a Victorious Life",
        text: "When Jesus walked the earth, He demonstrated that prayer was essential, not optional. Before He healed the sick, called the disciples, or faced the cross, He prayed. From the mountaintops to the garden of Gethsemane, Jesus showed us that prayer is not a backup plan—it is the foundation of a victorious life. The Son of God, in His moments of strength and struggle alike, sought His Father through intimate, passionate prayer (Luke 6:12; Matthew 26:39).",
      },
      {
        heading: "Prayer Is the Key That Opens Doors",
        text: "Through earnest communion with the Father, prayer unlocks the spiritual doors we need most:",
        bullets: [
          "The door of peace when anxiety overwhelms.",
          "The door of strength when weakness takes hold.",
          "The door of wisdom when confusion clouds our minds.",
          "The door of deliverance when we face bondage or fear.",
          "The door of God’s presence when we feel alone or forgotten.",
        ],
      },
      {
        heading: "Communion That Transforms Us",
        text: "The Bible reminds us that “The effective, fervent prayer of a righteous man avails much” (James 5:16). Prayer moves the hand of God—not because He is bound by our words, but because He delights in communion with His children. Prayer changes circumstances, yes, but most importantly, it changes us. It molds our will to match His, filling us with peace, power, and purpose.",
        image:
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-ranit-das-2154541727-33572731-scaled.jpg",
      },
      {
        heading: "Sincerity Over Fancy Words",
        text: "You don’t need fancy words or perfect timing. The key is sincerity. God hears even the whisper of a heart that truly seeks Him. When we pray according to His Word, mountains move, doors open, and breakthroughs manifest. Every answered prayer is evidence that heaven responds to humble faith.\n\nSo, keep your spiritual keys close—pray when the way seems closed, when the load feels heavy, when the path is unclear. The same God who opened prison doors for Paul and Silas can open every locked door in your life (Acts 16:25-26).",
      },
    ],
  },
  {
    id: "christmas-music-festival",
    numericId: 3,
    slug: "christmas-music-festival",
    title: "Christmas Music Festival",
    subtitle: "Rejoicing in God’s gift of hope through uplifting worship, carols, and the celebration of our Savior’s birth.",
    excerpt:
      "Celebrate the joy and wonder of the Christmas season with Christ Revelation Church at our Christmas Music Festival! Join us for an evening filled with uplifting worship, beautiful carols, and inspiring musical performances.",
    date: "December 25, 2025",
    category: "Grace",
    tags: ["WORSHIP", "CHRISTMAS", "GRACE"],
    scripture: "Luke 2:10-14",
    readTime: "3 MIN READ",
    duration: "45 MIN SPECIAL",
    rating: 5,
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pixabay-236310-scaled.jpg",
    secondaryImage:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3200-scaled.jpeg",
    pullQuote:
      "Capture the true spirit of Christmas—the celebration of the birth of our Lord and Savior, Jesus Christ, and rejoice in God’s gift of hope.",
    speaker: {
      name: "Pastor Manoj Nair",
      role: "Senior Pastor",
      avatar:
        "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
      bio: "Driven by a profound mission to bring sinners to Christ, extend a guiding hand to those in need, and prepare believers for their divine purpose.",
    },
    content: [
      {
        heading: "Celebrating the Birth of Our Lord and Savior",
        text: "Celebrate the joy and wonder of the Christmas season with Christ Revelation Church at our Christmas Music Festival! Join us for an evening filled with uplifting worship, beautiful carols, and inspiring musical performances that capture the true spirit of Christmas—the celebration of the birth of our Lord and Savior, Jesus Christ.",
      },
      {
        heading: "Hymns of Hope and Contemporary Worship",
        text: "Our festival features a wonderful lineup of choirs, soloists, and musicians, blending traditional Christmas hymns with contemporary worship songs. It’s a perfect occasion for families and friends to come together, rejoice in God’s gift of hope, and experience the joyous sounds that mark this holy season.",
        image:
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3200-scaled.jpeg",
      },
      {
        heading: "Renewed Faith, Peace, and Thanksgiving",
        text: "Whether you are a long-time member of our church or visiting for the first time, this gathering promises to warm your heart, renew your faith, and fill your spirit with peace and thanksgiving. Enjoy the festive atmosphere, delightful refreshments, and opportunities to connect with our church family.",
      },
    ],
  },
];

export function findSermonById(idOrSlug: string): Sermon | undefined {
  const clean = decodeURIComponent(idOrSlug).trim().toLowerCase();
  return (
    SERMONS.find((s) => s.id.toLowerCase() === clean) ||
    SERMONS.find((s) => s.slug.toLowerCase() === clean) ||
    SERMONS.find((s) => String(s.numericId) === clean) ||
    SERMONS.find((s) => `sermon-${s.numericId}` === clean)
  );
}

