'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

// Mock data for projects
const mockProjects = [
  { id: 1, title: "E-commerce Website", subject: "Web Development", status: "In Progress" },
  { id: 2, title: "Machine Learning Model for Stock Prediction", subject: "Data Science", status: "Completed" },
  { id: 3, title: "Sustainable Urban Planning Proposal", subject: "Urban Studies", status: "Planning" },
];

export default function Projects() {
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
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Search projects..." 
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="space-y-4">
        {mockProjects.map((project) => (
          <div key={project.id} className="border p-4 rounded-md hover:shadow-md transition duration-300">
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-600">Subject: {project.subject}</p>
            <p className="text-gray-600">Status: {project.status}</p>
            <Link href={`/resources/projects/${project.id}`} className="text-blue-600 hover:underline">
              View Project
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}