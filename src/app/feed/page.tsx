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
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const subjects = ["All Subjects", "Mathematics", "Physics", "Computer Science", "Literature", "History"];
const resourceTypes = ["All Types", "Notes", "Assignments", "Projects", "Study Guides"];

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

const Feed: React.FC = () => {
  const [user] = useAuthState(auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedType, setSelectedType] = useState("All Types");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostSubject, setNewPostSubject] = useState(subjects[1]);
  const [newPostType, setNewPostType] = useState(resourceTypes[1]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostFiles, setNewPostFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FeedItem));
      setFeedItems(posts);
    });

    return () => unsubscribe();
  }, []);

  const PreviewPost: React.FC = () => (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user?.photoURL || "/placeholder.svg?height=40&width=40"} alt={user?.displayName || "User"} />
              <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{newPostTitle || "Your Post Title"}</CardTitle>
              <p className="text-sm text-black">by {user?.displayName || "You"}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge>{newPostSubject}</Badge>
            <Badge variant="outline">{newPostType}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-black">{newPostDescription || "Your post description will appear here."}</p>
        {newPostFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-black">Attached files:</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {newPostFiles.map((file, index) => (
                <div key={index} className="relative">
                  {file.type.startsWith('image/') && (
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-40 object-cover rounded" />
                  )}
                  {file.type === 'application/pdf' && (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-black">PDF: {file.name}</span>
                    </div>
                  )}
                  {file.type.startsWith('video/') && (
                    <video src={URL.createObjectURL(file)} className="w-full h-40 object-cover rounded" controls />
                  )}
                  <button
                    className="absolute top-1 right-1 bg-white rounded-full p-1"
                    onClick={() => {
                      setNewPostFiles(newPostFiles.filter((_, i) => i !== index));
                    }}
                  >
                    <X size={16} />
                  </button>
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
            0
          </Button>
          <Button variant="ghost" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            0
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
  );

  const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    try {
      const fileUrls = await Promise.all(newPostFiles.map(uploadFile));

      const newPost = {
        title: newPostTitle,
        description: newPostDescription,
        subject: newPostSubject,
        type: newPostType,
        author: user.displayName || 'Anonymous',
        authorId: user.uid,
        avatar: user.photoURL || '/placeholder.svg?height=40&width=40',
        likes: 0,
        comments: 0,
        createdAt: new Date(),
        files: fileUrls.length > 0 ? fileUrls : [], // Initialize as empty array if no files
      };

      await addDoc(collection(db, 'posts'), newPost);

      setIsCreatePostOpen(false);
      // Reset form fields
      setNewPostTitle("");
      setNewPostDescription("");
      setNewPostFiles([]);
      setNewPostSubject(subjects[1]);
      setNewPostType(resourceTypes[1]);
    } catch (error) {
      console.error("Error creating post:", error);
      // Show an error message to the user
      alert("An error occurred while creating the post. Please try again.");
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error; // Re-throw the error to be caught in handleCreatePost
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewPostFiles(Array.from(event.target.files));
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
              <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full bg-white text-black">
                  <DialogHeader>
                    <DialogTitle>Create a New Post</DialogTitle>
                    <DialogDescription>
                      Share your knowledge with the EduShare community. Fill out the details below to create a new post.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-6">
                    <form onSubmit={handleCreatePost}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={newPostTitle}
                            onChange={(e) => setNewPostTitle(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={newPostDescription}
                            onChange={(e) => setNewPostDescription(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="subject" className="text-right">
                            Subject
                          </Label>
                          <Select value={newPostSubject} onValueChange={setNewPostSubject}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue>{newPostSubject}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.slice(1).map((subject) => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="type" className="text-right">
                            Type
                          </Label>
                          <Select value={newPostType} onValueChange={setNewPostType}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue>{newPostType}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {resourceTypes.slice(1).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="files" className="text-right">
                            Files
                          </Label>
                          <div className="col-span-3">
                            <Input
                              id="files"
                              type="file"
                              multiple
                              accept="image/*,application/pdf,video/*"
                              onChange={handleFileUpload}
                              ref={fileInputRef}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Files
                            </Button>
                            {newPostFiles.length > 0 && (
                              <p className="mt-2 text-sm text-gray-500">
                                {newPostFiles.length} file(s) selected
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create Post</Button>
                      </DialogFooter>
                    </form>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Preview</h3>
                      <PreviewPost />
                    </div>
                  </div>
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