"use client"

import { useEffect, useRef } from 'react'
import Script from 'next/script'

type MathJaxProviderProps = {
  children?: React.ReactNode
}

// Loads MathJax once and exposes a typeset routine for children
export function MathJaxProvider({ children }: MathJaxProviderProps) {
  return (
    <>
      <Script id="mathjax-config" strategy="afterInteractive">
        {`
          window.MathJax = {
            tex: {
              inlineMath: [["$","$"], ["\\(","\\)"]],
              displayMath: [["$$","$$"], ["\\[","\\]"]],
              processEscapes: true,
              processEnvironments: true
            },
            options: {
              skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
              enableMenu: false
            },
            svg: { fontCache: 'global' }
          };
        `}
      </Script>
      <Script
        id="mathjax-script"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        strategy="afterInteractive"
      />
      <Script id="mathjax-ready" strategy="afterInteractive">
        {`
          (function(){
            var notifyReady = function(){
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('mathjax-ready'));
              }
            };
            if (typeof window !== 'undefined') {
              var mj = window.MathJax;
              if (mj && mj.startup && mj.startup.promise) {
                mj.startup.promise.then(notifyReady);
              } else {
                // Fallback: wait a bit and try again
                setTimeout(function(){
                  var mj2 = window.MathJax;
                  if (mj2 && mj2.startup && mj2.startup.promise) {
                    mj2.startup.promise.then(notifyReady);
                  } else {
                    notifyReady();
                  }
                }, 200);
              }
            }
          })();
        `}
      </Script>
      {children}
    </>
  )
}

type MathProps = {
  children: string
}

// Inline math: `$...$` without extra block spacing
export function InlineMath({ children }: MathProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const render = async () => {
      try {
        const MJ = (window as any).MathJax
        if (typeof window !== 'undefined' && MJ?.tex2svgPromise) {
          const svgNode = await MJ.tex2svgPromise(children, { display: false })
          // MathJax returns an <svg> inside a wrapper span; extract the SVG
          const svg = svgNode.firstElementChild as SVGElement | null
          el.replaceChildren(svg ? svg : svgNode)
        } else {
          el.textContent = children
        }
      } catch {
        el.textContent = children
      }
    }
    if (typeof window !== 'undefined' && (window as any).MathJax?.tex2svgPromise) {
      render()
    } else {
      const onReady = () => render()
      window.addEventListener('mathjax-ready', onReady, { once: true })
      return () => window.removeEventListener('mathjax-ready', onReady)
    }
  }, [children])

  return <span ref={ref} className="align-baseline" />
}

// Block math: `$$...$$` with display styling
export function BlockMath({ children }: MathProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const render = async () => {
      try {
        const MJ = (window as any).MathJax
        if (typeof window !== 'undefined' && MJ?.tex2svgPromise) {
          const svgNode = await MJ.tex2svgPromise(children, { display: true })
          const svg = svgNode.firstElementChild as SVGElement | null
          el.replaceChildren(svg ? svg : svgNode)
        } else {
          el.textContent = children
        }
      } catch {
        el.textContent = children
      }
    }
    if (typeof window !== 'undefined' && (window as any).MathJax?.tex2svgPromise) {
      render()
    } else {
      const onReady = () => render()
      window.addEventListener('mathjax-ready', onReady, { once: true })
      return () => window.removeEventListener('mathjax-ready', onReady)
    }
  }, [children])

  return <div ref={ref} className="my-4 overflow-x-auto" />
}

// Convenience wrapper to ensure MathJax scripts are present around MDX sections
export function MathJax({ children }: MathJaxProviderProps) {
  return <MathJaxProvider>{children}</MathJaxProvider>
}


