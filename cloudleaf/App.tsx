
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User, Book, BookStatus, LoanRequest, Transaction } from './types';
import { USERS, BOOKS } from './constants';
import { BookIcon, StarIcon, PlusIcon, UserGroupIcon, SearchIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from './components/Icons';
import Auth from './components/Auth';


// --- Child Components ---

interface BookCardProps {
  book: Book;
  currentUser: User;
  onBorrow: (book: Book) => void;
  onReturn: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, currentUser, onBorrow, onReturn }) => {
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState('');
  const isOwner = book.ownerId === currentUser.id;
  const isBorrower = book.borrowerId === currentUser.id;

  const toggleSummary = () => {
    if (!summary && !showSummary) {
      generateSummary();
    }
    setShowSummary(!showSummary);
  }

  const generateSummary = async () => {
    setIsLoadingSummary(true);
    setError('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Provide a concise, one-paragraph summary for the public domain book "${book.title}" by ${book.author}.`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setSummary(response.text);
    } catch (err) {
      console.error("Error generating summary:", err);
      setError("Could not generate summary.");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const loanEndDate = book.loanEndDate ? new Date(book.loanEndDate) : null;
  const daysLeft = loanEndDate ? Math.ceil((loanEndDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{book.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {book.author}</p>
        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-200 dark:text-blue-800">{book.genre}</span>
        {isOwner && book.status === BookStatus.OnLoan && (
           <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 flex items-center">
             <ClockIcon className="w-4 h-4 mr-1" /> On loan, returns in {daysLeft} day(s)
           </div>
        )}
        {isBorrower && (
          <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
            <ClockIcon className="w-4 h-4 mr-1" /> Returns in {daysLeft} day(s)
          </div>
        )}
      </div>
       {showSummary && summary && <p className="p-4 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">{summary}</p>}
      {showSummary && isLoadingSummary && <div className="p-4 text-center"><ArrowPathIcon className="w-6 h-6 animate-spin mx-auto text-blue-500" /></div>}
      {showSummary && error && <p className="p-4 text-sm text-red-500">{error}</p>}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 mt-auto">
        <div className="flex justify-between items-center">
          <button onClick={toggleSummary} disabled={isLoadingSummary} className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {showSummary ? 'Hide Summary' : 'AI Summary'}
          </button>
          {!isOwner && book.status === BookStatus.Available && <button onClick={() => onBorrow(book)} className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full hover:bg-green-600">Borrow</button>}
          {isBorrower && <button onClick={() => onReturn(book)} className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600">Return Now</button>}
          {isOwner && book.status !== BookStatus.OnLoan && <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Your Book</span>}
        </div>
      </div>
    </div>
  );
};


interface AddBookModalProps {
    onClose: () => void;
    onAddBook: (title: string, author: string, genre: string) => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAddBook }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && author && genre) {
            onAddBook(title, author, genre);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add a New Book</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Author</label>
                        <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" required />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Genre</label>
                        <input type="text" id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200" required />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Book</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
  const [users, setUsers] = useState<User[]>(USERS);
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'marketplace'>('dashboard');
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['The Great Gatsby', '1984']);
  const [wishlistMatches, setWishlistMatches] = useState<Book[]>([]);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  const myBooks = useMemo(() => currentUser ? books.filter(b => b.ownerId === currentUser.id) : [], [books, currentUser]);
  const borrowedBooks = useMemo(() => currentUser ? books.filter(b => b.borrowerId === currentUser.id) : [], [books, currentUser]);
  const marketplaceBooks = useMemo(() => currentUser ? books.filter(b => b.ownerId !== currentUser.id && b.status === BookStatus.Available) : [], [books, currentUser]);

  const handleLogin = (name: string, password: string): boolean => {
    const user = users.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleSignUp = (name: string, password: string): boolean => {
    const userExists = users.some(u => u.name.toLowerCase() === name.toLowerCase());
    if (userExists) {
      return false;
    }
    const newUser: User = {
      id: users.length + 1,
      name: name,
      password: password,
      avatar: `https://i.pravatar.cc/150?u=${name.toLowerCase()}`,
      trustScore: 4.0, // Starting trust score
      ratings: [],
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };
  
  const handleLogout = () => {
      setCurrentUser(null);
  }

  const handleBorrowRequest = useCallback((book: Book) => {
    if (!currentUser || book.ownerId === currentUser.id) return;
    const owner = users.find(u => u.id === book.ownerId);
    if (!owner) return;

    const newRequest: LoanRequest = {
      id: Date.now(),
      book,
      requester: currentUser,
      status: 'pending',
    };
    // In a real app, this would be sent to the owner. Here, we'll auto-approve for simulation.
    console.log(`Requesting to borrow "${book.title}" from ${owner.name}`);
    handleRequestResponse(newRequest, true); // Auto-approve
    alert(`Your request for "${book.title}" has been sent and auto-approved for this demo!`);
  }, [currentUser, users]);

  const handleRequestResponse = useCallback((request: LoanRequest, approved: boolean) => {
    setLoanRequests(prev => prev.filter(r => r.id !== request.id));
    if (approved) {
      setBooks(prevBooks => prevBooks.map(b => {
        if (b.id === request.book.id) {
          return {
            ...b,
            status: BookStatus.OnLoan,
            borrowerId: request.requester.id,
            loanEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day loan
          };
        }
        return b;
      }));
    }
  }, []);

  const handleReturn = useCallback((bookToReturn: Book) => {
    if (!currentUser) return;
    const lender = users.find(u => u.id === bookToReturn.ownerId);
    if (!lender) return;

    const newTransaction: Transaction = {
        id: Date.now(),
        book: bookToReturn,
        lender,
        borrower: currentUser,
        returnDate: new Date(),
        lenderRated: false,
        borrowerRated: false
    };
    setTransactions(prev => [...prev, newTransaction]);

    setBooks(prevBooks => prevBooks.map(b => {
      if (b.id === bookToReturn.id) {
        const { borrowerId, loanEndDate, ...rest } = b;
        return {
          ...rest,
          status: BookStatus.Available,
          borrowerId: null,
          loanEndDate: null,
        };
      }
      return b;
    }));
  }, [currentUser, users]);

  const handleAddBook = (title: string, author: string, genre: string) => {
        if (!currentUser) return;
        const newBook: Book = {
            id: books.length + 1,
            title,
            author,
            genre,
            ownerId: currentUser.id,
            status: BookStatus.Available,
        };
        setBooks(prev => [...prev, newBook]);
    };

  // Effect for checking expired loans
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      books.forEach(book => {
        if (book.status === BookStatus.OnLoan && book.loanEndDate && new Date(book.loanEndDate) < now) {
          console.log(`Loan for "${book.title}" expired. Auto-returning.`);
          handleReturn(book);
        }
      });
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [books, handleReturn]);

  // Effect for wishlist matching
  useEffect(() => {
    if (!currentUser) return;
    const matches = books.filter(book => 
      book.status === BookStatus.Available &&
      book.ownerId !== currentUser.id &&
      wishlist.some(wish => book.title.toLowerCase().includes(wish.toLowerCase()))
    );
    setWishlistMatches(matches);
  }, [books, wishlist, currentUser]);
  
  if (!currentUser) {
    return <Auth onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
        {isAddBookModalOpen && <AddBookModal onClose={() => setIsAddBookModalOpen(false)} onAddBook={handleAddBook} />}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <BookIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">CloudLeaf</h1>
            </div>
            <div className="flex items-center space-x-6">
                 <nav className="hidden md:flex space-x-6">
                    <button onClick={() => setView('dashboard')} className={`text-lg font-medium ${view === 'dashboard' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>Dashboard</button>
                    <button onClick={() => setView('marketplace')} className={`text-lg font-medium ${view === 'marketplace' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>Marketplace</button>
                </nav>
              <div className="flex items-center space-x-3">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-semibold dark:text-white">{currentUser.name}</div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{currentUser.trustScore} Trust Score</span>
                  </div>
                </div>
                 <button onClick={handleLogout} className="ml-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {view === 'dashboard' && (
          <div className="space-y-8">
            {/* Wishlist Matches */}
            {wishlistMatches.length > 0 && (
                 <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">Wishlist Matches Found!</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wishlistMatches.slice(0, 3).map(book => (
                            <div key={book.id} className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{book.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">by {book.author}</p>
                                </div>
                                <button onClick={() => {
                                    setView('marketplace');
                                    // In a real app you might want to scroll to the book
                                }} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* My Books Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Books ({myBooks.length})</h2>
                <button onClick={() => setIsAddBookModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Book</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {myBooks.map(book => <BookCard key={book.id} book={book} currentUser={currentUser} onBorrow={handleBorrowRequest} onReturn={handleReturn} />)}
              </div>
            </div>

            {/* Borrowed Books Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Borrowed Books ({borrowedBooks.length})</h2>
              {borrowedBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {borrowedBooks.map(book => <BookCard key={book.id} book={book} currentUser={currentUser} onBorrow={handleBorrowRequest} onReturn={handleReturn} />)}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">You haven't borrowed any books yet.</p>
              )}
            </div>

             {/* Wishlist Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <ul className="space-y-2">
                        {wishlist.map((title, index) => (
                             <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                               <span className="text-gray-700 dark:text-gray-300">{title}</span>
                               <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm">Remove</button>
                           </li>
                        ))}
                    </ul>
                </div>
            </div>
          </div>
        )}

        {view === 'marketplace' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Marketplace</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {marketplaceBooks.map(book => <BookCard key={book.id} book={book} currentUser={currentUser} onBorrow={handleBorrowRequest} onReturn={handleReturn} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}