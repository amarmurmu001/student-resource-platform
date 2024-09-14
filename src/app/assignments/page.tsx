'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

// Mock data for assignments
const mockAssignments = [
  { id: 1, title: "React Component Library", subject: "Web Development", dueDate: "2023-04-15" },
  { id: 2, title: "Differential Equations Problem Set", subject: "Mathematics", dueDate: "2023-04-10" },
  { id: 3, title: "Essay on Plato's Republic", subject: "Philosophy", dueDate: "2023-04-20" },
];

export default function Assignments() {
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
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Search assignments..." 
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="space-y-4">
        {mockAssignments.map((assignment) => (
          <div key={assignment.id} className="border p-4 rounded-md hover:shadow-md transition duration-300">
            <h2 className="text-xl font-semibold">{assignment.title}</h2>
            <p className="text-gray-600">Subject: {assignment.subject}</p>
            <p className="text-gray-600">Due Date: {assignment.dueDate}</p>
            <Link href={`/resources/assignments/${assignment.id}`} className="text-blue-600 hover:underline">
              View Assignment
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}