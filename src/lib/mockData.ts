export const INITIAL_CAMPAIGNS = [
  {
    id: "camp-1",
    title: "Sanctuary Sound & Media Upgrade",
    org: "Christ Revelation Church",
    raised: 28500,
    goal: 35000,
    daysLeft: 14,
    status: "Active" as const,
    image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3553-scaled.jpeg",
    description: [
      "Upgrading our sanctuary audio-visual system to deliver crystal-clear acoustics and high-definition livestreaming to thousands of believers around the world.",
      "This initiative will replace 12-year-old mixing consoles, install low-latency stage monitors, and add professional robotic PTZ cameras for global broadcast."
    ],
    updates: [
      {
        date: "2026-03-10",
        title: "Digital Mixing Console Arrived",
        content: "The Allen & Heath SQ-7 console and Stage Box have been delivered and preliminary acoustic tests passed with flying colors!"
      },
      {
        date: "2026-03-01",
        title: "75% Milestone Achieved",
        content: "Thank you congregation for your incredible generosity in funding the stage lighting truss."
      }
    ],
    createdAt: "2026-01-15T10:00:00.000Z"
  },
  {
    id: "camp-2",
    title: "Community Food Pantry & Hot Meals Drive",
    org: "CRC Outreach Ministry",
    raised: 14200,
    goal: 15000,
    daysLeft: 6,
    status: "Active" as const,
    image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/Pfeatured1280.webp",
    description: [
      "Providing weekly nutritious food packages and fresh produce to over 400 vulnerable families and pensioners in our local area.",
      "Every £25 sponsors a family grocery pack filled with staples, grains, baby formula, and personal hygiene essentials."
    ],
    updates: [
      {
        date: "2026-03-15",
        title: "500 Boxes Distributed This Weekend",
        content: "Over 40 church volunteers helped pack and distribute fresh produce from local farmers."
      }
    ],
    createdAt: "2026-02-01T08:30:00.000Z"
  },
  {
    id: "camp-3",
    title: "Annual Youth Camp & Leadership Retreat",
    org: "Ignite Youth Ministry",
    raised: 8900,
    goal: 12000,
    daysLeft: 22,
    status: "Active" as const,
    image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3450-scaled.jpeg",
    description: [
      "A 4-day transformational mountain retreat for 150 youth, featuring biblical teaching, worship, team challenges, and mentorship workshops.",
      "Sponsorship funds ensure that no student is left behind due to financial circumstances."
    ],
    updates: [],
    createdAt: "2026-02-18T14:15:00.000Z"
  },
  {
    id: "camp-4",
    title: "New Church Van & Transportation Fund",
    org: "Christ Revelation Church",
    raised: 42000,
    goal: 42000,
    daysLeft: 0,
    status: "Completed" as const,
    image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3361-scaled.jpeg",
    description: [
      "Acquiring a 16-passenger accessible minibus to assist elderly church members, Sunday school children, and outreach teams.",
      "Fully funded through special anniversary pledges and thanksgiving offerings!"
    ],
    updates: [
      {
        date: "2026-01-20",
        title: "Vehicle Ordered & Insured",
        content: "The Ford Transit 16-seater is officially registered and dedicated during Sunday Service."
      }
    ],
    createdAt: "2025-11-10T12:00:00.000Z"
  },
  {
    id: "camp-5",
    title: "Global Mission Outreach & Clean Water Project",
    org: "CRC World Missions",
    raised: 3500,
    goal: 20000,
    daysLeft: 45,
    status: "Draft" as const,
    image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pixabay-62285-scaled.jpg",
    description: [
      "Drilling two solar-powered clean water boreholes and providing medical aid kits in partner communities in East Africa.",
      "Collaborating with local pastors to provide long-term spiritual and community development."
    ],
    updates: [],
    createdAt: "2026-03-01T09:00:00.000Z"
  }
];

export const INITIAL_EVENTS = [
  {
    id: "revelation-encounter-2026",
    title: "Revelation Encounter – 2026",
    subtitle: "Three unforgettable days of prophetic worship, transformative encounters in the Holy Spirit, and Kingdom ministry.",
    type: "CONFERENCE",
    date: "July 17 - 19, 2026",
    time: "09:00 AM - 09:00 PM",
    location: "CRC Auditorium, United Kingdom",
    capacity: "Open Registration",
    accessibility: "Wheelchair accessible, Family friendly, Pastoral prayer rooms",
    price: "Free Registration",
    status: "Open" as const,
    images: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2026/06/Revelation-Encounter.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3345-scaled.jpeg"
    ],
    description: [
      "Join Christ Revelation Church for Revelation Encounter – 2026 across July 17, July 18, and July 19, 2026. Guided by the Holy Spirit, our Pentecostal church envisions a gathering where believers and ministers passionately pursue God's presence, experience transformative encounters, and radiate His love to the world.",
      "Open to all believers, families, and those serving in Christian ministry (Pastors, Reverends, and Church Leadership). Register your attendance for one or all three days of the conference."
    ],
    perfectFor: ["Believers & Families", "Pastors & Christian Ministers", "Worshippers & Intercessors", "Youth & Young Adults"],
    agenda: [
      { time: "Day 1 • July 17, 2026", title: "Opening Night of Worship & Revelation", desc: "Registration, congregational praise, and opening prophetic message." },
      { time: "Day 2 • July 18, 2026", title: "Ministers & Believers Empowerment Sessions", desc: "Morning and afternoon teachings, leadership impartation, and healing prayer." },
      { time: "Day 3 • July 19, 2026", title: "Commissioning & Miracle Encounter Service", desc: "United Sunday celebration, thanksgiving worship, and altar ministry." }
    ],
    highlights: ["3 Days of Live Worship & Word", "Ministry & Leadership Impartation", "Healing & Deliverance Prayer", "Free Group & Family Registration"],
    host: {
      name: "Pastor Manoj Nair & Shiny Nair",
      role: "Christ Revelation Church",
      image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg"
    },
    views: 412,
    createdAt: "2026-06-01T09:00:00.000Z"
  },
  {
    id: "christmas-music-festival",
    title: "Christmas Music Festival",
    subtitle: "Celebrate the birth of Jesus Christ with an uplifting afternoon and evening of worship, carols, and festive joy.",
    type: "CONFERENCE",
    date: "December 25, 2025",
    time: "3:00 PM - 7:00 PM",
    location: "CRC Auditorium",
    capacity: "Open to All",
    accessibility: "Wheelchair accessible, Family friendly",
    price: "Free",
    status: "Upcoming" as const,
    images: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3200-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pixabay-236310-scaled.jpg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3549-scaled.jpeg"
    ],
    description: [
      "Join Christ Revelation Church at the CRC Auditorium on December 25, 2025 from 3:00 pm to 7:00 pm for our annual Christmas Music Festival.",
      "Experience anointed live music, Christmas carols, congregational praise, and a joyful celebration of the birth of our Savior Jesus Christ with the entire church family."
    ],
    perfectFor: ["Families", "All Ages", "Music & Carol Lovers", "Community Guests"],
    agenda: [
      { time: "03:00 PM", title: "Welcome & Christmas Carols", desc: "Opening praise and classic Christmas hymns." },
      { time: "04:30 PM", title: "Special Choir & Worship Presentations", desc: "Performances by the CRC Worship Ministry and Kids Ministry." },
      { time: "06:00 PM", title: "Christmas Message & Candlelight Prayer", desc: "Christmas blessing and fellowship." }
    ],
    highlights: ["Live Christmas Worship & Carols", "Kids & Choir Presentations", "Family Fellowship", "Free Admission"],
    host: {
      name: "Pastor Manoj Nair",
      role: "Senior Pastor",
      image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg"
    },
    views: 540,
    createdAt: "2025-12-01T09:00:00.000Z"
  },
  {
    id: "christmas-carols",
    title: "Christmas Carols",
    subtitle: "An evening of joyful Christmas carols, candlelit worship, and fellowship celebrating the birth of Jesus Christ.",
    type: "GENERAL",
    date: "December 20, 2025",
    time: "4:00 PM - 8:00 PM",
    location: "CRC Auditorium",
    capacity: "Open to All",
    accessibility: "Wheelchair accessible, Family & Kids friendly",
    price: "Free",
    status: "Upcoming" as const,
    images: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3549-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3322-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3562-scaled.jpeg"
    ],
    description: [
      "Celebrate the season of hope and joy with the Christ Revelation Church family at our annual Christmas Carols service on December 20, 2025 from 4:00 pm to 8:00 pm.",
      "Enjoy traditional and contemporary carols led by our Worship & Kids Ministries, Scripture readings, and warm festive fellowship for the whole community."
    ],
    perfectFor: ["Families & Children", "Choir & Carol Lovers", "Community Guests", "All Ages"],
    agenda: [
      { time: "04:00 PM", title: "Welcome & Festive Fellowship", desc: "Warm refreshments and Christmas greetings." },
      { time: "04:30 PM", title: "Candlelight Carols & Kids Presentation", desc: "Traditional carols and nativity songs by the Worship and Kids Ministries." },
      { time: "06:30 PM", title: "Christmas Gospel Message & Prayer", desc: "A message of hope, peace, and salvation in Jesus Christ." }
    ],
    highlights: ["Traditional & Contemporary Carols", "Kids Ministry Presentation", "Christmas Message of Hope", "Festive Community Fellowship"],
    host: {
      name: "Pastor Manoj Nair",
      role: "Senior Pastor",
      image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg"
    },
    views: 295,
    createdAt: "2025-12-01T10:00:00.000Z"
  },
  {
    id: "annual-youth-conference-2026",
    title: "Annual Youth Conference 2026",
    subtitle: "Join thousands of young believers for five unforgettable days of worship, teachings, and community building.",
    type: "CONFERENCE",
    date: "May 30 - Jun 3, 2026",
    time: "09:00 AM - 09:00 PM",
    location: "Main Auditorium",
    capacity: "800 Attendees",
    accessibility: "Wheelchair accessible, Sign language interpreter, Quiet prayer rooms",
    price: "Free Registration",
    status: "Open" as const,
    images: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2026/06/Revelation-Encounter.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3450-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3540-scaled.jpeg"
    ],
    description: [
      "Join thousands of young believers for five unforgettable days celebrating faith, culture, and community at the heart of our vibrant congregation.",
      "Experience dynamic keynote sessions, breakout leadership workshops, creative arts showcases, and late-night prophetic worship designed to ignite the next generation."
    ],
    perfectFor: ["Youth & Young Adults (13–30)", "Youth Pastors & Mentors", "University Students", "Worship Teams"],
    agenda: [
      { time: "09:00 AM", title: "Doors Open & Welcome Registration", desc: "Check-in, welcome merch pack pickup, and fellowship coffee in the main courtyard." },
      { time: "10:30 AM", title: "Morning Glory Worship & Keynote", desc: "Opening praise with CRC Youth Collective followed by Pastor David Vance." },
      { time: "02:00 PM", title: "Breakout Labs & Leadership Tracks", desc: "Interactive workshops on purpose, creative ministry, evangelism, and mental resilience." },
      { time: "07:00 PM", title: "Encounter Night & Altar Call", desc: "An extended evening of live worship, testimonies, and personal prayer ministry." }
    ],
    highlights: ["5 Days of Live Worship", "Breakout Leadership Labs", "Complimentary Lunch & Refreshments", "Youth Creative Showcase"],
    host: {
      name: "Sarah Jenkins",
      role: "Youth Director",
      image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3531-scaled.jpeg"
    },
    views: 940,
    createdAt: "2026-02-10T09:00:00.000Z"
  },
  {
    id: "community-outreach-drive",
    title: "Community Outreach Drive",
    subtitle: "A day dedicated to serving our local community with food distribution, free medical checkups, and prayers.",
    type: "COMMUNITY OUTREACH",
    date: "June 15, 2026",
    time: "09:30 AM - 04:00 PM",
    location: "Downtown Plaza",
    capacity: "350 Volunteers & Guests",
    accessibility: "Outdoor step-free access, Mobile medical vans, Family friendly",
    price: "Free",
    status: "Open" as const,
    images: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/Pfeatured1280.webp",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3361-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/360_F.jpg"
    ],
    description: [
      "A day dedicated to serving our local community with fresh grocery distribution, free health and wellness screenings, hot meals, and compassionate prayer support.",
      "Whether you are coming to receive support or volunteering alongside our outreach teams, everyone is welcome at Downtown Plaza."
    ],
    perfectFor: ["Local Families", "Community Volunteers", "Medical Professionals", "Outreach Teams"],
    agenda: [
      { time: "09:30 AM", title: "Volunteer Briefing & Setup", desc: "Team prayer, station assignments, and food parcel preparation." },
      { time: "10:30 AM", title: "Food Pantry & Hot Meal Service", desc: "Distribution of fresh produce boxes and hot lunches for families." },
      { time: "12:00 PM", title: "Free Health & Wellness Clinic", desc: "Blood pressure checks, general consultations, and family care packs." },
      { time: "02:30 PM", title: "Community Praise & Prayer Tent", desc: "Uplifting acoustic music, encouragement, and one-on-one prayer." }
    ],
    highlights: ["500+ Family Grocery Hampers", "Free Medical Checkups", "Kids Clothing & Toy Corner", "Prayer & Counseling Tent"],
    host: {
      name: "Emily Davis",
      role: "Community Outreach Coordinator",
      image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3546-scaled.jpeg"
    },
    views: 520,
    createdAt: "2026-02-14T10:00:00.000Z"
  },
  {
    id: "worship-night-encounter",
    title: "Worship Night: Encounter",
    subtitle: "An extended evening of prophetic worship and prayer. Come experience a transformative encounter with the Holy Spirit.",
    type: "CONFERENCE",
    date: "July 02, 2026",
    time: "07:00 PM - 10:30 PM",
    location: "Worship Center",
    capacity: "450 Seats",
    accessibility: "Hearing loop installed, Ground level entry, Wheelchair seating",
    price: "Free Admission",
    status: "Upcoming" as const,
    images: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3549-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3322-scaled.jpeg"
    ],
    description: [
      "An extended evening of prophetic worship and prayer. Come experience a transformative encounter with the Holy Spirit in an atmosphere of unhurried praise.",
      "Bring friends, family, and anyone seeking physical healing, spiritual renewal, or deep peace in God's presence."
    ],
    perfectFor: ["Worshippers", "Prayer Intercessors", "Seekers", "Anyone in need of renewal"],
    agenda: [
      { time: "07:00 PM", title: "Acoustic Worship Prelude", desc: "Quiet prayer, scripture meditation, and sanctuary preparation." },
      { time: "07:30 PM", title: "Congregational Praise & Worship", desc: "Led by the Christ Revelation Worship Collective & Choir." },
      { time: "08:45 PM", title: "Prophetic Ministry & Healing Prayer", desc: "Ministers available for laying on of hands and personal intercession." }
    ],
    highlights: ["Unhurried Live Worship", "Healing & Prayer Ministry", "Testimony Sharing", "Live Sanctuary Recording"],
    host: {
      name: "Pastor David Vance",
      role: "Senior Pastor",
      image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg"
    },
    views: 618,
    createdAt: "2026-02-20T11:00:00.000Z"
  },
  {
    id: "event-1",
    title: "Sunday Celebration Service & Communion",
    subtitle: "Encounter God's presence, anointed praise, and transformative Word",
    type: "GENERAL",
    date: "August 09, 2026",
    time: "10:00 AM - 12:30 PM",
    location: "Main Sanctuary & Online Broadcast",
    capacity: "500 Attendees",
    accessibility: "Wheelchair accessible, Sign language interpreter, Live translation headsets",
    price: "Free",
    status: "Upcoming" as const,
    images: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3562-scaled.jpeg",
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3517-scaled.jpeg"
    ],
    description: [
      "Join us for our main Sunday gathering where we worship together, break bread in holy communion, and hear an uplifting sermon from Pastor David.",
      "Children's church and nursery care are available during the sermon portion."
    ],
    perfectFor: ["Families", "First-time Visitors", "Believers seeking deeper fellowship"],
    agenda: [
      { time: "09:30 AM", title: "Welcome & Fellowship Coffee", desc: "Enjoy fresh coffee and light pastries in the foyer" },
      { time: "10:00 AM", title: "Praise & Worship", desc: "Led by the CRC choir and orchestra" },
      { time: "10:45 AM", title: "The Word & Communion", desc: "Message by Pastor David Vance" },
      { time: "12:00 PM", title: "Ministry & Prayer Line", desc: "Personal prayer with our pastoral team" }
    ],
    highlights: ["Live Choir & Band", "Communion Service", "Kids Ministry Available", "After-Service Luncheon"],
    host: {
      name: "Pastor David Vance",
      role: "Senior Pastor",
      image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg"
    },
    views: 342,
    createdAt: "2026-02-15T09:00:00.000Z"
  },
  {
    id: "event-3",
    title: "Midweek Bible Study: Faith Foundations",
    subtitle: "Interactive chapter-by-chapter study through the Book of Romans",
    type: "WORKSHOP",
    date: "August 19, 2026",
    time: "07:00 PM - 08:30 PM",
    location: "Fellowship Hall & Zoom Link",
    capacity: "120 Participants",
    accessibility: "Full digital streaming access",
    price: "Free",
    status: "Open" as const,
    images: [
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/woman-sitting-with-hand-together-book-her-lap-scaled.jpg"
    ],
    description: [
      "Dig into the profound truths of grace, justification, and living by the Spirit with our pastoral team.",
      "Study guides and commentary packets provided to all attendees."
    ],
    perfectFor: ["New Believers", "Bible Students", "Small Group Leaders"],
    agenda: [
      { time: "07:00 PM", title: "Tea & Opening Reflection", desc: "Catch up with study partners" },
      { time: "07:20 PM", title: "Expository Teaching", desc: "Romans Chapter 8 deep dive" },
      { time: "08:00 PM", title: "Table Discussions & Q&A", desc: "Interactive sharing and questions" }
    ],
    highlights: ["Free Study Guide", "Breakout Discussions", "Online Stream Available"],
    host: {
      name: "Elder Marcus Cole",
      role: "Christian Education Director",
      image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3544-scaled.jpeg"
    },
    views: 184,
    createdAt: "2026-03-02T14:00:00.000Z"
  }
];

export const INITIAL_VOLUNTEERS = [
  {
    id: "vol-1",
    firstName: "Elijah",
    lastName: "Sterling",
    email: "elijah.sterling@email.com",
    phone: "+44 7700 900142",
    location: "London, UK",
    ageGroup: "25-34",
    interests: ["Media & Livestream", "Sound Engineering"],
    frequency: "Weekly",
    days: ["Sunday", "Wednesday"],
    time: ["Morning", "Evening"],
    preference: "In-person",
    hasExperience: "Yes",
    experienceDetails: "3 years running digital soundboards (Behringer X32 and Yamaha TF5) in collegiate chapel services.",
    motivation: "I love using technical excellence to glorify God and enhance the worship experience.",
    skills: ["ProPresenter", "Audio Mixing", "Video Switching", "OBS Studio"],
    status: "active",
    matchScore: 98,
    appliedDate: "12-02-2026"
  },
  {
    id: "vol-2",
    firstName: "Grace",
    lastName: "Adeyemi",
    email: "grace.adeyemi@email.com",
    phone: "+44 7700 900583",
    location: "London, UK",
    ageGroup: "35-49",
    interests: ["Choir & Vocal Team", "Worship Team"],
    frequency: "Weekly",
    days: ["Thursday", "Sunday"],
    time: ["Evening", "Morning"],
    preference: "In-person",
    hasExperience: "Yes",
    experienceDetails: "Vocalist with 8 years of classical choral and contemporary gospel worship training.",
    motivation: "Passionate about leading people into God's presence through sincere praise.",
    skills: ["Alto Vocalist", "Sight Reading", "Harmony Arranging"],
    status: "active",
    matchScore: 95,
    appliedDate: "18-01-2026"
  },
  {
    id: "vol-3",
    firstName: "Jonathan",
    lastName: "Miller",
    email: "jonathan.miller@email.com",
    phone: "+44 7700 900892",
    location: "Surrey, UK",
    ageGroup: "50-64",
    interests: ["Ushering & Hospitality", "Welcoming"],
    frequency: "Fortnightly",
    days: ["Sunday"],
    time: ["Morning"],
    preference: "In-person",
    hasExperience: "Yes",
    experienceDetails: "Head usher at prior church for 5 years. Warm, organized, and vigilant.",
    motivation: "Greeting visitors with Christ's warmth sets the atmosphere for salvation.",
    skills: ["Crowd Coordination", "First Aid Certified", "Conflict De-escalation"],
    status: "active",
    matchScore: 92,
    appliedDate: "05-02-2026"
  },
  {
    id: "vol-4",
    firstName: "Hannah",
    lastName: "Clarke",
    email: "hannah.clarke@email.com",
    phone: "+44 7700 900214",
    location: "London, UK",
    ageGroup: "18-24",
    interests: ["Youth Ministry", "Children's Sunday School"],
    frequency: "Weekly",
    days: ["Sunday"],
    time: ["Morning"],
    preference: "In-person",
    hasExperience: "Yes",
    experienceDetails: "Early childhood education student; volunteer camp counselor for 2 summers.",
    motivation: "Investing in children and seeing them discover the Bible is my biggest joy.",
    skills: ["Storytelling", "Arts & Crafts", "Safeguarding Trained"],
    status: "pending",
    matchScore: 89,
    appliedDate: "10-03-2026"
  },
  {
    id: "vol-5",
    firstName: "Samuel",
    lastName: "Okeke",
    email: "samuel.okeke@email.com",
    phone: "+44 7700 900651",
    location: "London, UK",
    ageGroup: "25-34",
    interests: ["Community Outreach", "Food Pantry"],
    frequency: "Monthly",
    days: ["Saturday"],
    time: ["Morning"],
    preference: "In-person",
    hasExperience: "No",
    experienceDetails: "New to volunteering but ready and eager to assist with physical labor and transport.",
    motivation: "Desire to serve the poor and represent Jesus outside church walls.",
    skills: ["Valid UK Driver's License", "Heavy Lifting", "Logistics"],
    status: "active",
    matchScore: 86,
    appliedDate: "28-02-2026"
  }
];

export const INITIAL_TEAMS = [
  {
    id: "team-1",
    name: "Media & Broadcast Crew",
    department: "Technology",
    status: "Active" as const,
    color: "#000000",
    tags: ["Livestream", "Cameras", "Sound", "Lighting"],
    notes: "Operates Sunday mornings and midweek services. Rehearsals Saturday afternoon.",
    leaderId: "vol-1",
    members: [
      { id: "vol-1", name: "Elijah Sterling", role: "Team Leader", department: "Audio/Video", avatar: "Elijah Sterling" }
    ],
    createdAt: "2026-01-10T10:00:00.000Z"
  },
  {
    id: "team-2",
    name: "Worship & Sanctuary Choir",
    department: "Music & Worship",
    status: "Active" as const,
    color: "#6366f1",
    tags: ["Vocals", "Musicians", "Praise"],
    notes: "Thursday evening rehearsals at 7:00 PM; soundcheck Sunday 8:30 AM.",
    leaderId: "vol-2",
    members: [
      { id: "vol-2", name: "Grace Adeyemi", role: "Lead Vocalist", department: "Choir", avatar: "Grace Adeyemi" }
    ],
    createdAt: "2026-01-12T11:00:00.000Z"
  },
  {
    id: "team-3",
    name: "Guest Services & Ushering",
    department: "Hospitality",
    status: "Active" as const,
    color: "#10b981",
    tags: ["Greeters", "Ushers", "Information Desk"],
    notes: "Arrival 45 minutes prior to each service; foyer setup and offering distribution.",
    leaderId: "vol-3",
    members: [
      { id: "vol-3", name: "Jonathan Miller", role: "Head Usher", department: "Guest Services", avatar: "Jonathan Miller" }
    ],
    createdAt: "2026-01-15T09:00:00.000Z"
  },
  {
    id: "team-4",
    name: "Ignite Children & Youth Leaders",
    department: "NextGen",
    status: "Active" as const,
    color: "#f59e0b",
    tags: ["Sunday School", "Crèche", "Youth Group"],
    notes: "All team members must hold active DBS clearance.",
    leaderId: "vol-4",
    members: [
      { id: "vol-4", name: "Hannah Clarke", role: "Teacher", department: "Youth", avatar: "Hannah Clarke" }
    ],
    createdAt: "2026-02-01T14:00:00.000Z"
  }
];

export const INITIAL_BLOGS = [
  {
    id: "worship-opens-doors",
    title: "Worship Opens Doors",
    excerpt: "Worship is more than the songs we sing or the words we speak—it is the key that opens doors into the very presence of God.",
    content: [
      {
        heading: "The Key Into God’s Presence",
        text: "Worship is more than the songs we sing or the words we speak—it is the key that opens doors into the very presence of God. When we enter into genuine, heartfelt worship, we step through a spiritual doorway that leads us from the ordinary into the extraordinary, from struggle into strength, from fear into faith, and from chaos into peace."
      },
      {
        heading: "Shifting the Atmosphere",
        text: "In the Bible, worship consistently unlocks divine encounters. When Paul and Silas sang hymns in a prison cell, the doors literally swung open and chains fell off (Acts 16:25-26). Their worship didn’t just invite God’s presence—it shifted the atmosphere. That same spiritual principle applies today: worship opens doors that no man can shut. It opens the door of heaven to pour grace over hardship, the door of joy in times of sorrow, and the door of revelation when we need direction.",
        videoEmbedUrl: "https://www.youtube.com/embed/nNyo7lREMq8?feature=oembed"
      },
      {
        heading: "Entering the Throne Room of God",
        text: "Worship transforms locked situations. Every time you choose to praise instead of panic, heaven responds. Every song lifted in faith breaks barriers in the spirit. Through worship, you’re not just entering a church building—you’re entering the throne room of God. And where His presence dwells, blessings overflow, healing is released, and freedom is found."
      },
      {
        heading: "Worship in Your Waiting",
        text: "Don’t wait for the door to open to start worshiping—begin now. Worship in your waiting, and watch how God turns your waiting room into a birthing room for miracles. When you lift your hands, you’re not just reaching up—you’re unlocking heaven. The door of blessing, favor, and breakthrough is opened to those who worship in spirit and in truth."
      }
    ],
    pullQuote: "Don’t wait for the door to open to start worshiping—begin now. The door of blessing, favor, and breakthrough is opened to those who worship in spirit and in truth.",
    category: "Faith",
    tags: ["WORSHIP", "SERMONS"],
    date: "28 August 2025",
    readTime: "4 MIN",
    image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pixabay-236321-scaled.jpg",
    author: {
      name: "Pastor Manoj Nair",
      role: "Senior Pastor",
      avatar: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
      bio: "Driven by a profound mission to bring sinners to Christ, extend a guiding hand to those battling with addiction and alcoholism, and prepare believers for their divine purpose."
    },
    views: 1240
  },
  {
    id: "prayer-is-the-key",
    title: "Prayer is the Key",
    excerpt: "Prayer is not just a spiritual practice—it is the master key that unlocks heaven’s doors and brings God’s power into our lives.",
    content: [
      {
        heading: "The Master Key That Unlocks Heaven’s Doors",
        text: "Prayer is not just a spiritual practice—it is the master key that unlocks heaven’s doors and brings God’s power into our lives. It is the divine connection between humanity and our Creator—the sacred line where we speak, listen, and align our hearts with His perfect will. Through prayer, the ordinary becomes extraordinary, and what seems impossible becomes possible through faith in God."
      },
      {
        heading: "The Foundation of a Victorious Life",
        text: "When Jesus walked the earth, He demonstrated that prayer was essential, not optional. Before He healed the sick, called the disciples, or faced the cross, He prayed. From the mountaintops to the garden of Gethsemane, Jesus showed us that prayer is not a backup plan—it is the foundation of a victorious life. The Son of God, in His moments of strength and struggle alike, sought His Father through intimate, passionate prayer (Luke 6:12; Matthew 26:39)."
      },
      {
        heading: "Prayer Is the Key That Opens Doors",
        text: "• The door of peace when anxiety overwhelms.\n• The door of strength when weakness takes hold.\n• The door of wisdom when confusion clouds our minds.\n• The door of deliverance when we face bondage or fear.\n• The door of God’s presence when we feel alone or forgotten.\n\nThe Bible reminds us that “The effective, fervent prayer of a righteous man avails much” (James 5:16). Prayer moves the hand of God—not because He is bound by our words, but because He delights in communion with His children. Prayer changes circumstances, yes, but most importantly, it changes us. It molds our will to match His, filling us with peace, power, and purpose.",
        image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-ranit-das-2154541727-33572731-scaled.jpg"
      },
      {
        heading: "Sincerity Over Fancy Words",
        text: "You don’t need fancy words or perfect timing. The key is sincerity. God hears even the whisper of a heart that truly seeks Him. When we pray according to His Word, mountains move, doors open, and breakthroughs manifest. Every answered prayer is evidence that heaven responds to humble faith.\n\nSo, keep your spiritual keys close—pray when the way seems closed, when the load feels heavy, when the path is unclear. The same God who opened prison doors for Paul and Silas can open every locked door in your life (Acts 16:25-26)."
      }
    ],
    pullQuote: "The effective, fervent prayer of a righteous man avails much (James 5:16). Prayer changes circumstances, yes, but most importantly, it changes us.",
    category: "Spiritual Growth",
    tags: ["PRAYER", "SERMONS"],
    date: "28 August 2025",
    readTime: "5 MIN",
    image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pavel-danilyuk-8814997-scaled.jpg",
    author: {
      name: "Pastor Manoj Nair",
      role: "Senior Pastor",
      avatar: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
      bio: "Driven by a profound mission to bring sinners to Christ, extend a guiding hand to those battling with addiction and alcoholism, and prepare believers for their divine purpose."
    },
    views: 1530
  },
  {
    id: "christmas-music-festival",
    title: "Christmas Music Festival",
    excerpt: "Celebrate the joy and wonder of the Christmas season with Christ Revelation Church at our Christmas Music Festival!",
    content: [
      {
        heading: "Celebrating the Birth of Our Lord and Savior",
        text: "Celebrate the joy and wonder of the Christmas season with Christ Revelation Church at our Christmas Music Festival! Join us for an evening filled with uplifting worship, beautiful carols, and inspiring musical performances that capture the true spirit of Christmas—the celebration of the birth of our Lord and Savior, Jesus Christ."
      },
      {
        heading: "Hymns of Hope and Contemporary Worship",
        text: "Our festival features a wonderful lineup of choirs, soloists, and musicians, blending traditional Christmas hymns with contemporary worship songs. It’s a perfect occasion for families and friends to come together, rejoice in God’s gift of hope, and experience the joyous sounds that mark this holy season.",
        image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3200-scaled.jpeg"
      },
      {
        heading: "Renewed Faith, Peace, and Thanksgiving",
        text: "Whether you are a long-time member of our church or visiting for the first time, this event promises to warm your heart, renew your faith, and fill your spirit with peace and thanksgiving. Enjoy the festive atmosphere, delightful refreshments, and opportunities to connect with our church family."
      }
    ],
    pullQuote: "Capture the true spirit of Christmas—the celebration of the birth of our Lord and Savior, Jesus Christ.",
    category: "Community",
    tags: ["CHRISTMAS", "CHURCH ACTIVITIES"],
    date: "25 December 2025",
    readTime: "3 MIN",
    image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pixabay-236310-scaled.jpg",
    author: {
      name: "Pastor Manoj Nair",
      role: "Senior Pastor",
      avatar: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
      bio: "Driven by a profound mission to bring sinners to Christ, extend a guiding hand to those battling with addiction and alcoholism, and prepare believers for their divine purpose."
    },
    views: 890
  },
  {
    id: "our-story-and-mission",
    title: "All About Christ Revelation Church: Our Story & Mission",
    excerpt: "At Christ Revelation Church, we believe that church is more than a building—it’s a family bound by love, strengthened by faith, and sustained by God’s grace.",
    content: [
      {
        heading: "All About Christ Revelation Church",
        text: "In addition to our commitment to evangelism and outreach, we help and encourage families to understand the importance of family life and leading them to Christ by giving bible studies. We are also engaged in rehabilitation for individuals grappling with drug addiction by offering them the help they need to get their life back on track and understand the love of God."
      },
      {
        heading: "Transformative Power of the Gospel",
        text: "We believe in the transformative power of the Christian gospel, fostering spiritual growth and offering hope to those facing life’s challenges. With a strong emphasis on compassion, urgency, and readiness for the return of Jesus, our community strives to create a welcoming space for all.",
        image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3215-scaled.jpeg"
      },
      {
        heading: "Our Mission & Why Worship With Us",
        text: "At Christ Revelation Church, our mission is simple yet profound: Guided by the Holy Spirit, our Pentecostal church envisions a community where individuals passionately pursue God’s presence, experience transformative encounters, and radiate His love to the world.\n\nJoin us on this journey of love, redemption, and holistic support for individuals and families in need. We strive to be a beacon of spiritual vitality, impacting lives and empowering believers to fulfil their divine purpose."
      }
    ],
    pullQuote: "When Christ died, He died for all. When He rose, He rose for all. Now, it is our calling to reveal the love of the crucified Christ and the glory of the living Christ to the world.",
    category: "Outreach",
    tags: ["OUR STORY", "MISSION"],
    date: "28 August 2025",
    readTime: "4 MIN",
    image: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3554-scaled.jpeg",
    author: {
      name: "Pastor Manoj Nair",
      role: "Senior Pastor",
      avatar: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
      bio: "Driven by a profound mission to bring sinners to Christ, extend a guiding hand to those battling with addiction and alcoholism, and prepare believers for their divine purpose."
    },
    views: 740
  }
];

export const INITIAL_SUBADMINS = [
  {
    id: "sub-1",
    fullName: "Pastor David Vance",
    email: "pastor.david@christrevelation.org",
    phone: "+44 7700 900010",
    dob: "1980-05-14",
    gender: "Male",
    nationality: "British",
    address: "24 Cathedral Way, London",
    role: "Super Admin",
    permissions: ["all"],
    location: "London, UK",
    avatar: "DV",
    color: "bg-black",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "sub-2",
    fullName: "Sarah Jenkins",
    email: "sarah.jenkins@christrevelation.org",
    phone: "+44 7700 900022",
    dob: "1989-11-20",
    gender: "Female",
    nationality: "British",
    address: "8 St. Paul Close, London",
    role: "Ministry Admin",
    permissions: ["/admin/events", "/admin/volunteers", "/admin/campaigns"],
    location: "London, UK",
    avatar: "SJ",
    color: "bg-blue-500",
    createdAt: "2024-03-15T10:00:00.000Z"
  },
  {
    id: "sub-3",
    fullName: "Marcus Cole",
    email: "marcus.cole@christrevelation.org",
    phone: "+44 7700 900035",
    dob: "1994-08-03",
    gender: "Male",
    nationality: "British",
    address: "15 Thames Reach, London",
    role: "Communications Lead",
    permissions: ["/admin/blog", "/admin/subscribers", "/admin/contacts"],
    location: "London, UK",
    avatar: "MC",
    color: "bg-emerald-500",
    createdAt: "2024-06-20T14:30:00.000Z"
  },
  {
    id: "sub-4",
    fullName: "Rachel Adams",
    email: "finance@christrevelation.org",
    phone: "+44 7700 900088",
    dob: "1985-02-12",
    gender: "Female",
    nationality: "British",
    address: "42 Bishopsgate, London",
    role: "Finance Officer",
    permissions: ["/admin/transactions", "/admin/analytics", "/admin/campaigns"],
    location: "London, UK",
    avatar: "RA",
    color: "bg-purple-500",
    createdAt: "2024-09-01T08:00:00.000Z"
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "TXN-8092",
    name: "Arthur Pendelton",
    email: "a.pendelton@outlook.com",
    amount: "£250.00",
    currency: "GBP",
    currencySymbol: "£",
    designation: "Tithe & Offering",
    status: "Completed",
    date: "2026-03-24T10:14:00.000Z",
    avatar: "A",
    color: "bg-blue-500",
    isAnonymous: false,
    campaign_id: "camp-1"
  },
  {
    id: "TXN-8091",
    name: "Anonymous Partner",
    email: "donor-hidden@crc.org",
    amount: "£1,000.00",
    currency: "GBP",
    currencySymbol: "£",
    designation: "Sanctuary Sound & Media",
    status: "Completed",
    date: "2026-03-23T16:45:00.000Z",
    avatar: "A",
    color: "bg-black",
    isAnonymous: true,
    campaign_id: "camp-1"
  },
  {
    id: "TXN-8090",
    name: "Dr. Evelyn Wright",
    email: "evelyn.wright@nhs.net",
    amount: "£150.00",
    currency: "GBP",
    currencySymbol: "£",
    designation: "Community Food Pantry",
    status: "Completed",
    date: "2026-03-23T11:20:00.000Z",
    avatar: "E",
    color: "bg-emerald-500",
    isAnonymous: false,
    campaign_id: "camp-2"
  },
  {
    id: "TXN-8089",
    name: "Matthew Sterling",
    email: "m.sterling@gmail.com",
    amount: "£75.00",
    currency: "GBP",
    currencySymbol: "£",
    designation: "Youth Camp Sponsorship",
    status: "Completed",
    date: "2026-03-22T19:30:00.000Z",
    avatar: "M",
    color: "bg-purple-500",
    isAnonymous: false,
    campaign_id: "camp-3"
  },
  {
    id: "TXN-8088",
    name: "Claire Beaumont",
    email: "claire.beaumont@btinternet.com",
    amount: "£500.00",
    currency: "GBP",
    currencySymbol: "£",
    designation: "Building & Expansion Fund",
    status: "Completed",
    date: "2026-03-21T09:15:00.000Z",
    avatar: "C",
    color: "bg-yellow-500",
    isAnonymous: false,
    campaign_id: "camp-4"
  },
  {
    id: "TXN-8087",
    name: "Robert O'Connor",
    email: "roconnor@icloud.com",
    amount: "£100.00",
    currency: "GBP",
    currencySymbol: "£",
    designation: "Tithe",
    status: "Pending",
    date: "2026-03-21T08:00:00.000Z",
    avatar: "R",
    color: "bg-orange-500",
    isAnonymous: false,
    campaign_id: null
  },
  {
    id: "TXN-8086",
    name: "Sophia Martinez",
    email: "smartinez99@gmail.com",
    amount: "£50.00",
    currency: "GBP",
    currencySymbol: "£",
    designation: "Food Pantry",
    status: "Failed",
    date: "2026-03-20T14:22:00.000Z",
    avatar: "S",
    color: "bg-pink-500",
    isAnonymous: false,
    campaign_id: "camp-2"
  },
  {
    id: "TXN-8085",
    name: "Pastor David Vance",
    email: "pastor.david@christrevelation.org",
    amount: "£300.00",
    currency: "GBP",
    currencySymbol: "£",
    designation: "Monthly Ministry Seed",
    status: "Completed",
    date: "2026-03-19T10:00:00.000Z",
    avatar: "D",
    color: "bg-teal-500",
    isAnonymous: false,
    campaign_id: null
  }
];

export const INITIAL_CONTACTS = [
  {
    id: "cnt-1",
    name: "Victoria Hughes",
    email: "victoria.hughes@gmail.com",
    phone: "+44 7911 123456",
    subject: "Prayer Request for Family Healing",
    message: "Kindly pray for my mother who is undergoing surgery this coming Thursday. We trust the Lord for full restoration.",
    category: "Active Contacts",
    priority: "High",
    status: "ACTIVE",
    avatar: "V",
    color: "bg-emerald-500",
    createdAt: "2026-03-24T09:30:00.000Z"
  },
  {
    id: "cnt-2",
    name: "Benjamin Davies",
    email: "bdavies.arch@gmail.com",
    phone: "+44 7922 987654",
    subject: "Child Dedication Inquiry",
    message: "My wife and I would love to dedicate our newborn son during an upcoming Sunday service. What are the available dates?",
    category: "Potential Clients",
    priority: "Neutral",
    status: "ACTIVE",
    avatar: "B",
    color: "bg-blue-500",
    createdAt: "2026-03-23T14:10:00.000Z"
  },
  {
    id: "cnt-3",
    name: "Sister Deborah Mensah",
    email: "deborah.mensah@yahoo.co.uk",
    phone: "+44 7933 456789",
    subject: "Volunteering with Children's Choir",
    message: "I am a qualified music teacher and would love to help conduct the junior choir rehearsals on Saturdays.",
    category: "Active Contacts",
    priority: "High",
    status: "ACTIVE",
    avatar: "D",
    color: "bg-purple-500",
    createdAt: "2026-03-22T11:00:00.000Z"
  },
  {
    id: "cnt-4",
    name: "George Richardson",
    email: "george.r@richardsonmedia.co.uk",
    phone: "+44 7944 654321",
    subject: "Sanctuary Lighting Consultation",
    message: "Reaching out regarding the lighting fixtures quotation requested for the stage upgrade project.",
    category: "Certain Sector",
    priority: "Neutral",
    status: "ACTIVE",
    avatar: "G",
    color: "bg-yellow-500",
    createdAt: "2026-03-20T16:45:00.000Z"
  }
];

export const INITIAL_SUBSCRIBERS = [
  {
    id: "sub-1",
    email: "james.wilson@londonpress.com",
    status: "Active",
    type: "Weekly Newsletter",
    region: "Europe",
    engagement: "High",
    createdAt: "2026-03-20T10:00:00.000Z"
  },
  {
    id: "sub-2",
    email: "elena.rostova@gmail.com",
    status: "Active",
    type: "Prayer Bulletins",
    region: "North America",
    engagement: "High",
    createdAt: "2026-03-18T14:22:00.000Z"
  },
  {
    id: "sub-3",
    email: "kwame.asante@ghanafaith.org",
    status: "Active",
    type: "Missions Update",
    region: "Global",
    engagement: "New",
    createdAt: "2026-03-15T09:12:00.000Z"
  },
  {
    id: "sub-4",
    email: "sarah.b@cambridge.ac.uk",
    status: "Active",
    type: "Weekly Newsletter",
    region: "Europe",
    engagement: "High",
    createdAt: "2026-03-10T12:00:00.000Z"
  },
  {
    id: "sub-5",
    email: "grace.choi@seoulchurch.kr",
    status: "Active",
    type: "Youth Ministry",
    region: "Asia",
    engagement: "New",
    createdAt: "2026-03-05T08:30:00.000Z"
  }
];

export const INITIAL_PRAYER_REQUESTS = [
  {
    id: "pray-1",
    category: "Healing",
    title: "Mrs.",
    firstName: "Victoria",
    lastName: "Hughes",
    email: "victoria.hughes@gmail.com",
    street: "42 Kensington High St",
    apt: "Flat 3B",
    city: "London",
    state: "Greater London",
    zip: "W8 5SA",
    country: "United Kingdom",
    request:
      "Kindly pray for my mother who is undergoing cardiac surgery this coming Thursday. We trust the Lord for full restoration, peace for our family, and wisdom for the surgical team.",
    contactPreference: "yes" as const,
    isConfidential: true,
    status: "Praying" as const,
    notes: "Pastor David called the family on Tuesday evening to pray with them prior to hospital admission.",
    createdAt: "2026-03-26T09:30:00.000Z"
  },
  {
    id: "pray-2",
    category: "Guidance",
    title: "Mr.",
    firstName: "Daniel",
    lastName: "Osei",
    email: "daniel.osei@outlook.com",
    street: "18 Victoria Park Road",
    apt: "",
    city: "Manchester",
    state: "Lancashire",
    zip: "M14 5AA",
    country: "United Kingdom",
    request:
      "Seeking God's clear direction and open doors as I transition careers and relocate my young family. Praying for discernment, financial stability, and a supportive church home.",
    contactPreference: "yes" as const,
    isConfidential: false,
    status: "New" as const,
    notes: "",
    createdAt: "2026-03-25T15:45:00.000Z"
  },
  {
    id: "pray-3",
    category: "Thanksgiving",
    title: "Dr.",
    firstName: "Evelyn",
    lastName: "Wright",
    email: "evelyn.wright@nhs.net",
    street: "740 Market Street",
    apt: "Suite 210",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    country: "United States",
    request:
      "Giving glory and thanksgiving to God! After six months of intercession with the church prayer team, my brother's medical scans came back completely clear. Thank you to every prayer warrior who stood with us!",
    contactPreference: "no" as const,
    isConfidential: false,
    status: "Answered" as const,
    notes: "Shared during Sunday morning testimony time with Evelyn's permission.",
    createdAt: "2026-03-24T11:20:00.000Z"
  },
  {
    id: "pray-4",
    category: "Healing",
    title: "Ms.",
    firstName: "Rebecca",
    lastName: "Thornton",
    email: "r.thornton@btinternet.com",
    street: "95 St. Aldates",
    apt: "Apt 12",
    city: "Oxford",
    state: "Oxfordshire",
    zip: "OX1 1BT",
    country: "United Kingdom",
    request:
      "Please pray for emotional healing, peace of mind, and restful sleep during a season of grief after losing my father earlier this year.",
    contactPreference: "yes" as const,
    isConfidential: true,
    status: "Followed Up" as const,
    notes: "Connected with Care & Bereavement Ministry small group.",
    createdAt: "2026-03-22T18:10:00.000Z"
  },
  {
    id: "pray-5",
    category: "Other",
    title: "Mr.",
    firstName: "Marcus",
    lastName: "Vance",
    email: "marcus.v@gmail.com",
    street: "512 Elmwood Ave",
    apt: "",
    city: "Chicago",
    state: "IL",
    zip: "60611",
    country: "United States",
    request:
      "Praying for unity, spiritual revival, and protection over our local youth and university students as they prepare for final exams.",
    contactPreference: "no" as const,
    isConfidential: false,
    status: "Praying" as const,
    notes: "Added to Wednesday evening intercessory prayer bulletin.",
    createdAt: "2026-03-20T08:05:00.000Z"
  }
];
