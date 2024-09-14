'use client';

import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import CreatePost from '../components/CreatePost';
import Link from 'next/link';
import Image from 'next/image';

const Feed: React.FC = () => {
  const [user] = useAuthState(auth);

  // Mock data for feed items
  const feedItems = [
    { id: 1, type: 'note', title: 'Introduction to React Hooks', author: 'John Doe', date: '2023-03-15', likes: 15, comments: 3 },
    { id: 2, type: 'assignment', title: 'Linear Algebra Problem Set', author: 'Jane Smith', date: '2023-03-14', likes: 8, comments: 1 },
    { id: 3, type: 'project', title: 'E-commerce Website', author: 'Bob Johnson', date: '2023-03-13', likes: 22, comments: 7 },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 sticky top-4">
              <div className="flex items-center mb-6">
                <Image
                  src={user?.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.displayName || "User"}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/notes" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"><span className="mr-2">📝</span>My Notes</Link></li>
                <li><Link href="/assignments" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"><span className="mr-2">📚</span>My Assignments</Link></li>
                <li><Link href="/projects" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"><span className="mr-2">🏗️</span>My Projects</Link></li>
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:w-3/4">
            <CreatePost />
            <div className="space-y-6">
              {feedItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition duration-300 hover:shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    by {item.author} on {item.date}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link href={`/${item.type}s/${item.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      View {item.type}
                    </Link>
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        {item.likes}
                      </span>
                      <span className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        {item.comments}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;