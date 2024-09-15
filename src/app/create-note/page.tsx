'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const subjects = ["Mathematics", "Physics", "Computer Science", "Literature", "History"];

export default function CreateNotePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      let fileUrl = '';
      if (file) {
        const storageRef = ref(storage, `notes/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      }

      const newNote = {
        title,
        description,
        subject,
        author: user.displayName || 'Anonymous',
        authorId: user.uid,
        avatar: user.photoURL || '/default-avatar.png',
        type: 'Notes',
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        fileUrl,
      };

      await addDoc(collection(db, 'posts'), newNote);
      router.push('/notes');
    } catch (error) {
      console.error("Error creating note:", error);
      alert("An error occurred while creating the note. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue>{subject}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file">File (optional)</Label>
              <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <Button type="submit">Create Note</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}