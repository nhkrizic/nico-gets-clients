import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  user_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    full_name?: string;
    email: string;
  };
  comments?: Comment[];
  likes_count?: number;
  user_has_liked?: boolean;
  comments_count?: number;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data: postsData, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get likes count and user likes for each post
      const postsWithMetadata = await Promise.all(
        postsData.map(async (post) => {
          // Get likes count
          const { count: likesCount } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact' })
            .eq('post_id', post.id);

          // Check if current user liked this post
          let userHasLiked = false;
          if (user) {
            const { data: userLike } = await supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .single();
            userHasLiked = !!userLike;
          }

          // Get comments count
          const { count: commentsCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact' })
            .eq('post_id', post.id);

          return {
            ...post,
            likes_count: likesCount || 0,
            user_has_liked: userHasLiked,
            comments_count: commentsCount || 0,
            author: { email: 'anonymous@example.com', full_name: 'Anonymous' }
          };
        })
      );

      setPosts(postsWithMetadata);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (title: string, content: string, category: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to create a post.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title,
          content,
          excerpt: content.substring(0, 150) + '...',
          user_id: user.id,
          published: true
        });

      if (error) throw error;

      toast({
        title: "Post Published!",
        description: "Your blog post has been published successfully.",
      });

      await fetchPosts(); // Refresh posts
      return true;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({
        title: "Publishing Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to like posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.user_has_liked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (error) throw error;
      }

      // Update local state
      setPosts(prev => prev.map(p => 
        p.id === postId ? {
          ...p,
          likes_count: p.user_has_liked ? p.likes_count - 1 : p.likes_count + 1,
          user_has_liked: !p.user_has_liked
        } : p
      ));

      toast({
        title: post.user_has_liked ? "Post Unliked" : "Post Liked!",
        description: post.user_has_liked ? "Removed from liked posts." : "Thanks for your feedback.",
      });
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const fetchComments = async (postId: string): Promise<Comment[]> => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You must be logged in to comment.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          author_name: user.user_metadata?.full_name || user.email || 'Anonymous',
          content
        });

      if (error) throw error;

      // Update comments count in local state
      setPosts(prev => prev.map(p => 
        p.id === postId ? {
          ...p,
          comments_count: p.comments_count + 1
        } : p
      ));

      toast({
        title: "Comment Added!",
        description: "Your comment has been posted.",
      });

      return true;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    fetchComments,
    addComment,
    refetchPosts: fetchPosts
  };
};