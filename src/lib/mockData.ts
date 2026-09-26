export const INITIAL_CAMPAIGNS = [
  {
    id: "camp-1",
    title: "Sanctuary Sound & Media Upgrade",
    org: "Christ Revelation Church",
    raised: 28500,
    goal: 35000,
    daysLeft: 14,
    status: "Active" as const,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
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
    image: "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=1200&q=80",
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
    id: "event-1",
    title: "Sunday Celebration Service & Communion",
    subtitle: "Encounter God's presence, anointed praise, and transformative Word",
    type: "GENERAL",
    date: "2026-03-29",
    time: "10:00 AM - 12:30 PM",
    location: "Main Sanctuary & Online Broadcast",
    capacity: "500 Attendees",
    accessibility: "Wheelchair accessible, Sign language interpreter, Live translation headsets",
    price: "Free",
    status: "Upcoming" as const,
    images: [
      "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1445445290350-18a3b86e0b5b?auto=format&fit=crop&w=1200&q=80"
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
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    },
    views: 342,
    createdAt: "2026-02-15T09:00:00.000Z"
  },
  {
    id: "event-2",
    title: "Night of Healing & Prophetic Worship",
    subtitle: "A continuous night of soaking worship, biblical declarations, and miraculous healing",
    type: "CONFERENCE",
    date: "2026-04-03",
    time: "07:00 PM - 10:30 PM",
    location: "Christ Revelation Church Sanctuary",
    capacity: "450 Seats",
    accessibility: "Hearing loop installed, Ground level entry",
    price: "Free Admission",
    status: "Upcoming" as const,
    images: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
    ],
    description: [
      "An evening dedicated to unhurried praise, intercession for the sick, and opening our hearts to the Holy Spirit's touch.",
      "Bring friends, family, and anyone seeking physical or emotional restoration."
    ],
    perfectFor: ["Youth & Adults", "Seekers", "Anyone in need of prayer & healing"],
    agenda: [
      { time: "07:00 PM", title: "Acoustic Worship Prelude", desc: "Quiet prayer and contemplation" },
      { time: "07:30 PM", title: "Congregational Worship", desc: "High praise and thanksgiving" },
      { time: "08:45 PM", title: "Healing Prayer & Anointing", desc: "Ministers available for laying on of hands" }
    ],
    highlights: ["Extended Worship", "Special Ministry Guests", "Testimony Sharing"],
    host: {
      name: "Pastor Sarah Jenkins",
      role: "Worship & Prayer Director",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
    },
    views: 618,
    createdAt: "2026-02-20T11:00:00.000Z"
  },
  {
    id: "event-3",
    title: "Midweek Bible Study: Faith Foundations",
    subtitle: "Interactive chapter-by-chapter study through the Book of Romans",
    type: "WORKSHOP",
    date: "2026-04-01",
    time: "07:00 PM - 08:30 PM",
    location: "Fellowship Hall & Zoom Link",
    capacity: "120 Participants",
    accessibility: "Full digital streaming access",
    price: "Free",
    status: "Open" as const,
    images: [
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80"
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
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
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
    id: "blog-1",
    title: "The Power of Community Worship in Modern Times",
    excerpt: "Discover how gathering together strengthens our faith, deepens love, and brings us into God's presence.",
    content: [
      { heading: "A Sacred Rhythm", text: "Worship is more than singing songs on Sunday morning; it is the collective heartbeat of believers who choose unity over isolation." },
      { heading: "Overcoming Digital Fragmentation", text: "In an era of hyper-connected screens, standing shoulder-to-shoulder with brothers and sisters in Christ reminds us that we are members of one body." }
    ],
    pullQuote: "Worship is our highest calling and the soil in which deep community flourishes.",
    category: "Faith",
    date: "10 June 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Pastor David Vance",
      role: "Senior Pastor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    views: 1240
  },
  {
    id: "blog-2",
    title: "Youth Outreach: Building the Next Generation",
    excerpt: "Our recent youth initiatives demonstrate the immense potential and passion of young disciples.",
    content: [
      { heading: "Leading with Authenticity", text: "Young people are looking for genuine mentors who listen before they preach, living out grace in everyday decisions." }
    ],
    pullQuote: "The youth are not merely the church of tomorrow; they are active ministers today.",
    category: "Outreach",
    date: "15 July 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Sarah Jenkins",
      role: "Youth Director",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    },
    views: 890
  },
  {
    id: "blog-3",
    title: "Finding Peace Through Daily Prayer & Contemplation",
    excerpt: "Practical steps to cultivate an unshakeable inner calm amidst life's storms.",
    content: [
      { heading: "Quieting the Mind", text: "Start your morning with scripture recitation before checking your smartphone notifications." }
    ],
    pullQuote: "When we pray, we trade our anxieties for His peace that surpasses understanding.",
    category: "Spiritual Growth",
    date: "22 August 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Rev. Michael Smith",
      role: "Associate Minister",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    views: 1530
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
