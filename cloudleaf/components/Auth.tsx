
import React, { useState } from 'react';
import { BookIcon } from './Icons';

interface AuthProps {
    onLogin: (name: string, password: string) => boolean;
    onSignUp: (name: string, password: string) => boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignUp }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim()) {
            setError('Name cannot be empty.');
            return;
        }
        if (!password) {
            setError('Password cannot be empty.');
            return;
        }

        let success = false;
        if (isLoginView) {
            success = onLogin(name, password);
            if (!success) {
                setError('Login failed. Invalid name or password.');
            }
        } else {
            success = onSignUp(name, password);
            if (!success) {
                setError('Sign up failed. User already exists.');
            }
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setName('');
        setPassword('');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center space-x-3 mb-8">
                    <BookIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">CloudLeaf</h1>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                        {isLoginView ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-200"
                                placeholder="e.g. Alice"
                                required
                                autoFocus
                            />
                        </div>

                         <div className="mb-4">
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                        >
                            {isLoginView ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <button onClick={toggleView} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                            {isLoginView ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;