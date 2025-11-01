'use client';

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'

export default function About() {
  return (
    <div className="min-h-screen bg-background -mx-4 md:-mx-8 px-4 md:px-8 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Left Column - Text Content */}
          <div className="space-y-8 md:space-y-12">
            {/* Top Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="flex items-center justify-between"
            >
              <Link 
                href="/"
                className="text-sm font-medium hover:opacity-70 transition-opacity duration-200"
              >
                MAXUBRQCOOL
              </Link>
              <div className="flex items-center gap-6">
                <Link 
                  href="/"
                  className="text-sm font-medium hover:opacity-70 transition-opacity duration-200"
                >
                  HOME
                </Link>
                <Link 
                  href="/posts"
                  className="text-sm font-medium hover:opacity-70 transition-opacity duration-200"
                >
                  BÀI VIẾT
                </Link>
              </div>
            </motion.div>

            {/* Send Email Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
            >
              <a 
                href="mailto:hungtp.play@gmail.com"
                className="text-sm font-medium hover:opacity-70 transition-opacity duration-200 inline-block"
              >
                Gửi email
              </a>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
              className="space-y-8"
            >
              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight pb-4 border-b-2 border-foreground">
                  Hưng Trần (Max)
                </h1>
              </div>

              {/* Biography */}
              <div className="space-y-6 text-sm md:text-base font-light tracking-wider leading-relaxed">
                <p>
                  Tôi làm kỹ sư phần mềm, nhưng thật ra phần lớn thời gian tôi chỉ đang cố hiểu xem thế giới — và chính mình — vận hành thế nào.
                </p>
                <p>
                  Có ngày tôi nghĩ về kiến trúc hệ thống, có ngày lại tự hỏi vì sao một đoạn code nhỏ có thể khiến cả team thức trắng. Tất cả dường như liên quan đến nhau: cách ta thiết kế phần mềm, cách ta làm việc, cách ta sống.
                </p>
                <p>
                  Tôi không viết để dạy ai điều gì. Tôi viết để ghi lại quá trình của chính bản thân mình — khi một ý tưởng lóe lên, một lỗi làm sập hệ thống, hay một câu trong sách khiến tôi dừng lại thật lâu. Viết, với tôi, giống như log lại trạng thái nhận thức: lúc rõ ràng, lúc hỗn độn.
                </p>
                <p>
                  Ở đây tôi chia sẻ những gì tôi quan tâm: công nghệ, khoa học, triết học, nghệ thuật, và những dự án đang làm dở. Chúng chẳng có trật tự gì, vì suy nghĩ thật thường không có cấu trúc đẹp đẽ như code.
                </p>
                <p>
                  Tôi tin vào câu nói của Đức Phật:
                </p>
                <p className="text-lg md:text-xl font-medium italic pl-4 border-l-2 border-foreground my-8 tracking-wider">
                  &ldquo;Hãy tự mình thắp đuốc lên mà đi.&rdquo;
                </p>
                <p>
                  Nó không phải lời khuyên, mà là một nhắc nhở: <strong> rằng không ai có thể soi đường thay mình mãi.</strong>
                </p>
                <p>
                  Blog này là cách tôi giữ cho ngọn đuốc đó không tắt.
                </p>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
              className="space-y-4 pt-8 border-t-2 border-foreground"
            >
              <h2 className="text-xs font-medium uppercase tracking-widest">Thông tin liên hệ</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Email: </span>
                  <a 
                    href="mailto:hungtp.play@gmail.com"
                    className="hover:opacity-70 transition-opacity duration-200"
                  >
                    hungtp.play@gmail.com
                  </a>
                </div>
                <div>
                  <span className="font-medium">GitHub: </span>
                  <a 
                    href="https://github.com/maxubrq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-70 transition-opacity duration-200"
                  >
                    github.com/maxubrq
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Portrait Image */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="sticky top-8"
            >
              {/* Portrait Image */}
              <div className="relative w-full aspect-[3/4] bg-muted overflow-hidden border-2 border-foreground">
                <Image
                  src="https://res.cloudinary.com/dmsb4anlx/image/upload/v1761963269/maxubrqcool/avatar_1_zzkqc9.png"
                  alt="Hưng Trần (Max)"
                  fill
                  className="object-cover grayscale"
                  priority
                />
              </div>

              {/* Go Back Link */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
                className="mt-8"
              >
                <Link 
                  href="/"
                  className="text-sm font-medium hover:opacity-70 transition-opacity duration-200 inline-flex items-center gap-2"
                >
                  <span>←</span>
                  <span>TRỞ VỀ</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
