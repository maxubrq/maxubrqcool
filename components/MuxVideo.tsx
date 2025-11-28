"use client"

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MuxVideoProps {
  playbackId: string;
  metadata?: {
    video_id?: string;
    video_title?: string;
    viewer_user_id?: string;
  };
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export function MuxVideo({ 
  playbackId, 
  metadata, 
  className,
  autoPlay = false,
  loop = false,
  muted = false
}: MuxVideoProps) {
  const [MuxPlayer, setMuxPlayer] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only load MuxPlayer on the client side
    if (typeof window !== 'undefined') {
      import("@mux/mux-player-react").then((module) => {
        setMuxPlayer(() => module.default);
        setIsLoaded(true);
      }).catch((error) => {
        console.error("Failed to load Mux Player:", error);
      });
    }
  }, []);

  if (!isLoaded || !MuxPlayer) {
    return (
      <div className={cn("relative w-full aspect-video overflow-hidden rounded-lg border bg-muted shadow-sm flex items-center justify-center", className)}>
        <div className="text-sm text-muted-foreground">Loading video player...</div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full aspect-video overflow-hidden rounded-lg border bg-muted shadow-sm", className)}>
      <MuxPlayer
        playbackId={playbackId}
        metadata={metadata}
        streamType="on-demand"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        style={{ height: "100%", width: "100%" }}
        accentColor="var(--accent, #000000)"
      />
    </div>
  );
}

