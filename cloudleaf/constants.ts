import { User, Book, BookStatus } from './types';

export const USERS: User[] = [
  { id: 1, name: 'Alice', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=alice', trustScore: 4.8, ratings: [5, 5, 4] },
  { id: 2, name: 'Bob', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=bob', trustScore: 4.5, ratings: [4, 5] },
  { id: 3, name: 'Charlie', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=charlie', trustScore: 4.9, ratings: [5, 5, 5, 4] },
  { id: 4, name: 'Diana', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=diana', trustScore: 4.2, ratings: [4, 4] },
];

export const BOOKS: Book[] = [
  { id: 1, title: 'Moby Dick', author: 'Herman Melville', genre: 'Adventure', ownerId: 2, status: BookStatus.Available },
  { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', ownerId: 1, status: BookStatus.Available },
  { id: 3, title: 'The Adventures of Tom Sawyer', author: 'Mark Twain', genre: 'Adventure', ownerId: 3, status: BookStatus.Available },
  { id: 4, title: 'Frankenstein', author: 'Mary Shelley', genre: 'Gothic', ownerId: 1, status: BookStatus.Available },
  { id: 5, title: 'A Tale of Two Cities', author: 'Charles Dickens', genre: 'Historical', ownerId: 4, status: BookStatus.Available },
  { id: 6, title: 'Dracula', author: 'Bram Stoker', genre: 'Horror', ownerId: 2, status: BookStatus.Available },
  { id: 7, title: 'The Scarlet Letter', author: 'Nathaniel Hawthorne', genre: 'Romance', ownerId: 3, status: BookStatus.Available },
  { id: 8, title: 'War and Peace', author: 'Leo Tolstoy', genre: 'Historical', ownerId: 1, status: BookStatus.OnLoan, borrowerId: 4, loanEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
];