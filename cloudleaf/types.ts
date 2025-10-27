
export enum BookStatus {
  Available = 'Available',
  OnLoan = 'On Loan',
  Requested = 'Requested',
}

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  ownerId: number;
  status: BookStatus;
  borrowerId?: number | null;
  loanEndDate?: Date | null;
}

export interface User {
  id: number;
  name: string;
  password: string;
  avatar: string;
  trustScore: number;
  ratings: number[];
}

export interface LoanRequest {
  id: number;
  book: Book;
  requester: User;
  status: 'pending' | 'approved' | 'denied';
}

export interface Transaction {
  id: number;
  book: Book;
  lender: User;
  borrower: User;
  returnDate: Date;
  lenderRated: boolean;
  borrowerRated: boolean;
}