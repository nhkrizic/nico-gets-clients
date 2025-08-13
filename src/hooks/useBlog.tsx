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
  images?: string[];        // public URLs for display
  image_paths?: string[];   // storage paths (optional)
  author?: { full_name?: string; email: string };
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
      // fetch posts (includes images/image_paths if columns exist)
      const { data: postsData, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const safePosts = (postsData ?? []) as BlogPost[];

      // batch-load authors from profiles
      const userIds = Array.from(new Set(safePosts.map(p => p.user_id).filter(Boolean)));
      let authorMap = new Map<string, { full_name?: string; email: string }>();
      if (userIds.length) {
        const { data: profs } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);
        (profs ?? []).forEach(p => {
          authorMap.set(p.user_id, { full_name: p.full_name ?? undefined, email: p.email });
        });
      }

      // augment with likes/comments counts + user_has_liked
      const postsWithMetadata = await Promise.all(
        safePosts.map(async (post) => {
          // likes count
          const { count: likesCount } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // has current user liked?
          let userHasLiked = false;
          if (user) {
            const { data: userLike } = await supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.id)
              .maybeSingle();
            userHasLiked = !!userLike;
          }

          // comments count
          const { count: commentsCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          // ensure images is an array
          const images = Array.isArray(post.images)
            ? post.images
            : post.images
              ? [post.images as unknown as string]
              : [];

          return {
            ...post,
            images,
            likes_count: likesCount ?? 0,
            user_has_liked: userHasLiked,
            comments_count: commentsCount ?? 0,
            author: authorMap.get(post.user_id) || { email: 'anonymous@example.com', full_name: 'Anonymous' },
          };
        })
      );

      setPosts(postsWithMetadata);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({ title: 'Error', description: 'Failed to load posts', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // createPost now accepts images + optional imagePaths
  const createPost = async (
    title: string,
    content: string,
    category?: string,        // kept for compatibility
    images: string[] = [],
    imagePaths: string[] = []
  ) => {
    if (!user) {
      toast({ title: 'Login Required', description: 'You must be logged in to create a post.', variant: 'destructive' });
      return false;
    }

    try {
      const { error } = await supabase.from('blog_posts').insert({
        title,
        content,
        excerpt: content.substring(0, 150) + '...',
        user_id: user.id,
        published: true,
        images,
        image_paths: imagePaths,
        // category, // uncomment if you add this column
      });
      if (error) throw error;

      toast({ title: 'Post Published!', description: 'Your blog post has been published successfully.' });
      await fetchPosts();
      return true;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast({ title: 'Publishing Failed', description: 'Please try again later.', variant: 'destructive' });
      return false;
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast({ title: 'Login Required', description: 'You must be logged in to like posts.', variant: 'destructive' });
      return;
    }
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.user_has_liked) {
        const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
      }

      setPosts(prev => prev.map(p =>
        p.id === postId
          ? { ...p, likes_count: (p.likes_count ?? 0) + (p.user_has_liked ? -1 : 1), user_has_liked: !p.user_has_liked }
          : p
      ));

      toast({
        title: post.user_has_liked ? 'Post Unliked' : 'Post Liked!',
        description: post.user_has_liked ? 'Removed from liked posts.' : 'Thanks for your feedback.',
      });
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast({ title: 'Error', description: 'Failed to update like status', variant: 'destructive' });
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
      return (data ?? []) as Comment[];
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) {
      toast({ title: 'Login Required', description: 'You must be logged in to comment.', variant: 'destructive' });
      return false;
    }
    try {
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        author_id: user.id,
        author_name: user.user_metadata?.full_name || user.email || 'Anonymous',
        content,
      });
      if (error) throw error;

      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, comments_count: (p.comments_count ?? 0) + 1 } : p
      ));

      toast({ title: 'Comment Added!', description: 'Your comment has been posted.' });
      return true;
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({ title: 'Error', description: 'Failed to add comment', variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    posts,
    loading,
    createPost,
    toggleLike,
    fetchComments,
    addComment,
    refetchPosts: fetchPosts,
  };
};
