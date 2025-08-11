import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, ExternalLink, Facebook, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postTitle: string;
  postContent: string;
  postUrl?: string;
}

const ShareModal = ({ isOpen, onClose, postTitle, postContent, postUrl }: ShareModalProps) => {
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);

  const shareUrl = postUrl || window.location.href;
  const shareText = `${postTitle} - ${postContent.substring(0, 100)}...`;

  const handleCopyLink = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "The post link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    } finally {
      setCopying(false);
    }
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=600');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Native sharing cancelled or failed');
      }
    } else {
      // Fallback to copy link
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-gradient-to-br from-card to-card/90 backdrop-blur-xl border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center">
            <Share2 className="mr-3 h-6 w-6 text-primary" />
            Share Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Post Preview */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border">
            <h4 className="font-medium text-sm mb-1 line-clamp-2">{postTitle}</h4>
            <p className="text-xs text-muted-foreground line-clamp-3">{postContent}</p>
          </div>

          {/* Share URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Post Link</label>
            <div className="flex space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="bg-background/50 border-border text-sm"
              />
              <Button
                onClick={handleCopyLink}
                disabled={copying}
                size="sm"
                variant="outline"
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Share on social media</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleLinkedInShare}
                variant="outline"
                className="flex items-center justify-center space-x-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>LinkedIn</span>
              </Button>
              
              <Button
                onClick={handleFacebookShare}
                variant="outline"
                className="flex items-center justify-center space-x-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Facebook</span>
              </Button>
            </div>

            {/* Native Share (Mobile) */}
            {navigator.share && (
              <Button
                onClick={handleNativeShare}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share via Device
              </Button>
            )}

            {/* Instagram Stories Note */}
            <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border">
              <strong>Instagram Stories:</strong> Copy the link above and paste it in your Instagram Story as a link sticker or in your story text.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;