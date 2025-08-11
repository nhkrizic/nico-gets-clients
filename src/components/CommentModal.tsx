import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, User, Calendar } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { Comment } from '@/hooks/useBlog';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => Promise<boolean>;
  onRefreshComments: (postId: string) => Promise<Comment[]>;
}

const CommentModal = ({ 
  isOpen, 
  onClose, 
  postId, 
  postTitle, 
  comments: initialComments,
  onAddComment,
  onRefreshComments
}: CommentModalProps) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && postId) {
      refreshComments();
    }
  }, [isOpen, postId]);

  const refreshComments = async () => {
    setLoading(true);
    const freshComments = await onRefreshComments(postId);
    setComments(freshComments);
    setLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    const success = await onAddComment(postId, newComment.trim());
    if (success) {
      setNewComment('');
      await refreshComments(); // Refresh to show new comment
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[600px] bg-gradient-to-br from-card to-card/90 backdrop-blur-xl border-border p-0">
        <DialogHeader className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center">
            <MessageCircle className="mr-3 h-6 w-6 text-primary" />
            Comments
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            {postTitle}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No comments yet.</p>
                <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="bg-gradient-to-br from-card to-card/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{comment.author_name}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(comment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed">{comment.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Comment Form */}
          <div className="p-6 border-t border-border bg-background/50">
            {user ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] bg-background/50 border-border focus:border-primary resize-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    {newComment.length}/500 characters
                  </span>
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || newComment.length > 500}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground mb-4">Sign in to join the conversation</p>
                <Button onClick={onClose} variant="outline">
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;