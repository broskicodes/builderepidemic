export interface BlogPost {
  author: string;
  title: string;
  description: string | null;
  content: string;
  image_url: string | null;
  slug: string;
  date: string;
}

export enum NodeType {
  Coworking = "coworking",
  Meetup = "meetup",
  HackerHouse = "hackerhouse",
  Hackathon = "hackathon",
  IncubatorOrAccelerator = "incubator/accelerator",
  Other = "other",
}

export const NodeColorMap = {
  [NodeType.Coworking]: "7358F9",
  [NodeType.Meetup]: "EE8434",
  [NodeType.HackerHouse]: "D7FDEC",
  [NodeType.Hackathon]: "65334D",
  [NodeType.IncubatorOrAccelerator]: "000000",
  [NodeType.Other]: "000000",
}

export interface Link {
  name: string;
  url: string;
}

export interface Node {
  id: string;
  name: string;
  description: string;
  location: string;
  longitude: number;
  latitude: number;
  node_type: NodeType;
  links: Link[];
  connection: string | null;
}

export enum TwitterScrapeType {
  Initialize = "initialize",
  Update = "update"
}

// Events
export const SIGNUP_EVENT = 'user-signed-up';
export const SHOW_MAP_EVENT = 'show-map';

// Constants
export const APIFY_TWEET_SCRAPER_ACTOR = "61RPP7dywgiy0JPD0";
