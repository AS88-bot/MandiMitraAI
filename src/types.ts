export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  preferredLanguage: 'English' | 'Telugu' | 'Hindi';
  location?: string;
  createdAt: string;
}

export interface UploadResult {
  id: string;
  userId: string;
  imageUrl?: string;
  extractedText: string;
  summary?: string;
  translation?: string;
  language?: string;
  productName?: string;
  usageInstructions?: string;
  safetyWarnings?: string;
  createdAt: string;
}

export interface FarmerQuery {
  id: string;
  userId: string;
  query: string;
  response: string;
  type: 'text' | 'voice';
  createdAt: string;
}

export interface MarketPrice {
  id: number;
  crop: string;
  mandi: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  referencePrice: number;
}
