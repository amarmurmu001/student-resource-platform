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

interface Project {
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

export default function ProjectsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        setIsLoading(true);
        try {
          let projectsQuery = query(
            collection(db, 'posts'),
            where('type', '==', 'Project'),
            orderBy('createdAt', 'desc')
          );

          if (selectedSubject !== "All Subjects") {
            projectsQuery = query(projectsQuery, where('subject', '==', selectedSubject));
          }

          const querySnapshot = await getDocs(projectsQuery);
          const fetchedProjects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          } as Project));

          setProjects(fetchedProjects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();
  }, [user, selectedSubject]);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search projects..."
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
        <Button className="md:w-1/4" onClick={() => router.push('/create-project')}>
          Create Project
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={project.avatar} alt={project.author} />
                  <AvatarFallback>{project.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {project.author}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge className="mb-2">{project.subject}</Badge>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  {project.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  {project.comments}
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