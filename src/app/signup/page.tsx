'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const SignupPage = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && !loading) {
      router.push('/feed');
    }
  }, [user, loading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        username: email.split('@')[0], // You might want to let users choose their username
        email: email,
        avatar: userCredential.user.photoURL || '/default-avatar.png',
        bio: '',
        stats: {
          resources: 0,
          followers: 0,
          following: 0,
        },
      });

      router.push('/feed');
    } catch (error) {
      setError('Failed to create an account.');
      console.error(error);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const displayName = user.displayName || name || user.email?.split('@')[0] || 'User';
      
      if (!user.displayName) {
        await updateProfile(user, { displayName: displayName });
      }

      // Create or update user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: displayName,
        username: user.email?.split('@')[0] || 'user',
        email: user.email,
        avatar: user.photoURL || '/default-avatar.png',
        bio: '',
        stats: {
          resources: 0,
          followers: 0,
          following: 0,
        },
      }, { merge: true });

      router.push('/feed');
    } catch (error) {
      setError('Failed to sign up with Google.');
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium">Full Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
          Sign Up
        </button>
      </form>
      <button onClick={handleGoogleSignup} className="w-full mt-4 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition duration-300">
        Sign Up with Google
      </button>
      <p className="mt-4 text-center">
        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;