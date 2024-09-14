'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

// Mock data for notes
const mockNotes = [
  { id: 1, title: "Introduction to React Hooks", subject: "Web Development", uploadDate: "2023-03-15" },
  { id: 2, title: "Linear Algebra Fundamentals", subject: "Mathematics", uploadDate: "2023-03-10" },
  { id: 3, title: "Ancient Greek Philosophy", subject: "Philosophy", uploadDate: "2023-03-05" },
];

export default function Notes() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Search notes..." 
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="space-y-4">
        {mockNotes.map((note) => (
          <div key={note.id} className="border p-4 rounded-md hover:shadow-md transition duration-300">
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="text-gray-600">Subject: {note.subject}</p>
            <p className="text-gray-600">Uploaded: {note.uploadDate}</p>
            <Link href={`/resources/notes/${note.id}`} className="text-blue-600 hover:underline">
              View Note
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}