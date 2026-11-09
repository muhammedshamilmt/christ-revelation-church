export interface MinistrySection {
  heading?: string;
  paragraphs: string[];
  bullets?: string[];
  image?: string;
  imageAlt?: string;
  videoEmbedUrl?: string;
}

export interface MinistryItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  schedule: string;
  location: string;
  scripture: string;
  description: string;
  pullQuote: string;
  image: string;
  secondaryImage: string;
  tertiaryImage: string;
  galleryImages: string[];
  videoEmbedUrl?: string;
  highlights: string[];
  waysToServe: string[];
  leader: {
    name: string;
    role: string;
    image: string;
    bio: string;
  };
  sections: MinistrySection[];
}

export const MINISTRIES_INTRO = {
  eyebrow: "Christ Revelation Church • Our Ministries",
  heading: "Ministries At Christ Revelation Church",
  lead: "At Christ Revelation Church, our ministries are the heartbeat of our mission—to love God, serve others, and build a Christ-centered community. Each ministry is designed to help individuals grow in faith, discover their purpose, and make an impact through service.",
  vision:
    "Each ministry at Christ Revelation Church is an open door to serve, learn, and grow. Together, we embody the church’s vision: to reveal Christ to the world—one life, one act of love at a time.",
  closingQuote:
    "“When Christ died, He died for all. When He rose, He rose for all. Now, it is our calling to reveal the love of the crucified Christ and the glory of the living Christ to the world.”",
};

export const MINISTRIES: MinistryItem[] = [
  {
    id: "worship-ministry",
    slug: "worship-ministry",
    number: "01",
    title: "Worship Ministry",
    subtitle:
      "Leading the congregation into a sacred encounter with God through music, prayer, and the Word.",
    category: "WORSHIP & CREATIVE ARTS",
    schedule: "Sundays • 8:30 AM – 11:30 AM",
    location: "Main Sanctuary & CRC Auditorium",
    scripture: "Acts 16:25-26 • John 4:24",
    description:
      "The Worship Ministry leads the congregation into a sacred encounter with God. Through music, prayer, and the Word, we create an atmosphere where hearts are stirred and lives are transformed. Musicians, vocalists, and audio-visual teams work together to ensure that every worship service reflects humility, excellence, and reverence. We believe worship is not performance—it is communion with the Creator, inviting His presence to dwell among His people.",
    pullQuote:
      "We believe worship is not performance—it is communion with the Creator, inviting His presence to dwell among His people.",
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/worship-God.jpg",
    secondaryImage:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/Pfeatured1280.webp",
    tertiaryImage:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/360_F.jpg",
    galleryImages: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/worship-God.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/Pfeatured1280.webp",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/360_F.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3345-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pixabay-236321-scaled.jpg",
    ],
    videoEmbedUrl: "https://www.youtube.com/embed/nNyo7lREMq8?feature=oembed",
    highlights: [
      "Spirit-Led Congregational Worship",
      "Choir, Vocalists & Instrumentalists",
      "Audio-Visual & Sanctuary Media Production",
      "Guided Prayer & Prophetic Worship",
    ],
    waysToServe: [
      "Sanctuary Choir & Vocal Team",
      "Worship Band & Instrumentalists",
      "Sound Engineering & Audio Mixing",
      "Projection, Lighting & Livestream Media",
    ],
    leader: {
      name: "Pastor Manoj Nair & Worship Team",
      role: "Worship & Creative Ministry",
      image:
        "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
      bio: "Leading Christ Revelation Church into authentic, Spirit-filled worship where hearts are stirred, chains are broken, and lives are transformed in God's presence.",
    },
    sections: [
      {
        heading: "Communion With the Creator",
        paragraphs: [
          "The Worship Ministry leads the congregation into a sacred encounter with God. Through music, prayer, and the Word, we create an atmosphere where hearts are stirred and lives are transformed.",
          "Musicians, vocalists, and audio-visual teams work together to ensure that every worship service reflects humility, excellence, and reverence. We believe worship is not performance—it is communion with the Creator, inviting His presence to dwell among His people.",
        ],
        image:
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/Pfeatured1280.webp",
        imageAlt: "Worship Ministry at Christ Revelation Church",
      },
      {
        heading: "Worship Opens Doors",
        paragraphs: [
          "Worship is more than the songs we sing or the words we speak—it is the key that opens doors into the very presence of God. When we enter into genuine, heartfelt worship, we step through a spiritual doorway that leads us from the ordinary into the extraordinary, from struggle into strength, from fear into faith, and from chaos into peace.",
          "In the Bible, worship consistently unlocks divine encounters. When Paul and Silas sang hymns in a prison cell, the doors literally swung open and chains fell off (Acts 16:25-26). Their worship didn’t just invite God’s presence—it shifted the atmosphere. That same spiritual principle applies today: worship opens doors that no man can shut.",
        ],
        videoEmbedUrl:
          "https://www.youtube.com/embed/nNyo7lREMq8?feature=oembed",
      },
      {
        heading: "Entering the Throne Room Together",
        paragraphs: [
          "Every time we choose to praise instead of panic, heaven responds. Every song lifted in faith breaks barriers in the spirit. Through worship, you’re not just entering a church building—you’re entering the throne room of God. And where His presence dwells, blessings overflow, healing is released, and freedom is found.",
        ],
        bullets: [
          "Vocalists & Sanctuary Choir leading congregational praise in humility and truth.",
          "Musicians & Instrumentalists cultivating a reverent, Spirit-led atmosphere.",
          "Audio-Visual & Broadcast Teams ensuring excellence across every service.",
          "United altar worship that invites healing, freedom, and spiritual breakthrough.",
        ],
        image:
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/360_F.jpg",
        imageAlt: "Congregational praise and worship",
      },
    ],
  },
  {
    id: "outreach-ministry",
    slug: "outreach-ministry",
    number: "02",
    title: "Outreach Ministry",
    subtitle:
      "Passionately embodying the Great Commission by extending the love, hope, and message of Jesus Christ beyond our church walls.",
    category: "EVANGELISM & COMPASSION",
    schedule: "Weekly Outreach & Community Missions",
    location: "Local Community & Global Missions",
    scripture: "Matthew 28:19-20 • Mark 16:15",
    description:
      "The Outreach Ministry at Christ Revelation Church passionately embodies the Great Commission by extending the love, hope, and message of Jesus Christ beyond our church walls. This ministry is dedicated to serving our local community and the wider world through a diverse range of compassionate initiatives and evangelistic efforts.",
    pullQuote:
      "When Christ died, He died for all. When He rose, He rose for all. Now, it is our calling to reveal the love of the crucified Christ and the glory of the living Christ to the world.",
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/medium-shot-smiley-family-walking-church-scaled.jpg",
    secondaryImage:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pavel-danilyuk-8814997-scaled.jpg",
    tertiaryImage:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/360_F.jpg",
    galleryImages: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/medium-shot-smiley-family-walking-church-scaled.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pavel-danilyuk-8814997-scaled.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/360_F.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3361-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3554-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/Pfeatured1280.webp",
    ],
    highlights: [
      "Gospel Evangelism & Street Missions",
      "Family Bible Studies & Discipleship",
      "Addiction & Alcoholism Rehabilitation Support",
      "Compassionate Community Care",
    ],
    waysToServe: [
      "Community Evangelism & Gospel Sharing",
      "Home & Family Bible Study Facilitators",
      "Addiction Recovery & Counseling Support",
      "Hospitality, Food & Compassion Drives",
    ],
    leader: {
      name: "Pastor Manoj Nair & Shiny Nair",
      role: "Outreach & Missions Leadership",
      image:
        "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3361-scaled.jpeg",
      bio: "Committed to advancing the Christian faith in accordance with biblical principles, bringing hope, rehabilitation support, and healing to our local community and around the world.",
    },
    sections: [
      {
        heading: "Embodying the Great Commission",
        paragraphs: [
          "The Outreach Ministry at Christ Revelation Church passionately embodies the Great Commission by extending the love, hope, and message of Jesus Christ beyond our church walls. This ministry is dedicated to serving our local community and the wider world through a diverse range of compassionate initiatives and evangelistic efforts.",
          "With a heartfelt focus on compassion and an awareness of the urgency of our mission, we live in anticipation of Jesus’s return.",
        ],
        image:
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pavel-danilyuk-8814997-scaled.jpg",
        imageAlt: "Outreach Ministry serving the community",
      },
      {
        heading: "Family Life, Bible Studies & Rehabilitation",
        paragraphs: [
          "In addition to our commitment to evangelism and outreach, we help and encourage families to understand the importance of family life and leading them to Christ by giving Bible studies.",
          "We are also engaged in rehabilitation for individuals grappling with drug addiction and alcoholism by offering them the help they need to get their life back on track and understand the love of God. We believe in the transformative power of the Christian gospel, fostering spiritual growth and offering hope to those facing life’s challenges.",
        ],
        bullets: [
          "Bringing sinners to Christ through compassionate gospel witness.",
          "Extending a guiding hand to those battling addiction and alcoholism.",
          "Encouraging families and leading households to Christ through Bible studies.",
          "Preparing believers to fulfill their divine purpose in readiness for the return of Jesus.",
        ],
        image:
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3361-scaled.jpeg",
        imageAlt: "Christ Revelation Church Outreach Missions",
      },
    ],
  },
  {
    id: "prayer-ministry",
    slug: "prayer-ministry",
    number: "03",
    title: "Prayer Ministry",
    subtitle:
      "The engine that fuels every part of our church—standing in the gap for individuals, families, and nations.",
    category: "INTERCESSION & BREAKTHROUGH",
    schedule: "Prayer Time • 6:30 PM – 8:30 PM",
    location: "Sanctuary Prayer Room & Online",
    scripture: "James 5:16 • Luke 6:12 • Matthew 26:39",
    description:
      "The Prayer Ministry is the engine that fuels every part of our church. The Prayer Ministry intercedes for individuals, families, and nations, seeking God’s wisdom, healing, and direction. This dedicated team organizes prayer meetings, overnight vigils, and days of fasting, standing in the gap for breakthroughs. We believe that when the church prays, heaven moves—and lives are restored.",
    pullQuote:
      "“The fervent prayer of a righteous person avails much” (James 5:16). When the church prays, heaven moves—and lives are restored.",
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/Pfeatured1280.webp",
    secondaryImage:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/worship-God.jpg",
    tertiaryImage:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/360_F.jpg",
    galleryImages: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/Pfeatured1280.webp",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/worship-God.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/360_F.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-ranit-das-2154541727-33572731-scaled.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pavel-danilyuk-8814997-scaled.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3340-scaled.jpeg",
    ],
    highlights: [
      "Evening Prayer Gatherings (6:30 – 8:30 PM)",
      "Overnight Prayer Vigils & Corporate Fasting",
      "Personal Healing & Deliverance Intercession",
      "Confidential Prayer Request Support",
    ],
    waysToServe: [
      "Intercessory Prayer Team",
      "Overnight Vigil & Fasting Coordinators",
      "Sunday Altar Prayer & Healing Team",
      "Confidential Prayer Request Follow-Up",
    ],
    leader: {
      name: "Pastor Manoj Nair & Intercessory Team",
      role: "Prayer & Intercession Ministry",
      image:
        "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3549-scaled.jpeg",
      bio: "Standing in the gap through united prayer, fasting, and intercession so every person and family experiences God's wisdom, healing, and breakthrough.",
    },
    sections: [
      {
        heading: "The Engine That Fuels Our Church",
        paragraphs: [
          "The Prayer Ministry is the engine that fuels every part of our church. The Prayer Ministry intercedes for individuals, families, and nations, seeking God’s wisdom, healing, and direction.",
          "This dedicated team organizes prayer meetings, overnight vigils, and days of fasting, standing in the gap for breakthroughs. We believe that when the church prays, heaven moves—and lives are restored.",
        ],
        image:
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/worship-God.jpg",
        imageAlt: "Prayer Ministry at Christ Revelation Church",
      },
      {
        heading: "Prayer Is the Master Key",
        paragraphs: [
          "At Christ Revelation Church, we believe in the power of prayer and the miracle it brings. Prayer is the sacred channel through which we connect with God, seek His guidance, experience His peace, and receive answers beyond our understanding. No prayer is too small or too big—God hears every heartfelt plea.",
          "Prayer is not just a spiritual practice—it is the master key that unlocks heaven’s doors and brings God’s power into our daily lives. Through prayer, we don’t merely speak to God; we invite Him into our circumstances, allowing His wisdom, peace, and provision to transform every situation.",
        ],
        bullets: [
          "The door of peace when anxiety tries to overwhelm you.",
          "The door of strength when you feel weak and weary.",
          "The door of wisdom when you face decisions too big to handle alone.",
          "The door of deliverance when life’s battles seem impossible to win.",
          "The door of God’s presence, where joy and restoration flow freely.",
        ],
        image:
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-ranit-das-2154541727-33572731-scaled.jpg",
        imageAlt: "United prayer and intercession",
      },
    ],
  },
  {
    id: "kids-ministry",
    slug: "kids-ministry",
    number: "04",
    title: "Kids Ministry",
    subtitle:
      "Building a foundation of faith in the hearts of our youngest members through joyful Bible stories, music, and discipleship.",
    category: "CHILDREN & NEXT GENERATION",
    schedule: "Sundays • 8:30 AM – 11:30 AM",
    location: "CRC Kids Classrooms & Fellowship Hall",
    scripture: "Proverbs 22:6 • Matthew 19:14",
    description:
      "Our Kids Ministry builds a foundation of faith in the hearts of our youngest members. With engaging lessons, music, crafts, and Bible stories, children learn that Jesus loves them deeply and has a plan for their lives. We partner with parents to raise disciples from an early age, emphasizing values such as kindness, honesty, and prayer. Every session aims to make learning about God joyful and memorable.",
    pullQuote:
      "With engaging lessons, music, crafts, and Bible stories, children learn that Jesus loves them deeply and has a plan for their lives.",
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-bintimalu-2927676-scaled.jpg",
    secondaryImage:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-cottonbro-9577192-scaled.jpg",
    tertiaryImage:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/worship-God.jpg",
    galleryImages: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-bintimalu-2927676-scaled.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-cottonbro-9577192-scaled.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/worship-God.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3562-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3549-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3209-scaled.jpeg",
    ],
    highlights: [
      "Interactive Bible Stories & Scripture Memory",
      "Joyful Kids Worship, Music & Carols",
      "Creative Crafts & Faith Activities",
      "Christ-Centered Character & Family Partnership",
    ],
    waysToServe: [
      "Sunday School Bible Teachers",
      "Kids Worship & Music Leaders",
      "Creative Crafts & Activity Helpers",
      "Family Check-In & Safeguarding Team",
    ],
    leader: {
      name: "Shiny Nair & CRC Kids Team",
      role: "Children & Family Ministry",
      image:
        "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3531-scaled.jpeg",
      bio: "Partnering with parents to nurture children in the love of Jesus, raising a generation rooted in kindness, honesty, prayer, and God's Word.",
    },
    sections: [
      {
        heading: "Building a Foundation of Faith",
        paragraphs: [
          "Our Kids Ministry builds a foundation of faith in the hearts of our youngest members. With engaging lessons, music, crafts, and Bible stories, children learn that Jesus loves them deeply and has a plan for their lives.",
          "We partner with parents to raise disciples from an early age, emphasizing values such as kindness, honesty, and prayer. Every session aims to make learning about God joyful and memorable.",
        ],
        image:
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-cottonbro-9577192-scaled.jpg",
        imageAlt: "Kids Ministry Bible stories and learning",
      },
      {
        heading: "Partnering With Parents to Raise Disciples",
        paragraphs: [
          "At Christ Revelation Church, we believe that church is a family bound by love, strengthened by faith, and sustained by God’s grace. We help and encourage families to understand the importance of family life and leading their children to Christ through age-appropriate Bible teaching and joyful fellowship.",
        ],
        bullets: [
          "Bible Stories & Lessons tailored to help children discover God's love and purpose.",
          "Joyful Music & Worship where kids praise God with enthusiasm and confidence.",
          "Hands-On Crafts & Activities that reinforce biblical truths in memorable ways.",
          "Character Formation rooted in kindness, honesty, prayer, and love for others.",
        ],
        image:
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-bintimalu-2927676-scaled.jpg",
        imageAlt: "Children growing in faith at Christ Revelation Church",
      },
    ],
  },
];

const MINISTRY_ALIASES: Record<string, string> = {
  "01": "worship-ministry",
  "1": "worship-ministry",
  worship: "worship-ministry",
  "02": "outreach-ministry",
  "2": "outreach-ministry",
  outreach: "outreach-ministry",
  "03": "prayer-ministry",
  "3": "prayer-ministry",
  prayer: "prayer-ministry",
  "04": "kids-ministry",
  "4": "kids-ministry",
  kids: "kids-ministry",
};

export function findMinistryById(idOrSlug: string): MinistryItem | undefined {
  const normalized = decodeURIComponent(idOrSlug).trim().toLowerCase();
  const target = MINISTRY_ALIASES[normalized] || normalized;
  return MINISTRIES.find(
    (m) => m.id.toLowerCase() === target || m.slug.toLowerCase() === target
  );
}

