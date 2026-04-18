export type ListingType =
  | "BLOOD_DONOR"
  | "BLOOD_BANK"
  | "PHARMACY"
  | "CLINIC"
  | "JOB"
  | "TEACHER"
  | "NEWS";

export type Listing = {
  id: string;
  type: ListingType;
  title: string;
  description: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  metadata?: Record<string, unknown> | null;
  distanceKm?: number | null;
  createdAt?: string;
};

export type UserRole = "USER" | "BUSINESS" | "ADMIN";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type FeedPostAuthor = {
  id: string;
  name: string;
};

export type UserFeedPost = {
  id: string;
  title: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: FeedPostAuthor;
};

export type SosNearbyAlert = {
  id: string;
  authorId: string;
  lat: number;
  lng: number;
  message: string | null;
  createdAt: string;
  authorName: string;
  distanceKm: number;
};
