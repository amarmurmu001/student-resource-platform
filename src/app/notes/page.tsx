'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MessageSquare, Share2, ThumbsUp } from "lucide-react";

const subjects = ["All Subjects", "Mathematics", "Physics", "Computer Science", "Literature", "History"];

interface Note {
  id: string;
  title: string;
  author: string;
  authorId: string;
  avatar: string;
  subject: string;
  description: string;
  likes: number;
  comments: number;
  createdAt: Date;
}

export default function NotesPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (user) {
        setIsLoading(true);
        try {
          let notesQuery = query(
            collection(db, 'posts'),
            where('type', '==', 'Notes'),
            orderBy('createdAt', 'desc')
          );

          if (selectedSubject !== "All Subjects") {
            notesQuery = query(notesQuery, where('subject', '==', selectedSubject));
          }

          const querySnapshot = await getDocs(notesQuery);
          const fetchedNotes = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          } as Note));

          setNotes(fetchedNotes);
        } catch (error) {
          console.error("Error fetching notes:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNotes();
  }, [user, selectedSubject]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Study Notes</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/2"
        />
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue>{selectedSubject}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="md:w-1/4" onClick={() => router.push('/create-note')}>
          Upload Notes
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map((note) => (
          <Card key={note.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={note.avatar} alt={note.author} />
                  <AvatarFallback>{note.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {note.author}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge className="mb-2">{note.subject}</Badge>
              <p className="text-sm text-muted-foreground">{note.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  {note.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  {note.comments}
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}