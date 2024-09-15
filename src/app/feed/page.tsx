'use client';

import React, { useState, useRef, useEffect } from "react";
import { Search, ThumbsUp, MessageSquare, Bookmark, Share2, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import dynamic from 'next/dynamic';

const subjects = ["All Subjects", "Mathematics", "Physics", "Computer Science", "Literature", "History"];
const resourceTypes = ["All Types", "Notes", "Assignments", "Projects"];

interface FeedItem {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  avatar: string;
  subject: string;
  type: string;
  likes: number;
  comments: number;
  createdAt: Date;
  files: string[];
}

const CreateNote = dynamic(() => import('../create-note/page'));
const CreateAssignment = dynamic(() => import('../create-assignment/page'));
const CreateProject = dynamic(() => import('../create-project/page'));

const Feed: React.FC = () => {
  const [user] = useAuthState(auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedType, setSelectedType] = useState("All Types");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState<string | null>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    const fetchFeedItems = async () => {
      if (user) {
        try {
          let feedQuery = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc')
          );

          if (selectedSubject !== "All Subjects") {
            feedQuery = query(feedQuery, where('subject', '==', selectedSubject));
          }

          if (selectedType !== "All Types") {
            feedQuery = query(feedQuery, where('type', '==', selectedType));
          }

          const querySnapshot = await getDocs(feedQuery);
          const fetchedFeedItems = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          } as FeedItem));

          setFeedItems(fetchedFeedItems);
        } catch (error) {
          console.error("Error fetching feed items:", error);
        }
      }
    };

    fetchFeedItems();
  }, [user, selectedSubject, selectedType]);

  const renderCreatePostForm = () => {
    switch (selectedPostType) {
      case 'Notes':
        return <CreateNote onClose={() => setSelectedPostType(null)} />;
      case 'Assignments':
        return <CreateAssignment onClose={() => setSelectedPostType(null)} />;
      case 'Projects':
        return <CreateProject onClose={() => setSelectedPostType(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Filters</h2>
            <div className="space-y-2">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue>{selectedSubject}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue>{selectedType}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">#calculus</Badge>
              <Badge variant="secondary">#programming</Badge>
              <Badge variant="secondary">#history</Badge>
              <Badge variant="secondary">#literature</Badge>
            </div>
          </div>
        </aside>
        <main className="flex-1">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Resource Feed</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create a New Post</DialogTitle>
                    <DialogDescription>
                      Choose the type of post you want to create.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-around mt-4">
                    <Button onClick={() => setSelectedPostType('Notes')}>Notes</Button>
                    <Button onClick={() => setSelectedPostType('Assignments')}>Assignment</Button>
                    <Button onClick={() => setSelectedPostType('Projects')}>Project</Button>
                  </div>
                  {renderCreatePostForm()}
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div className="space-y-6">
            {feedItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={item.avatar} alt={item.author || 'Anonymous'} />
                        <AvatarFallback>{item.author && item.author.length > 0 ? item.author[0].toUpperCase() : 'A'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <p className="text-sm text-gray-500">by {item.author || 'Anonymous'}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge>{item.subject}</Badge>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{item.description}</p>
                  {item.files && item.files.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold">Attached files:</p>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {item.files.map((file, index) => (
                          <div key={index} className="relative">
                            {file.endsWith('.pdf') ? (
                              <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
                                <span className="text-black">PDF</span>
                              </div>
                            ) : file.match(/\.(mp4|webm|ogg)$/) ? (
                              <video src={file} className="w-full h-40 object-cover rounded" controls />
                            ) : (
                              <img src={file} alt="Attachment" className="w-full h-40 object-cover rounded" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {item.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {item.comments}
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
        </main>
      </div>
    </div>
  );
};

export default Feed;