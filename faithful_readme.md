# Faithful - AI-Enhanced Bible Devotion App

> **Transform your Bible study into an interactive, personalized spiritual journey**

Faithful is a modern web application that combines traditional devotional practices with AI-powered assistance to help users create meaningful, mood-based spiritual content and connect with a community of believers.

## ✨ Features

### 🤖 AI-Powered Devotion Creation
- **Smart Verse Lookup**: Enter any Bible reference (e.g., "John 3:16") and AI automatically fetches the NIV verse content
- **AI Writing Assistant**: Generate devotion titles and content based on your selected mood and verse
- **Mood-Based Verse Suggestions**: Get personalized verse recommendations based on your emotional state
- **Intelligent Content Generation**: AI creates contextual, faith-focused devotion content with prayers

### 🎭 Emotional Intelligence
- **20+ Mood Categories**: From Anxious to Joyful, Peaceful to Struggling - find verses that match your feelings
- **Mood Detection**: AI can analyze verse content to suggest appropriate emotional categories
- **Personalized Discovery**: Browse verses specifically curated for your current emotional state

### 🔒 Privacy-First Design
- **Granular Privacy Controls**: Keep devotions private or share with the community
- **Bulk Privacy Management**: Update multiple devotions' visibility at once
- **Anonymous Community Sharing**: Public devotions show no personal identifying information
- **Privacy Statistics**: Track your public vs private devotion counts

### 📚 Personal Devotion Library
- **Smart Dashboard**: View, search, and filter your personal devotions
- **Privacy Filtering**: View private-only, public-only, or all devotions
- **Recent Activity**: Quick access to your latest spiritual reflections
- **Search & Filter**: Find specific devotions by title, verse, mood, or content

### 🌐 Community Features
- **Public Inspiration Feed**: Browse community devotions without authentication
- **Mood-Based Filtering**: Discover devotions that match your emotional needs
- **Community Statistics**: See total users, devotions, and mood distributions
- **Infinite Scroll**: Seamlessly load more community content

### 🎯 Discovery & Inspiration
- **Daily Verse Suggestions**: Get fresh spiritual content recommendations
- **Mood-Based Discovery**: Find verses that speak to your current emotional state
- **Quick Devotion Creation**: Start writing from any discovered verse
- **Non-authenticated Browsing**: Explore content before creating an account

## 🛠 Tech Stack

### Backend
- **Framework**: Laravel 12 with built-in authentication
- **Database**: PostgreSQL with Eloquent ORM
- **AI Integration**: Google Gemini 2.0 Flash API
- **API**: RESTful endpoints with JSON responses
- **Middleware**: Custom prevent-back navigation, appearance handling

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.0
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS 4.0 with custom animations
- **State Management**: Inertia.js for seamless SPA experience
- **Icons**: Lucide React icon library

### Development Tools
- **Code Quality**: ESLint, Prettier, TypeScript
- **Testing**: Pest PHP testing framework
- **Package Management**: Composer (PHP), npm (Node.js)

## 🚀 Getting Started

### Prerequisites

- PHP 8.4+
- Herd
- Table Plus (or any database management)
- Node.js 18+
- PostgreSQL 13+
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nethaiah/faithful.git
   cd faithful
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   composer install
   
   # Frontend dependencies
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure your `.env` file**
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=faithful_app
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Database setup**
   ```bash
   php artisan migrate
   ```

6. **Build frontend assets**
   ```bash
   npm run build
   ```

7. **Start the development server**
   ```bash
   # Using the convenient dev script
   composer run dev
   
   # Or manually
   php artisan serve
   npm run dev
   ```

Visit `http://localhost:8000` to see the application running!

## 📊 Database Schema

### Core Tables

#### `users`
- `id`, `name`, `email`, `password`, `default_privacy`
- Email verification and password reset functionality
- One-to-many relationship with devotions

#### `devotions`
- `id`, `user_id`, `mood`, `verse`, `verse_content`, `title`, `devotion`, `is_private`
- Privacy controls with boolean flag
- Full-text search capabilities
- Timestamps for creation and updates

### Relationships
- Users have many devotions
- Devotions belong to users
- Privacy controls ensure data isolation

## 🤖 AI Integration

The app leverages Google Gemini 2.0 Flash API for:

### Verse Content Retrieval
- **Automatic Lookup**: Fetch NIV Bible verse content by reference
- **Error Handling**: Graceful fallbacks for invalid references
- **Caching**: Minimize API calls for frequently accessed verses

### Content Generation
- **Devotion Titles**: AI-generated engaging titles based on verse and mood
- **Devotion Content**: Contextual spiritual reflections with prayers
- **Mood Detection**: Analyze verse content to suggest emotional categories

### Verse Suggestions
- **Mood-Based Matching**: Curated verse recommendations for emotional states
- **JSON Response Parsing**: Structured data for frontend consumption
- **Rate Limiting**: Efficient API usage with proper error handling

## 🎯 Current Implementation Status

### ✅ Completed Features
- **Authentication System**: Full Laravel Breeze integration with email verification
- **Devotion Creation**: Complete workflow with AI assistance
- **Privacy System**: Granular controls with bulk management
- **Personal Dashboard**: Search, filter, and manage personal devotions
- **Community Feed**: Public devotion browsing with infinite scroll
- **Discovery Page**: Mood-based verse suggestions for non-authenticated users
- **AI Integration**: Gemini API for verse lookup, content generation, and suggestions
- **Responsive Design**: Mobile-first approach with modern UI components

### 🚧 In Progress
- **Advanced Search**: Enhanced filtering and search capabilities
- **Community Moderation**: Content reporting and management system
- **User Profiles**: Enhanced user information and statistics

### 📋 Planned Features
- **Progressive Web App (PWA)**: Offline capabilities and mobile app experience
- **Voice-to-Text**: Speech input for devotion creation
- **Dark Mode**: Theme switching functionality
- **Export Options**: PDF generation and sharing capabilities
- **Community Engagement**: Comments, likes, and social features

## 🎨 Design Principles

- **Privacy First**: Users maintain complete control over their content visibility
- **Mobile-Responsive**: Seamless experience across all device sizes
- **Accessibility**: WCAG 2.1 AA compliance with semantic HTML
- **Performance**: Optimized loading with lazy loading and efficient API calls
- **Spiritual Sensitivity**: Respectful handling of religious content and diverse faith perspectives

## 🔧 Development

### Available Scripts

```bash
# Development
composer run dev          # Start all development servers
npm run dev              # Start Vite development server
php artisan serve        # Start Laravel development server

# Building
npm run build           # Build for production
npm run build:ssr       # Build with SSR support

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run types          # TypeScript type checking

# Database
php artisan migrate     # Run migrations
```

### Project Structure

```
faithful/
├── app/
│   ├── Http/Controllers/     # Laravel controllers
│   │   ├── Api/             # API endpoints for AI features
│   │   └── Auth/            # Authentication controllers
│   ├── Models/              # Eloquent models
│   └── Services/            # Gemini AI service
├── resources/js/
│   ├── components/          # React components
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Inertia.js pages
│   └── types/              # TypeScript definitions
├── routes/                 # Laravel routes
└── database/              # Migrations and seeders
```

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting PRs.

### Development Guidelines
- Follow PSR-12 coding standards for PHP
- Use ESLint and Prettier for JavaScript/React code
- Write tests for new features
- Update documentation as needed

### Setting up for Development
```bash
# Run tests
composer run test
npm run test

# Code formatting
composer run format
npm run format

# Static analysis
npm run types
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for intelligent content generation
- **shadcn/ui** for beautiful, accessible UI components
- **Laravel Community** for the excellent framework
- **Inertia.js** for seamless SPA experience
- **Open Source Contributors** who make projects like this possible

## 📞 Support

- 📧 Email: maestrojomar143@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Nethaiah/faithful.git/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Nethaiah/faithful.git/discussions)

## 🌟 Show Your Support

If this project helps you in your spiritual journey, please consider:
- ⭐ Starring the repository
- 🍴 Forking the project
- 📢 Sharing with your community
- 🤝 Contributing to development

---

**"Your word is a lamp for my feet, a light on my path." - Psalm 119:105**

Built with ❤️ for the Christian community
