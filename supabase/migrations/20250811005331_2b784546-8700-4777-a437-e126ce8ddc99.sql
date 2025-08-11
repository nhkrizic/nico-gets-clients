-- Create blog_posts table to store actual blog posts
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  category TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create likes table to track who liked what
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Policies for blog_posts
CREATE POLICY "Blog posts are viewable by everyone" 
ON public.blog_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts" 
ON public.blog_posts 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts" 
ON public.blog_posts 
FOR DELETE 
USING (auth.uid() = author_id);

-- Policies for comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments 
FOR DELETE 
USING (auth.uid() = author_id);

-- Policies for post_likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.post_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own likes" 
ON public.post_likes 
FOR ALL 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample blog posts
INSERT INTO public.blog_posts (title, content, author_id, author_name, category) 
VALUES 
  (
    'Top 10 Web Development Trends in 2024',
    'Discover the latest trends in web development that are shaping the digital landscape. From AI integration to advanced CSS features, here''s what every developer should know...',
    'fd8137cc-668a-4772-ab0d-19295f0ec3b8',
    'Nico',
    'Web Development'
  ),
  (
    'How to Secure Your Home Network',
    'Learn essential steps to protect your home network from cyber threats. This comprehensive guide covers router security, password management, and monitoring tools...',
    'fd8137cc-668a-4772-ab0d-19295f0ec3b8',
    'Nico',
    'Network Security'
  ),
  (
    'Common Computer Issues and Quick Fixes',
    'Running into computer problems? Here are the most common issues and how to solve them quickly without calling for help. Save time and money with these pro tips...',
    'fd8137cc-668a-4772-ab0d-19295f0ec3b8',
    'Tech Support Team',
    'IT Repairs'
  );