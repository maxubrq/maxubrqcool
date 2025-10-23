const rehypeShiki = require('@shikijs/rehype').default

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
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
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
}

module.exports = withMDX(nextConfig)
