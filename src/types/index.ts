// Financial Data Types
export interface FinancialStatement {
  year: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  assets: number;
  liabilities: number;
}

export interface QuarterlyData {
  quarter: string;
  revenue: number;
  expenses: number;
}

export interface FinancialData {
  statements: FinancialStatement[];
  quarterlyData: QuarterlyData[];
  lastUpdated: string;
}

// Claims Data Types
export interface ClaimStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface MonthlyClaimData {
  month: string;
  submitted: number;
  approved: number;
  rejected: number;
}

export interface ClaimsData {
  totalClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  pendingClaims: number;
  averageProcessingTime: number;
  claimsByStatus: ClaimStatus[];
  monthlyData: MonthlyClaimData[];
  lastUpdated: string;
}

// Coverage Data Types
export interface CoverageByType {
  type: string;
  members: number;
  percentage: number;
}

export interface RegionalCoverage {
  region: string;
  members: number;
  percentage: number;
}

export interface CoverageData {
  totalMembers: number;
  activemembers: number;
  coverageRate: number;
  newMembersThisYear: number;
  coverageByType: CoverageByType[];
  regionalCoverage: RegionalCoverage[];
  lastUpdated: string;
}

// Facilities Data Types
export interface Facility {
  id: string;
  name: string;
  type: string;
  level: string;
  region: string;
  accreditationStatus: string;
  accreditationDate: string;
  expiryDate: string;
  beds?: number;
  services: string[];
}

export interface FacilityByType {
  type: string;
  count: number;
}

export interface FacilitiesData {
  totalFacilities: number;
  hospitals: number;
  clinics: number;
  facilitiesByType: FacilityByType[];
  facilities: Facility[];
  lastUpdated: string;
}

// Procurement Data Types
export interface Contract {
  id: string;
  contractNumber: string;
  description: string;
  contractor: string;
  amount: number;
  dateAwarded: string;
  status: string;
  category: string;
}

export interface ProcurementByCategory {
  category: string;
  amount: number;
  count: number;
}

export interface ProcurementData {
  totalContracts: number;
  totalValue: number;
  averageContractValue: number;
  procurementByCategory: ProcurementByCategory[];
  contracts: Contract[];
  lastUpdated: string;
}

// Governance Data Types
export interface BoardMeeting {
  id: string;
  date: string;
  title: string;
  summary: string;
  attendees: number;
  documentUrl?: string;
}

export interface AnnualReport {
  year: number;
  title: string;
  summary: string;
  documentUrl: string;
  publishedDate: string;
}

export interface ExecutiveCompensation {
  position: string;
  salary: number;
  benefits: number;
  total: number;
}

export interface GovernanceData {
  boardMeetings: BoardMeeting[];
  annualReports: AnnualReport[];
  executiveCompensation: ExecutiveCompensation[];
  lastUpdated: string;
}

// Engagement Data Types
export interface ComplaintStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface PolicyUpdate {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  documentUrl?: string;
}

export interface EngagementData {
  totalComplaints: number;
  resolvedComplaints: number;
  averageResolutionTime: number;
  satisfactionRate: number;
  complaintsByStatus: ComplaintStatus[];
  policyUpdates: PolicyUpdate[];
  lastUpdated: string;
}

// KPI Types
export interface KPIData {
  title: string;
  value: string;
  description: string;
  trend: number;
  icon: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

// Common Types
export interface FilterOption {
  label: string;
  value: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}
