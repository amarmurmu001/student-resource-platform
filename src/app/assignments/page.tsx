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

interface Assignment {
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
  dueDate: Date;
}

export default function AssignmentsPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (user) {
        setIsLoading(true);
        try {
          let assignmentsQuery = query(
            collection(db, 'posts'),
            where('type', '==', 'Assignment'),
            orderBy('createdAt', 'desc')
          );

          if (selectedSubject !== "All Subjects") {
            assignmentsQuery = query(assignmentsQuery, where('subject', '==', selectedSubject));
          }

          const querySnapshot = await getDocs(assignmentsQuery);
          const fetchedAssignments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            dueDate: doc.data().dueDate.toDate(),
          } as Assignment));

          setAssignments(fetchedAssignments);
        } catch (error) {
          console.error("Error fetching assignments:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAssignments();
  }, [user, selectedSubject]);

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Assignments</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search assignments..."
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
        <Button className="md:w-1/4" onClick={() => router.push('/create-assignment')}>
          Create Assignment
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={assignment.avatar} alt={assignment.author} />
                  <AvatarFallback>{assignment.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {assignment.author}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge className="mb-2">{assignment.subject}</Badge>
              <p className="text-sm text-muted-foreground">{assignment.description}</p>
              <p className="text-sm font-semibold mt-2">Due: {assignment.dueDate.toLocaleDateString()}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  {assignment.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  {assignment.comments}
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