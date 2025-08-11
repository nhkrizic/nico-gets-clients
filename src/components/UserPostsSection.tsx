import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User, MessageSquare, Heart, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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

// Recent community posts - in real app this would come from your database
const mockRecentPosts: BlogPost[] = [
  {
    id: "1",
    title: "Top 10 Web Development Trends in 2024",
    content: "Discover the latest trends in web development that are shaping the digital landscape. From AI integration to advanced CSS features, here's what every developer should know...",
    author: "Nico",
    date: new Date("2024-01-15"),
    category: "Web Development",
    likes: 24,
    comments: 8
  },
  {
    id: "2",
    title: "How to Secure Your Home Network",
    content: "Learn essential steps to protect your home network from cyber threats. This comprehensive guide covers router security, password management, and monitoring tools...",
    author: "Nico",
    date: new Date("2024-01-12"),
    category: "Network Security",
    likes: 18,
    comments: 5
  },
  {
    id: "3",
    title: "Common Computer Issues and Quick Fixes",
    content: "Running into computer problems? Here are the most common issues and how to solve them quickly without calling for help. Save time and money with these pro tips...",
    author: "Tech Support Team",
    date: new Date("2024-01-10"),
    category: "IT Repairs",
    likes: 32,
    comments: 12
  }
];

interface RecentPostsSectionProps {
  onBlogClick: () => void;
}

const RecentPostsSection = ({ onBlogClick }: RecentPostsSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState(mockRecentPosts);
  const handleLike = (postId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to like posts.",
        variant: "destructive",
      });
      return;
    }

    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));

    toast({
      title: "Post Liked!",
      description: "Thanks for your feedback.",
    });
  };

  const handleComment = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to comment on posts.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Coming Soon",
      description: "Comment functionality will be available soon!",
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Recent Tech Posts
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Stay updated with the latest insights from our tech community and industry experts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posts.map((post) => (
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
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </span>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={`transition-colors ${
                              user 
                                ? "text-muted-foreground hover:text-red-500" 
                                : "text-muted-foreground/50 cursor-not-allowed"
                            }`}
                            disabled={!user}
                          >
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleComment}
                            className={`transition-colors ${
                              user 
                                ? "text-muted-foreground hover:text-primary" 
                                : "text-muted-foreground/50 cursor-not-allowed"
                            }`}
                            disabled={!user}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            {post.comments}
                          </Button>
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
            onClick={onBlogClick}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View All Posts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecentPostsSection;