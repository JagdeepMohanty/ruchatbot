# University Admission Chatbot

A production-ready frontend application for a University Admission Chatbot built with React, Vite, and Tailwind CSS.

## 🚀 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **React Icons** - Icon library
- **ESLint & Prettier** - Code quality and formatting

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (Navbar, Footer, Hero, etc.)
│   ├── chat/            # Chat-specific components
│   └── common/          # Reusable components (Loader, etc.)
├── pages/               # Page components
├── styles/              # Global CSS and Tailwind config
├── constants/           # Application constants
├── data/                # Static data
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── App.jsx              # Main app component
```

## 📄 Pages

- **Home** (`/`) - Landing page with hero, features, how it works, and CTA
- **Chatbot** (`/chatbot`) - Interactive chatbot interface
- **404** - Not found page

## 🎨 Design

- Modern, clean UI inspired by Microsoft, Notion, OpenAI
- Color palette: White, Blue, Indigo, Gray
- Fully responsive (mobile-first approach)
- Smooth animations with Framer Motion
- Pixel-perfect alignment

## 🛠️ Development

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Lint code
```bash
npm run lint
```

### Format code
```bash
npx prettier --write .
```

## 📋 Components

### Layout
- **Navbar** - Navigation bar with mobile menu
- **Footer** - Footer with links and social
- **Hero** - Hero section with CTA
- **Features** - Features showcase
- **HowItWorks** - Step-by-step guide
- **Sidebar** - Chat history sidebar

### Chat
- **ChatWindow** - Main chat display area
- **ChatBubble** - Individual message bubbles
- **InputBox** - Message input field
- **SuggestedQuestions** - Quick question suggestions
- **TypingIndicator** - Bot typing animation

### Common
- **Loader** - Loading indicator

## 🎯 Features

- ✅ Production-ready folder structure
- ✅ Modular and reusable components
- ✅ Clean code architecture
- ✅ Fully responsive design
- ✅ Smooth animations
- ✅ Modern UI/UX
- ✅ ESLint & Prettier configured
- ✅ Tailwind CSS with custom theme

## 🔄 Phase 1 Complete

This is the UI foundation. Chatbot logic will be implemented in Phase 2.

## 📝 Notes

- No backend or database integration
- Frontend-only implementation
- Ready for API integration in future phases
