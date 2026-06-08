export type ReportStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: ReportStatus;
  photoUrl?: string;
  adminNote?: string;
  createdAt: string;
  userId: string;
  user?: {
    name: string;
    email: string;
  };
}