import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar, User, MessageSquare, Heart, Share2, Search, Plus, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useBlog } from "@/hooks/useBlog";
import CommentModal from "@/components/CommentModal";
import ShareModal from "@/components/ShareModal";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = ["All", "Web Development", "IT Repairs", "Network Security", "Tips & Tricks", "Industry News"];

const BlogModal = ({ isOpen, onClose }: BlogModalProps) => {
  const [activeTab, setActiveTab] = useState<'read' | 'write'>('read');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'Tips & Tricks'
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { posts, loading, createPost, toggleLike, fetchComments, addComment } = useBlog();
  
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

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || true; // Remove category filtering for now
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitPost = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to create a blog post.",
        variant: "destructive",
      });
      return;
    }

    if (!newPost.title || !newPost.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    const success = await createPost(newPost.title, newPost.content, newPost.category);
    if (success) {
      setNewPost({ title: '', content: '', category: 'Tips & Tricks' });
      setActiveTab('read');
    }
  };

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[700px] bg-gradient-to-br from-card to-card/90 backdrop-blur-xl border-border p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center">
              <BookOpen className="mr-3 h-6 w-6 text-primary" />
              Tech Blog & Community
            </DialogTitle>
            <DialogDescription>
              Latest posts, tips, and community discussions
            </DialogDescription>
          </DialogHeader>

          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('read')}
              className={activeTab === 'read' ? 'bg-primary' : ''}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Read Posts
            </Button>
            <Button
              variant={activeTab === 'write' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('write')}
              className={activeTab === 'write' ? 'bg-accent' : ''}
              disabled={!user}
            >
              {!user ? <Lock className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
              Write Post
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'read' ? (
            <div className="h-full flex flex-col">
              {/* Search and Filter */}
              <div className="p-6 border-b border-border bg-background/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background/50 border-border focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-primary/10 hover:text-primary hover:border-primary/30'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Posts List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading posts...</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No posts found matching your criteria.</p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow duration-200 bg-gradient-to-br from-card to-card/50">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg hover:text-primary transition-colors cursor-pointer">
                              {post.title}
                            </CardTitle>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                Anonymous
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="ml-4">
                            Tech Post
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base leading-relaxed mb-4">
                          {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
                        </CardDescription>
                        <Separator className="my-3" />
                        <div className="flex items-center justify-between">
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
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="h-full p-6 overflow-y-auto">
              {!user ? (
                <div className="max-w-2xl mx-auto text-center py-20">
                  <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Login Required</h3>
                  <p className="text-muted-foreground mb-6">
                    You need to be logged in to create blog posts and share your knowledge with the community.
                  </p>
                  <Button 
                    onClick={onClose}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Go to Login
                  </Button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Create New Post</h3>
                    <p className="text-muted-foreground">Share your knowledge with the community</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Post Title</label>
                      <Input
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter an engaging title for your post"
                        className="bg-background/50 border-border focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2 rounded-md bg-background/50 border border-border focus:border-primary focus:outline-none"
                      >
                        {categories.slice(1).map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Content</label>
                      <Textarea
                        value={newPost.content}
                        onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write your post content here... Share tips, tutorials, or insights that could help others!"
                        className="min-h-[300px] bg-background/50 border-border focus:border-primary resize-none"
                      />
                    </div>

                    <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                      <h4 className="font-medium mb-2">Community Guidelines</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Keep content relevant to IT, technology, and professional services</li>
                        <li>• Be respectful and constructive in your communications</li>
                        <li>• Share knowledge that could genuinely help others</li>
                        <li>• Avoid promotional content unless it provides clear value</li>
                      </ul>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        onClick={handleSubmitPost}
                        className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-semibold px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Publish Post
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setNewPost({ title: '', content: '', category: 'Tips & Tricks' })}
                      >
                        Clear Form
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
      </DialogContent>
    </Dialog>
  );
};

export default BlogModal;