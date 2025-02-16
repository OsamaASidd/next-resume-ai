<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/9113740/201498864-2a900c64-d88f-4ed4-b5cf-770bcb57e1f5.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/9113740/201498152-b171abb8-9225-487a-821c-6ff49ee48579.png">
</picture>

<div align="center">
  <h1>Next Resume Builder</h1>
  <p>Modern resume builder with AI-powered content generation and multiple template designs</p>
</div>

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with React 19
- **Authentication:** [Clerk](https://clerk.com/)
- **PDF Generation:** [@react-pdf/renderer](https://react-pdf.org/)
- **AI Integration:** [Google AI (Gemini)](https://ai.google.dev/)
- **Database:**
  - [Drizzle ORM](https://orm.drizzle.team/)
  - [Neon Database](https://neon.tech/)
- **Styling:**
  - [Tailwind CSS](https://tailwindcss.com)
  - [Shadcn UI](https://ui.shadcn.com)
- **Forms & Validation:**
  - [React Hook Form](https://react-hook-form.com/)
  - [Zod](https://zod.dev)

## ✨ Key Features

- 🤖 AI-powered resume content generation
- 📝 Multiple professional resume templates
- 🎨 Real-time PDF preview
- 📱 Responsive split-pane editor
- 👤 Profile-based resume management
- 🔄 Multi-step resume creation flow
- 📋 Comprehensive resume sections:
  - Personal Details
  - Work Experience
  - Education
  - Skills
  - Tools
  - Languages
- 💾 Auto-save functionality
- 📤 Export to PDF
- 🌓 Dark/Light mode

## Getting Started

Clone the repo:

```
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter.git
```

- `pnpm install` ( we have legacy-peer-deps=true added in the .npmrc)
- Create a `.env.local` file by copying the example environment file:
  `cp env.example.txt .env.local`
- Add the required environment variables to the `.env.local` file.
- `pnpm run dev`

You should now be able to access the application at http://localhost:3000.

> [!WARNING]
> After cloning or forking the repository, be cautious when pulling or syncing with the latest changes, as this may result in breaking conflicts.

Cheers! 🥂
