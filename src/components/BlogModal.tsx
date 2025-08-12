import { useState, useEffect } from "react";
import type { BlogPost } from "@/hooks/useBlog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Calendar, User, MessageSquare, Heart, Share2, Search, Plus, Lock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useBlog } from "@/hooks/useBlog";
import CommentModal from "@/components/CommentModal";
import ShareModal from "@/components/ShareModal";
import { supabase } from "@/lib/supabase";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = ["All", "Web Development", "IT Repairs", "Network Security", "Tips & Tricks", "Industry News"];

const BlogModal = ({ isOpen, onClose }: BlogModalProps) => {
  const [activeTab, setActiveTab] = useState<"read" | "write">("read");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null); // read more/less

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "Tips & Tricks",
    files: null as FileList | null,
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const { posts, loading, createPost, toggleLike, fetchComments, addComment } = useBlog();

  const [commentModal, setCommentModal] = useState({
    isOpen: false,
    postId: "",
    postTitle: "",
    comments: [] as any[],
  });

  const [shareModal, setShareModal] = useState({
    isOpen: false,
    postTitle: "",
    postContent: "",
  });

  // ---- admin flag (from profiles) ----
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const me = auth?.user;
      if (!me) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("user_id", me.id) // your profiles table uses user_id
        .single();

      if (error) {
        console.warn("profiles fetch error:", error.message);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data?.is_admin);
      }
    })();
  }, []);

  // ---- filters ----
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || true; // category filter disabled for now
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ---- create post with optional images ----
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

    const imageUrls: string[] = [];
    const imagePaths: string[] = [];

    if (newPost.files && newPost.files.length > 0) {
      for (const file of Array.from(newPost.files)) {
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from("blog_posts").upload(filePath, file);
        if (uploadError) {
          toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
          return;
        }
        const { data } = supabase.storage.from("blog_posts").getPublicUrl(filePath);
        imageUrls.push(data.publicUrl);
        imagePaths.push(filePath);
      }
    }

    // createPost now accepts images (and optional paths)
    const success = await createPost(newPost.title, newPost.content, newPost.category, imageUrls, imagePaths);
    if (success) {
      setNewPost({ title: "", content: "", category: "Tips & Tricks", files: null });
      setActiveTab("read");
      toast({ title: "Post published" });
    } else {
      toast({ title: "Failed to publish", variant: "destructive" });
    }
  };

  // ---- comments/share handlers ----
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
    setCommentModal({ isOpen: true, postId, postTitle, comments });
  };

  const handleShare = (postTitle: string, postContent: string) => {
    setShareModal({ isOpen: true, postTitle, postContent });
  };

  // ---- delete (admin only) ----
  const handleDelete = async (postId: string) => {
    if (!isAdmin) return;
    const ok = confirm("Delete this post?");
    if (!ok) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", postId);
    if (error) {
      toast({ title: "Error deleting post", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Post deleted" });
      window.location.reload(); // simplest refresh
    }
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
            <DialogDescription>Latest posts, tips, and community discussions</DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2">
            <Button variant={activeTab === "read" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("read")}>
              <BookOpen className="w-4 h-4 mr-1" /> Read Posts
            </Button>
            <Button variant={activeTab === "write" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("write")} disabled={!user}>
              {!user ? <Lock className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />} Write Post
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "read" ? (
            <div className="h-full flex flex-col">
              {/* Search */}
              <div className="p-6 border-b border-border bg-background/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge key={category} onClick={() => setSelectedCategory(category)}>
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Posts */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                  <div className="text-center py-12">Loading...</div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12">No posts found.</div>
                ) : (
                  filteredPosts.map((post: BlogPost) => {
                    const isExpanded = expandedId === post.id;
                    const authorLabel =
                      (post.author?.full_name && post.author.full_name.trim()) ||
                      post.author?.email ||
                      "Anonymous";

                    return (
                      <Card key={post.id}>
                        <CardHeader className="pb-3 flex justify-between items-start">
                          <div>
                            <CardTitle
                              className="cursor-pointer hover:text-primary transition-colors"
                              onClick={() => setExpandedId(isExpanded ? null : post.id)}
                            >
                              {post.title}
                            </CardTitle>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {authorLabel}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {isAdmin && (
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </CardHeader>

                        <CardContent>
                          {/* content */}
                          <CardDescription className="whitespace-pre-wrap">
                            {isExpanded
                              ? post.content
                              : post.content.length > 200
                              ? `${post.content.slice(0, 200)}...`
                              : post.content}
                          </CardDescription>

                          {/* images */}
                          {post.images && post.images.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {post.images.map((img: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`post image ${idx + 1}`}
                                  className="w-full h-40 object-cover rounded"
                                  loading="lazy"
                                />
                              ))}
                            </div>
                          )}

                          {/* expand/collapse */}
                          {post.content.length > 200 && (
                            <div className="mt-2">
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => setExpandedId(isExpanded ? null : post.id)}
                              >
                                {isExpanded ? "Show less" : "Read more"}
                              </Button>
                            </div>
                          )}

                          <Separator className="my-3" />
                          <div className="flex justify-between">
                            <div className="flex space-x-4">
                              <Button variant="ghost" size="sm" onClick={() => toggleLike(post.id)}>
                                <Heart className="w-4 h-4 mr-1" /> {post.likes_count || 0}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleComment(post.id, post.title)}>
                                <MessageSquare className="w-4 h-4 mr-1" /> {post.comments_count || 0}
                              </Button>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleShare(post.title, post.content)}>
                              <Share2 className="w-4 h-4 mr-1" /> Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="h-full p-6 overflow-y-auto">
              {!user ? (
                <div className="max-w-2xl mx-auto text-center py-20">
                  <Lock className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Login Required</h3>
                  <p>You need to be logged in to create posts.</p>
                  <Button onClick={onClose}>Go to Login</Button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Post Title</label>
                    <Input
                      value={newPost.title}
                      onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter an engaging title for your post"
                      className="bg-background/50 border-border focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 rounded-md bg-background/50 border border-border focus:border-primary focus:outline-none"
                    >
                      {categories.slice(1).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Content</label>
                    <Textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your post content here..."
                      className="min-h-[300px] bg-background/50 border-border focus:border-primary resize-none whitespace-pre-wrap"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Upload Images</label>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setNewPost((prev) => ({ ...prev, files: e.target.files }))}
                      className="bg-background/50 border-border focus:border-primary"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button onClick={handleSubmitPost}>Publish Post</Button>
                    <Button
                      variant="outline"
                      onClick={() => setNewPost({ title: "", content: "", category: "Tips & Tricks", files: null })}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Modal */}
        <CommentModal
          isOpen={commentModal.isOpen}
          onClose={() => setCommentModal((prev) => ({ ...prev, isOpen: false }))}
          postId={commentModal.postId}
          postTitle={commentModal.postTitle}
          comments={commentModal.comments}
          onAddComment={addComment}
          onRefreshComments={fetchComments}
        />

        {/* Share Modal */}
        <ShareModal
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal((prev) => ({ ...prev, isOpen: false }))}
          postTitle={shareModal.postTitle}
          postContent={shareModal.postContent}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BlogModal;
