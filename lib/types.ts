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
