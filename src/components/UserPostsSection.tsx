import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User, MessageSquare, Heart, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  category: string;
  likes: number;
  comments: number;
}

// Mock user posts - in real app this would come from your database
const mockUserPosts: BlogPost[] = [
  {
    id: "1",
    title: "My Journey into Web Development",
    content: "Starting as a beginner, I want to share the key insights I've learned about modern web development and the tools that made the biggest difference...",
    author: "Current User",
    date: new Date("2024-01-20"),
    category: "Web Development",
    likes: 15,
    comments: 3
  },
  {
    id: "2", 
    title: "Network Security Best Practices I Learned",
    content: "After working through several security challenges, here are the most important network security practices every business should implement...",
    author: "Current User",
    date: new Date("2024-01-18"),
    category: "Network Security", 
    likes: 22,
    comments: 7
  }
];

const UserPostsSection = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            My Recent Posts
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Welcome back! Here are your latest contributions to our tech community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {mockUserPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-border">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date.toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed mb-4">
                  {post.content}
                </CardDescription>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex space-x-4">
                    <span className="flex items-center text-sm text-muted-foreground">
                      <Heart className="w-4 h-4 mr-1" />
                      {post.likes}
                    </span>
                    <span className="flex items-center text-sm text-muted-foreground">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {post.comments}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View All My Posts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UserPostsSection;