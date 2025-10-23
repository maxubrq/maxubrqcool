# Maxubrqcool - Interactive Personal Blog

A modern, interactive personal blog built with Next.js 14, TypeScript, Tailwind CSS, and **MDX** for rich, interactive content.

## ✨ Features

- 🚀 **Next.js 14** with App Router
- 📝 **MDX Support** for interactive blog posts
- 🎨 **Tailwind CSS** for styling
- 📱 **Responsive Design** for all devices
- ⚡ **Static Site Generation** for fast loading
- 🔍 **SEO Optimized** with proper meta tags
- 📊 **TypeScript** for type safety
- 🎯 **Interactive Components** - Quizzes, counters, code playgrounds, and more!

## 🎮 Interactive Components

Your blog now includes powerful interactive components:

- **Counter** - Interactive counters for engagement
- **Quiz** - Knowledge testing with immediate feedback
- **CodePlayground** - Live code execution
- **Tabs** - Organized content presentation
- **ProgressBar** - Step-by-step progress tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd maxubrqcool
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
maxubrqcool/
├── app/                           # Next.js App Router
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── about/                    # About page
│   └── posts/[id]/               # Dynamic blog post pages
├── components/                    # React components
│   ├── InteractiveComponents.tsx # Interactive components
│   └── MDXComponents.tsx         # MDX component configuration
├── lib/                          # Utility functions
│   └── posts.ts                  # Blog post handling
├── posts/                        # MDX blog posts
│   ├── hello-world.mdx
│   ├── getting-started-with-nextjs.mdx
│   └── interactive-components-showcase.mdx
└── public/                       # Static assets
```

## 📝 Creating Interactive Blog Posts

### Basic MDX Post

Create a new `.mdx` file in the `posts/` directory:

```mdx
---
title: 'Your Interactive Post'
date: '2024-01-15'
excerpt: 'A brief description of your interactive post'
---

# Your Interactive Content

Write your content using markdown and include interactive components:

<Counter initialValue={0} />

<Quiz 
  question="What makes this blog special?"
  options={[
    "It's fast",
    "It's interactive",
    "It's beautiful",
    "All of the above"
  ]}
  correctAnswer={3}
/>
```

### Available Interactive Components

#### Counter
```mdx
<Counter initialValue={5} />
```

#### Quiz
```mdx
<Quiz 
  question="Your question here?"
  options={["Option 1", "Option 2", "Option 3", "Option 4"]}
  correctAnswer={1}
/>
```

#### Code Playground
```mdx
<CodePlayground 
  initialCode="console.log('Hello World!')"
  language="javascript"
/>
```

#### Tabs
```mdx
<Tabs tabs={[
  {
    label: "Tab 1",
    content: <div>Content for tab 1</div>
  },
  {
    label: "Tab 2", 
    content: <div>Content for tab 2</div>
  }
]} />
```

#### Progress Bar
```mdx
<ProgressBar 
  steps={['Step 1', 'Step 2', 'Step 3']}
  currentStep={1}
/>
```

## 🎨 Customization

### Adding New Interactive Components

1. Create your component in `components/InteractiveComponents.tsx`:

```tsx
export function MyCustomComponent({ title }: { title: string }) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3>{title}</h3>
      {/* Your interactive content */}
    </div>
  )
}
```

2. Add it to `components/MDXComponents.tsx`:

```tsx
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // ... existing components
    MyCustomComponent,
    ...components,
  }
}
```

3. Use it in your MDX files:

```mdx
<MyCustomComponent title="Hello World!" />
```

### Styling
- Modify `app/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Edit components in the `components/` directory

### Content
- Update `app/layout.tsx` for site metadata
- Modify `app/page.tsx` for the homepage
- Edit `app/about/page.tsx` for the about page

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
The blog can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📚 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🛠️ Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **MDX** - Interactive markdown with React components
- **Gray Matter** - Frontmatter parsing
- **Date-fns** - Date formatting

## 🎯 Interactive Content Ideas

- **Tutorials** with step-by-step progress bars
- **Knowledge tests** with interactive quizzes
- **Code examples** with live playgrounds
- **Product demos** with interactive counters
- **Learning paths** with progress tracking
- **Surveys** with interactive forms

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy blogging with interactive content!** 🎉
