'use client';

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { motion } from 'motion/react'

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="pt-20 md:pt-32 pb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          {/* Left Column - Meta Info */}
          <div className="md:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.1 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">SCOPE</h2>
                <div className="space-y-1 text-sm">
                  <div>Front-end Architecture</div>
                  <div>Design Systems</div>
                  <div>Interactive Components</div>
                  <div>Educational Content</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">FOCUS</h2>
                <div className="space-y-1 text-sm">
                  <div>Swiss Design Principles</div>
                  <div>TypeScript & React</div>
                  <div>Accessibility First</div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">YEAR</h2>
                <div className="text-sm">Twenty Twenty-Four</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Main Content */}
          <div className="md:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
                  Building quietly opinionated interfaces.
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-4xl">
                  I explore practical front-end architectures, interaction patterns, and teaching through
                  interactive content. Elegance through restraint; clarity over flourish.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Separator */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.3 }}
        className="w-full h-px bg-border mb-16 md:mb-24"
      />

      {/* Content Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mb-16 md:mb-24">
        {/* Left Column */}
        <div className="md:col-span-4 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.1 }}
          >
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">PRINCIPLES</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Composition over cleverness</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Explicit contracts, typed data flow, predictable patterns that scale.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Motion reveals hierarchy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Subtle transitions that clarify relationships, not ornament.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Accessibility as foundation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  WCAG AA minimum, keyboard-first interactions, semantic structure.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">WHAT YOU&apos;LL FIND</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Interactive tutorials and components',
                  'Engineering notes and patterns', 
                  'Project breakdowns and autopsies',
                  'Type-safe APIs and contracts',
                  'Design systems and tokens',
                  'Quizzes for spaced learning'
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.1 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-1 h-1 bg-foreground rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
      >
        <div className="md:col-span-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">PASSION</h2>
          <p className="text-lg leading-relaxed">
            I enjoy leading and building teams, establishing new processes, and bringing innovative 
            design experiences to users. Teaching through interaction and creating systems that 
            scale with intention.
          </p>
        </div>
        
        <div className="md:col-span-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">CONTACT</h2>
          <p className="text-lg leading-relaxed mb-4">
            I&apos;m open to collaboration and thoughtful conversations about architecture, 
            design systems, and teaching through interaction.
          </p>
          <div className="text-sm text-muted-foreground">
            Reach out via the footer links or connect on social media.
          </div>
        </div>
      </motion.section>

      <div className="h-32 md:h-40" />
    </div>
  )
}
