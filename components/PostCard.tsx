"use client";

import { Badge } from "@/components/ui/badge";
import { PostData } from "@/lib/posts";
import { format } from "date-fns";
import { motion } from "motion/react";
import Link from "next/link";

interface PostCardProps {
  post: Omit<PostData, "contentHtml">;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Link href={`/posts/${post.id}`} className="block">
        <div className="border-b border-border/20 py-12 sm:py-16 hover:bg-muted/30 transition-colors px-4">
          <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column - Meta */}
            <div className="col-span-12 md:col-span-4 space-y-6">
              <time
                dateTime={post.date}
                className="text-xs text-muted-foreground font-mono tracking-widest uppercase block"
              >
                {format(new Date(post.date), "MMM dd, yyyy").toUpperCase()}
              </time>

              {post.series && (
                <div className="flex gap-3 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="text-xs font-mono px-3 py-1"
                  >
                    Part {post.series.part}
                  </Badge>
                </div>
              )}
            </div>

            {/* Right Column - Content */}
            <div className="col-span-12 md:col-span-8 space-y-6">
              {post.series && (
                <div className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
                  {post.series.name}
                </div>
              )}

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed text-lg line-clamp-2 font-light">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
