// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

import type { MDXComponents } from 'mdx/types'
import { Counter, Quiz, CodePlayground, InteractiveTabs, ProgressBar } from './components/InteractiveComponents'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Interactive components
    Counter,
    Quiz,
    CodePlayground,
    Tabs: InteractiveTabs,
    ProgressBar,
    
    // Enhanced HTML elements with better styling
    h1: ({ children, ...props }) => (
      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-6" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-5" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="text-gray-700 mb-4 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-gray-700" {...props}>
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
