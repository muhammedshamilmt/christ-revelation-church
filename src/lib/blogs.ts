export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  tags: string[];
  image: string;
  date: string;
  author: string;
  readTime: string;
}

export const DUMMY_BLOGS: Blog[] = [
  {
    id: "1",
    title: "The Power of Community Worship in Modern Times",
    excerpt: "Discover how gathering together strengthens our faith and brings us closer to God's purpose.",
    content: [
      "Worship is more than just singing songs; it is the collective heartbeat of a community seeking God’s presence. In our fast-paced modern world, taking time to gather with fellow believers has never been more vital.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ],
    category: "Faith",
    tags: ["WORSHIP", "COMMUNITY"],
    image: "/images/hero-bg.png",
    date: "10 June 2024",
    author: "Pastor John Doe",
    readTime: "5 MIN"
  },
  {
    id: "2",
    title: "Youth Outreach: Building the Next Generation",
    excerpt: "Our recent youth camp demonstrated the incredible potential and passion of our younger members.",
    content: [
      "The youth are not just the future of the church; they are the church of today. Our recent youth outreach program saw incredible participation and spiritual growth among teenagers in our community.",
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."
    ],
    category: "Outreach",
    tags: ["YOUTH", "EVENTS"],
    image: "/images/hero-bg.png",
    date: "15 July 2024",
    author: "Sarah Jenkins",
    readTime: "4 MIN"
  },
  {
    id: "3",
    title: "Finding Peace Through Daily Prayer",
    excerpt: "Practical steps to incorporate meaningful prayer into your daily routine and experience God's peace.",
    content: [
      "Prayer is our direct line of communication with our Creator. Yet, finding time to pray effectively can often feel like a challenge in the midst of our daily responsibilities.",
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate."
    ],
    category: "Spiritual Growth",
    tags: ["PRAYER", "GUIDANCE"],
    image: "/images/hero-bg.png",
    date: "22 August 2024",
    author: "Rev. Michael Smith",
    readTime: "6 MIN"
  },
  {
    id: "4",
    title: "Annual Charity Drive Success",
    excerpt: "How our community came together to provide for over 500 families this holiday season.",
    content: [
      "We are overwhelmed with gratitude for the generosity shown by our congregation during the annual charity drive. Together, we were able to provide essential supplies, food, and clothing to over 500 families.",
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
      "Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio."
    ],
    category: "Community",
    tags: ["CHARITY", "LOVE"],
    image: "/images/hero-bg.png",
    date: "05 September 2024",
    author: "Emily Davis",
    readTime: "3 MIN"
  }
];
