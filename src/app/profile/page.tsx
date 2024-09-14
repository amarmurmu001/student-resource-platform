'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (user) {
        await updateProfile(user, { displayName });
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">User Profile</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block mb-2 text-sm font-medium">Display Name</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border rounded-md"
            disabled={!isEditing}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            className="w-full p-2 border rounded-md bg-gray-100"
            disabled
          />
        </div>
        {isEditing ? (
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
            Save Changes
          </button>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)} className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300">
            Edit Profile
          </button>
        )}
      </form>
      {isEditing && (
        <button onClick={() => setIsEditing(false)} className="w-full mt-4 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300">
          Cancel
        </button>
      )}
    </div>
  );
}