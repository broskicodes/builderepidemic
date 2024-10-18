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
  Hackathon = "hackathon",
  IncubatorOrAccelerator = "incubator/accelerator",
  Other = "other",
}

export const NodeColorMap = {
  [NodeType.Coworking]: "7358F9",
  [NodeType.Meetup]: "8765F9",
  [NodeType.Hackathon]: "000000",
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
