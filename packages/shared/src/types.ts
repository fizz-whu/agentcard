export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface NameCard {
  id: string;
  userId: string;
  templateId: string;
  isDefault: boolean;
  fields: CardFields;
  createdAt: string;
  updatedAt: string;
}

export interface CardFields {
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: Record<string, string>;
  customFields?: Record<string, string>;
}

export interface CardTemplate {
  id: string;
  name: string;
  previewUrl: string;
  htmlTemplate: string;
}

export interface Exchange {
  id: string;
  fromUserId: string;
  toUserId: string;
  cardId: string;
  exchangedAt: string;
}

export interface GroupSession {
  id: string;
  hostUserId: string;
  title?: string;
  startsAt: string;
  expiresAt: string;
  status: "active" | "closed";
  createdAt: string;
}

export interface GroupSessionMember {
  sessionId: string;
  userId: string;
  cardId: string;
  joinedAt: string;
  kept: boolean;
}
