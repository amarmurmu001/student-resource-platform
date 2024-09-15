'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bookmark, MessageSquare, Share2, ThumbsUp } from "lucide-react";

interface Note {
  id: string;
  title: string;
  author: string;
  avatar: string;
  subject: string;
  description: string;
  likes: number;
  comments: number;
  image?: string;
  video?: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesCollection = collection(db, 'notes');
        const notesSnapshot = await getDocs(notesCollection);
        const notesList = notesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Note));
        setNotes(notesList);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading notes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Study Notes</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        <Button className="sm:w-auto">
          Upload Notes
        </Button>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-width:300px]">
        {notes.map((note) => (
          <Card key={note.id} className="mb-6 break-inside-avoid">
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
              <p className="text-sm text-muted-foreground mb-4">{note.description}</p>
              {note.image && (
                <div className="relative h-48 mb-4">
                  <img src={note.image} alt={note.title} className="absolute inset-0 w-full h-full object-cover rounded-md" />
                </div>
              )}
              {note.video && (
                <div className="relative h-48 mb-4">
                  <video src={note.video} controls className="absolute inset-0 w-full h-full object-cover rounded-md">
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
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