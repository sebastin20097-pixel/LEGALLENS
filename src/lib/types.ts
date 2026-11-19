export interface ComplianceCheck {
  label: string;
  detail: string;
}

export interface Scan {
  id: string;
  image_name: string;
  thumbnail: string | null;
  product_name: string;
  manufacturer: string;
  ingredients: string;
  weight: string;
  expiry_date: string;
  compliance_score: number;
  passed_checks: ComplianceCheck[];
  missing_information: string[];
  recommendations: string[];
  created_at: string;
}

export type ScanDraft = Omit<Scan, 'id' | 'created_at'>;
