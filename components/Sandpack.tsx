'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { SandpackFiles, SandpackPredefinedTemplate, SandpackSetup } from '@codesandbox/sandpack-react'
import { SandpackCodeEditor, SandpackConsole, SandpackFileExplorer, SandpackLayout, SandpackPreview, SandpackProvider } from '@codesandbox/sandpack-react'
import { motion } from 'motion/react'
import { useState } from 'react'

type SandpackProps = {
  /**
   * Template preset (react, react-ts, vanilla, vanilla-ts, vue, vue3, angular, etc.)
   */
  template?: SandpackPredefinedTemplate
  /**
   * Custom files configuration
   */
  files?: SandpackFiles
  /**
   * Custom setup configuration
   */
  customSetup?: SandpackSetup
  /**
   * Theme: 'light' | 'dark' | 'auto'
   */
  theme?: 'light' | 'dark' | 'auto'
  /**
   * Show file explorer
   */
  showNavigator?: boolean
  /**
   * Show console
   */
  showConsole?: boolean
  /**
   * Show line numbers
   */
  showLineNumbers?: boolean
  /**
   * Show read-only mode
   */
  readOnly?: boolean
  /**
   * Initial file to show
   */
  initialFile?: string
  /**
   * Title for the code editor
   */
  title?: string
  /**
   * Description for the code editor
   */
  description?: string
  /**
   * Height of the editor (default: '400px')
   */
  height?: string
  /**
   * Show editor and preview side by side or stacked
   */
  layout?: 'horizontal' | 'vertical'
}

/**
 * Sandpack Code Editor Component
 * 
 * A wrapper around @codesandbox/sandpack-react that integrates with the
 * Swiss-Brutalist design system. Provides live code editing capabilities
 * with clean typography, 8px grid spacing, and motion integration.
 * 
 * @example
 * ```mdx
 * <Sandpack
 *   template="react-ts"
 *   files={{
 *     '/App.tsx': `export default function App() { return <h1>Hello</h1> }`
 *   }}
 *   title="React Component"
 *   showNavigator
 * />
 * ```
 */
export function Sandpack({
  template = 'react-ts',
  files,
  customSetup,
  theme = 'auto',
  showNavigator = false,
  showConsole = false,
  showLineNumbers = true,
  readOnly = false,
  initialFile,
  title,
  description,
  height = '400px',
  layout = 'horizontal',
}: SandpackProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'console'>('editor')

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="my-8"
    >
      <Card className="border-2 border-foreground/10 shadow-none">
        {(title || description) && (
          <CardHeader className="pb-4 space-y-2">
            {title && (
              <CardTitle className="text-xl font-black tracking-tighter">
                {title}
              </CardTitle>
            )}
            {description && (
              <p className="text-sm text-muted-foreground font-light tracking-wider leading-relaxed">
                {description}
              </p>
            )}
          </CardHeader>
        )}
        <CardContent className="p-0">
          <SandpackProvider
            template={template}
            files={files}
            customSetup={customSetup}
            theme={theme}
          >
            <div className="border-t border-foreground/10">
              {showNavigator && (
                <div className="border-b border-foreground/10">
                  <SandpackFileExplorer />
                </div>
              )}
              
              {showConsole ? (
                <Tabs 
                  value={activeTab} 
                  onValueChange={(v) => setActiveTab(v as typeof activeTab)}
                  className="w-full"
                >
                  <TabsList className="w-full rounded-none border-b border-foreground/10 bg-transparent h-auto p-0">
                    <TabsTrigger 
                      value="editor" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent font-medium tracking-tight"
                    >
                      Code
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preview"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent font-medium tracking-tight"
                    >
                      Preview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="console"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent font-medium tracking-tight"
                    >
                      Console
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="editor" className="m-0">
                    <SandpackCodeEditor 
                      showLineNumbers={showLineNumbers}
                      readOnly={readOnly}
                      className='h-full'
                    />
                  </TabsContent>
                  
                  <TabsContent value="preview" className="m-0">
                    <SandpackPreview 
                      showNavigator={false}
                      style={{ height }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="console" className="m-0">
                    <SandpackConsole style={{ height }} />
                  </TabsContent>
                </Tabs>
              ) : (
                <SandpackLayout style={{ height }}>
                  <SandpackCodeEditor 
                    showLineNumbers={showLineNumbers}
                    readOnly={readOnly}
                    style={{
                      height: '100% !important',
                    }
                    }
                  />
                  <SandpackPreview 
                    showNavigator={false}
                    style={{ height: '100% !important' }}
                  />
                </SandpackLayout>
              )}
            </div>
          </SandpackProvider>
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * Simplified Sandpack component for quick code examples
 * 
 * @example
 * ```mdx
 * <SandpackSimple
 *   code={`export default function App() { return <h1>Hello</h1> }`}
 *   template="react-ts"
 * />
 * ```
 */
type SandpackSimpleProps = {
  code: string
  template?: SandpackPredefinedTemplate
  filename?: string
  title?: string
  height?: string
}

export function SandpackSimple({
  code,
  template = 'react-ts',
  filename = '/App.tsx',
  title,
  height = '400px',
}: SandpackSimpleProps) {
  return (
    <Sandpack
      template={template}
      files={{
        [filename]: code,
      }}
      title={title}
      height={height}
      showNavigator={false}
      showConsole={false}
    />
  )
}

/**
 * Sandpack with React preset
 * Pre-configured for React development
 */
export function SandpackReact({
  code,
  filename = '/App.tsx',
  title,
  description,
  height = '400px',
  showConsole = false,
}: {
  code: string
  filename?: string
  title?: string
  description?: string
  height?: string
  showConsole?: boolean
}) {
  return (
    <Sandpack
      template="react-ts"
      files={{
        [filename]: code,
      }}
      title={title}
      description={description}
      height={height}
      showConsole={showConsole}
      showNavigator={false}
    />
  )
}

/**
 * Sandpack with Vanilla JS preset
 * Pre-configured for vanilla JavaScript
 */
export function SandpackVanilla({
  code,
  filename = '/index.js',
  title,
  description,
  height = '400px',
  showConsole = false,
}: {
  code: string
  filename?: string
  title?: string
  description?: string
  height?: string
  showConsole?: boolean
}) {
  return (
    <Sandpack
      template="vanilla"
      files={{
        [filename]: code,
      }}
      title={title}
      description={description}
      height={height}
      showConsole={showConsole}
      showNavigator={false}
    />
  )
}

