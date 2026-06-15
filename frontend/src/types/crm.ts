// ─────────────────────────────────────────────────────────────────────────────
// CRM Types
// ─────────────────────────────────────────────────────────────────────────────

export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type PointEventType =
  | 'order_earned'    // points from placing order
  | 'order_redeemed'  // points spent on order
  | 'referral'        // referred a new user
  | 'birthday'        // birthday bonus
  | 'signup'          // welcome points
  | 'adjustment'      // manual admin adjustment
  | 'expired'         // points expired
  | 'coupon';         // redeemed for coupon

export interface LoyaltyConfig {
  pointsPerRupee:       number;   // e.g. 1 point per ₹10
  rupeeValuePerPoint:   number;   // e.g. ₹0.50 per point
  minRedeemPoints:      number;
  pointExpiryDays:      number;
  tiers: Record<MembershipTier, { minPoints: number; discount: number; label: string; color: string }>;
}

export interface LoyaltyPoint {
  _id:         string;
  user:        string;
  type:        PointEventType;
  points:      number;           // positive = earned, negative = spent/expired
  balance:     number;           // running balance after event
  reference?:  string;           // order ID, referral code, etc.
  description: string;
  expiresAt?:  string;
  createdAt:   string;
}

export interface Membership {
  _id:         string;
  user:        string;
  tier:        MembershipTier;
  startDate:   string;
  endDate:     string;
  isActive:    boolean;
  benefits:    string[];
  price:       number;
  autoRenew:   boolean;
  createdAt:   string;
}

export interface CustomerProfile {
  _id:            string;
  name:           string;
  email:          string;
  phone?:         string;
  avatar?:        string;
  role:           string;
  isVerified:     boolean;
  isBlocked:      boolean;
  joinedAt:       string;
  lastActive?:    string;
  totalOrders:    number;
  totalSpent:     number;
  avgOrderValue:  number;
  loyaltyPoints:  number;
  loyaltyTier:    MembershipTier;
  membership?:    Membership;
  favoriteItems:  { name: string; orderCount: number }[];
  favoriteCategory: string;
  orderFrequency: number;         // avg days between orders
  addresses:      any[];
  birthday?:      string;
  referralCode?:  string;
  referredBy?:    string;
  referralCount:  number;
  notes?:         string;         // admin notes
}

export interface ReviewAnalytics {
  totalReviews:    number;
  avgRating:       number;
  distribution:    Record<1|2|3|4|5, number>;
  recentReviews:   any[];
  topRatedItems:   { name: string; avgRating: number; count: number }[];
  flaggedCount:    number;
}

export interface CRMStats {
  totalCustomers:    number;
  newThisMonth:      number;
  returningRate:     number;
  avgLifetimeValue:  number;
  avgOrderFrequency: number;
  totalLoyaltyPoints: number;
  pointsRedeemed:    number;
  membershipCount:   number;
  tierBreakdown:     Record<MembershipTier, number>;
  topSpenders:       CustomerProfile[];
}
