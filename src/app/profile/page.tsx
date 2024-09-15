'use client';

import { useState, useEffect } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, MessageSquare, ThumbsUp, Users, Bookmark, Share2, Edit, Settings, Loader2 } from "lucide-react";

interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  stats: {
    resources: number;
    followers: number;
    following: number;
  };
}

interface UserResource {
  id: string;
  title: string;
  description: string;
  type: string;
  subject: string;
  likes: number;
  comments: number;
}

interface Achievement {
  name: string;
  description: string;
  progress: number;
}

export default function ProfilePage() {
  const [user, authLoading] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState("resources");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userResources, setUserResources] = useState<UserResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          setLoading(true);
          setError(null);

          // Fetch user profile from Firestore
          const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
          if (!userDoc.empty) {
            const userData = userDoc.docs[0].data() as UserProfile;
            setUserProfile(userData);
          } else {
            throw new Error("User profile not found");
          }

          // Fetch user resources from Firestore
          const resourcesQuery = query(collection(db, 'posts'), where('authorId', '==', user.uid));
          const resourcesDocs = await getDocs(resourcesQuery);
          const resources = resourcesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserResource));
          setUserResources(resources);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (!authLoading) {
      fetchUserProfile();
    }
  }, [user, authLoading]);

  const achievements: Achievement[] = [
    { name: "Resource Creator", description: "Shared 10+ educational resources", progress: 100 },
    { name: "Engagement Master", description: "Received 100+ likes on resources", progress: 75 },
    { name: "Collaborative Learner", description: "Commented on 50+ resources", progress: 60 },
  ];

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No user found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
              <CardDescription>@{userProfile.username}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{userProfile.bio}</p>
          <div className="flex justify-between mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{userProfile.stats.resources}</p>
              <p className="text-sm text-muted-foreground">Resources</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userProfile.stats.followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userProfile.stats.following}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="resources">
          <div className="space-y-4 mt-4">
            {userResources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Badge>{resource.subject}</Badge>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        {resource.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {resource.comments}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="achievements">
          <div className="space-y-4 mt-4">
            {achievements.map((achievement, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{achievement.name}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={achievement.progress} className="w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="activity">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Shared a new study guide: "Advanced JavaScript Concepts"</span>
                </li>
                <li className="flex items-center">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  <span>Liked "Introduction to Machine Learning" by John Doe</span>
                </li>
                <li className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Commented on "Calculus Made Easy" by Jane Smith</span>
                </li>
                <li className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Followed 3 new users</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}