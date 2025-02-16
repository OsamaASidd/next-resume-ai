# Next Resume ✨  
*AI-Powered, Privacy-First Resume Builder*  

[![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-%2361DAFB?logo=react)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<div align="center">
  <img src="your-demo-gif-url-here" width="800" alt="ResumeCraft Demo">
</div>

## 🚀 Features  
- **AI-Powered Tailoring**  
  Paste a job description → Get a resume optimized for ATS and human readers.  

- **Multi-Profile System**  
  Create different profiles (e.g., "Frontend Dev", "Fullstack Engineer").  

- **Client-Side Magic**  
  PDF generation happens in your browser – no data leaves your device.  

- **Smart Sync**  
  Clerk authentication + PostgreSQL backend keeps your profiles secure and synced.  

- **Stepper Workflow**  
  Guided process: Pick profile → Add job details → AI magic → Download PDF.  

## 🔧 Tech Stack  
![Tech Stack](https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,postgres,nodejs,openai)  

| Component       | Technology                          |
|-----------------|-------------------------------------|
| Frontend        | Next.js 13, React 18, React PDF     |
| Authentication  | Clerk                               |
| Backend         | Hono (Edge-ready), PostgreSQL       |
| AI Engine       | OpenAI GPT-3.5/4                    |
| Styling         | Tailwind CSS                        |

## ⚡ Quick Start  

### Prerequisites  
- Node.js 18+  
- PostgreSQL  
- OpenAI API Key  

### Installation  
```bash
# Clone repo
git clone https://github.com/yourusername/resumecraft.git

# Install dependencies
cd resumecraft
pnpm install

# Set up environment variables
cp .env.example .env.local
