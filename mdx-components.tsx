// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

import type { MDXComponents } from 'mdx/types'
import { Counter, CodePlayground, InteractiveTabs, ProgressBar } from './components/InteractiveComponents'
import { Quiz, QuizBuilder, QuizQuestion } from './components/QuizBuilder'
import { QuizDemo } from './components/QuizDemo'
import { ReactQuiz } from './components/ReactQuiz'
import { ReusableQuiz } from './components/ReusableQuiz'
import { SimpleQuiz } from './components/SimpleQuiz'
import { Mermaid } from './components/Mermaid'
import { Kroki } from './components/Kroki'
import { Figure, SimpleFigure } from './components/Figure'
import { MathJax, MathJaxProvider, InlineMath, BlockMath } from './components/MathJax'
import { 
  Alert, 
  InfoAlert, 
  WarningAlert, 
  ErrorAlert, 
  SuccessAlert, 
  TipAlert, 
  NoteAlert 
} from './components/Alert'

// Utility function to generate IDs from heading text
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Interactive components
    Counter,
    CodePlayground,
    Tabs: InteractiveTabs,
    ProgressBar,
    
    // Quiz components
    Quiz,
    QuizBuilder,
    QuizQuestion,
    QuizDemo,
    ReactQuiz,
    ReusableQuiz,
    SimpleQuiz,
    Mermaid,
    Kroki,
    // MathJax components
    MathJax,
    MathJaxProvider,
    InlineMath,
    BlockMath,
    
    // Figure components
    Figure,
    SimpleFigure,
    
    // Alert components
    Alert,
    InfoAlert,
    WarningAlert,
    ErrorAlert,
    SuccessAlert,
    TipAlert,
    NoteAlert,
    
    // Enhanced HTML elements with better styling
    h1: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : children?.toString() || ''
      const id = generateHeadingId(text)
      return (
        <h1 id={id} className="text-3xl font-black tracking-tighter text-gray-900 mb-6 mt-8" {...props}>
          {children}
        </h1>
      )
    },
    h2: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : children?.toString() || ''
      const id = generateHeadingId(text)
      return (
        <h2 id={id} className="text-2xl font-black tracking-tighter text-gray-900 mb-4 mt-6" {...props}>
          {children}
        </h2>
      )
    },
    h3: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : children?.toString() || ''
      const id = generateHeadingId(text)
      return (
        <h3 id={id} className="text-xl font-black tracking-tighter text-gray-900 mb-3 mt-5" {...props}>
          {children}
        </h3>
      )
    },
    h4: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : children?.toString() || ''
      const id = generateHeadingId(text)
      return (
        <h4 id={id} className="text-lg font-semibold text-gray-900 mb-2 mt-4" {...props}>
          {children}
        </h4>
      )
    },
    h5: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : children?.toString() || ''
      const id = generateHeadingId(text)
      return (
        <h5 id={id} className="text-base font-semibold text-gray-900 mb-2 mt-3" {...props}>
          {children}
        </h5>
      )
    },
    h6: ({ children, ...props }) => {
      const text = typeof children === 'string' ? children : children?.toString() || ''
      const id = generateHeadingId(text)
      return (
        <h6 id={id} className="text-sm font-semibold text-gray-900 mb-2 mt-3" {...props}>
          {children}
        </h6>
      )
    },
    p: ({ children, ...props }) => (
      <p className="text-gray-700 mb-4 leading-relaxed font-light tracking-wider" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 font-light tracking-wider" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700 font-light tracking-wider" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-gray-700 font-light tracking-wider" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-blue-900 italic" {...props}>
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => {
      // Check if this is an inline code or code block
      const isInline = !props.className
      
      if (isInline) {
        return (
          <code className="bg-muted text-foreground px-2 py-0.5 rounded text-sm font-mono border" {...props}>
            {children}
          </code>
        )
      }
      
      // For code blocks, let Shiki handle the styling
      return <code {...props}>{children}</code>
    },
    pre: ({ children, ...props }) => {
      // Let Shiki handle pre styling with dark theme support
      return (
        <pre className="dark:bg-gray-900 dark:border-gray-700" {...props}>
          {children}
        </pre>
      )
    },
    a: ({ children, href, ...props }) => (
      <a 
        href={href} 
        className="text-blue-600 hover:text-blue-800 underline transition-colors" 
        {...props}
      >
        {children}
      </a>
    ),
    img: ({ src, alt, ...props }) => (
        <img 
        src={src} 
        alt={alt} 
        className="max-w-full h-auto rounded-sm shadow-sm my-4" 
        {...props}
      />
    ),
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-gray-300 rounded-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="bg-gray-100 border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-gray-300 px-4 py-2 text-gray-700" {...props}>
        {children}
      </td>
    ),
    ...components,
  }
}
