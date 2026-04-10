import { GalaStatus } from '../../../../Shared/Enums';

export interface EveningItem {
  time: string;
  title: string;
  description: string;
}

export interface Grant {
  // Define grant properties if needed, currently empty in the example
  [key: string]: unknown;
}

export interface GalaEvent {
  id: string;
  name: string;
  about: string;
  coverImageUrl: string;
  status: GalaStatus;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  expectedAttendees: number;
  totalGalaValue: number;
  estimatedTicketPrice: number | null;
  entryFee: number;
  ticketPrice: number;
  publishedAt: string;
  blockchainTransactionHash: string;
  organiserWalletAddress: string;
  canEditTicketPricingInputs: boolean;
  appliedCount: number;
  allWinnersDecided: boolean;
  winnerDecisionMessage: string;
  isSaved: boolean;
  isRegistered: boolean;
  eveningItems: EveningItem[];
  grants: Grant[];
}

export interface GalaApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
  notificationCount: number;
}

export interface PaginatedData<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PurchaseTicketPayload {
  galaId: string;
  transactionHash: string;
  walletAddress: string;
}

export type SaveGalaPayload = string;

export type GalasResponse = GalaApiResponse<PaginatedData<GalaEvent>>;
export type GalaDetailsResponse = GalaApiResponse<GalaEvent>;
