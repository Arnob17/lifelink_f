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

// ─── Essential Things (E-Commerce) ─────────────────────────────

export type ProductCategory =
  | "GROCERY"
  | "ELECTRONICS"
  | "CLOTHING"
  | "MEDICINE"
  | "STATIONERY"
  | "HOME_KITCHEN"
  | "BEAUTY_HEALTH"
  | "SPORTS"
  | "BOOKS"
  | "OTHER";

export type ProductSeller = {
  id: string;
  name: string;
  email?: string;
  businessProfile?: { organizationName: string; verified?: boolean } | null;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl?: string | null;
  category: ProductCategory;
  stock: number;
  published: boolean;
  sellerId: string;
  createdAt: string;
  updatedAt?: string;
  seller?: ProductSeller;
};

export type CartItemProduct = {
  id: string;
  name: string;
  price: number;
  unit: string;
  imageUrl?: string | null;
  stock: number;
  published: boolean;
  seller?: {
    id: string;
    name: string;
    businessProfile?: { organizationName: string } | null;
  };
};

export type CartItem = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: CartItemProduct;
};

export type Cart = {
  items: CartItem[];
  total: number;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: {
    id: string;
    name: string;
    imageUrl?: string | null;
    unit: string;
    seller?: {
      id: string;
      name: string;
      businessProfile?: { organizationName: string } | null;
    };
  };
};

export type Order = {
  id: string;
  buyerId: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  contactPhone: string;
  note?: string | null;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  buyer?: { id: string; name: string; email: string; phone?: string | null };
};

export type ProductBrowseResult = {
  items: Product[];
  total: number;
  take: number;
  skip: number;
};

export type CategoryCount = {
  category: ProductCategory;
  count: number;
};

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  GROCERY: "মুদি · Grocery",
  ELECTRONICS: "ইলেকট্রনিক্স · Electronics",
  CLOTHING: "পোশাক · Clothing",
  MEDICINE: "ঔষধ · Medicine",
  STATIONERY: "স্টেশনারি · Stationery",
  HOME_KITCHEN: "ঘর ও রান্না · Home & Kitchen",
  BEAUTY_HEALTH: "সৌন্দর্য · Beauty & Health",
  SPORTS: "ক্রীড়া · Sports",
  BOOKS: "বই · Books",
  OTHER: "অন্যান্য · Other",
};
