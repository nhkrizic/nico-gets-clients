import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, User, MessageSquare, Heart, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useBlog } from "@/hooks/useBlog";
import CommentModal from "@/components/CommentModal";
import ShareModal from "@/components/ShareModal";

interface RecentPostsSectionProps {
  onBlogClick: () => void;
}

const RecentPostsSection = ({ onBlogClick }: RecentPostsSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { posts, loading, toggleLike, fetchComments, addComment } = useBlog();
  
  const [commentModal, setCommentModal] = useState<{
    isOpen: boolean;
    postId: string;
    postTitle: string;
    comments: any[];
  }>({
    isOpen: false,
    postId: '',
    postTitle: '',
    comments: []
  });
  
  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    postTitle: string;
    postContent: string;
  }>({
    isOpen: false,
    postTitle: '',
    postContent: ''
  });

  const displayPosts = posts.slice(0, 3); // Show only first 3 posts

  const handleComment = async (postId: string, postTitle: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to view comments.",
        variant: "destructive",
      });
      return;
    }

    const comments = await fetchComments(postId);
    setCommentModal({
      isOpen: true,
      postId,
      postTitle,
      comments
    });
  };

  const handleShare = (postTitle: string, postContent: string) => {
    setShareModal({
      isOpen: true,
      postTitle,
      postContent
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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50 border-border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      Tech Post
                    </Badge>
                  </div>
                  <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Anonymous
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                  </CardDescription>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={`transition-colors ${
                          user 
                            ? post.user_has_liked
                              ? "text-red-500 hover:text-red-600"
                              : "text-muted-foreground hover:text-red-500"
                            : "text-muted-foreground/50 cursor-not-allowed"
                        }`}
                        disabled={!user}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${post.user_has_liked ? 'fill-current' : ''}`} />
                        {post.likes_count || 0}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleComment(post.id, post.title)}
                        className={`transition-colors ${
                          user 
                            ? "text-muted-foreground hover:text-primary" 
                            : "text-muted-foreground/50 cursor-not-allowed"
                        }`}
                        disabled={!user}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {post.comments_count || 0}
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(post.title, post.content)}
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
        )}

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

        {/* Comment Modal */}
        <CommentModal
          isOpen={commentModal.isOpen}
          onClose={() => setCommentModal(prev => ({ ...prev, isOpen: false }))}
          postId={commentModal.postId}
          postTitle={commentModal.postTitle}
          comments={commentModal.comments}
          onAddComment={addComment}
          onRefreshComments={fetchComments}
        />

        {/* Share Modal */}
        <ShareModal
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal(prev => ({ ...prev, isOpen: false }))}
          postTitle={shareModal.postTitle}
          postContent={shareModal.postContent}
        />
      </div>
    </section>
  );
};

export default RecentPostsSection;