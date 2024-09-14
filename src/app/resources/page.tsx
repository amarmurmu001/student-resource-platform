'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

// This is a mock data array. In a real application, you would fetch this data from your backend.
const mockResources = [
  { id: 1, title: "Introduction to React", subject: "Web Development", type: "PDF" },
  { id: 2, title: "Advanced Calculus Notes", subject: "Mathematics", type: "Document" },
  { id: 3, title: "History of Ancient Rome", subject: "History", type: "Presentation" },
];

export default function Resources() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Search resources..." 
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="space-y-4">
        {mockResources.map((resource) => (
          <div key={resource.id} className="border p-4 rounded-md hover:shadow-md transition duration-300">
            <h2 className="text-xl font-semibold">{resource.title}</h2>
            <p className="text-gray-600">Subject: {resource.subject}</p>
            <p className="text-gray-600">Type: {resource.type}</p>
            <Link href={`/resources/${resource.id}`} className="text-blue-600 hover:underline">
              View Resource
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}