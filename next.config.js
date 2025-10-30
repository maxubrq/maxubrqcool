const rehypeShiki = require('@shikijs/rehype').default
const remarkGfm = require('remark-gfm').default
const remarkMath = require('remark-math').default
const rehypeKatex = require('rehype-katex').default

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [
      [
        rehypeShiki,
        {
          themes: {
            light: 'github-light',
            dark: 'one-dark-pro',
          },
          defaultColor: 'dark',
        },
      ],
      [rehypeKatex, {
        inlineClass: 'inline-math',
        displayClass: 'display-math',
        throwOnError: true,
      }],
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dmsb4anlx/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = withMDX(nextConfig)
