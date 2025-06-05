# Faithful - AI-Enhanced Bible Devotion App

> **Transform your Bible study into an interactive, personalized spiritual journey**

Faithful is a modern web application that combines traditional devotional practices with AI-powered assistance to help users create meaningful, mood-based spiritual content and connect with a community of believers.

## ✨ Features

### 🤖 Smart Devotion Creation
- **AI-Powered Writing Assistant**: Get help understanding verses and applying them to daily life
- **Auto-Populated Verses**: Simply enter a reference (e.g., "John 3:16") and let AI fetch the content
- **Intelligent Suggestions**: Receive contextual prompts to guide your devotion writing

### 🎭 Mood-Based Verse Discovery
- **Emotional Matching**: Find verses that speak to your current state of mind
- **Mood Categories**: Anxiety → Peace, Gratitude → Praise, Struggle → Hope, and more
- **Custom Mood Input**: Describe your feelings in your own words for personalized suggestions

### 🔒 Privacy-First Sharing
- **Choose Your Audience**: Keep devotions private or share with the community
- **Anonymous Sharing**: Public devotions show no personal identifying information
- **Privacy Controls**: Change visibility settings anytime with clear visual indicators

### 📚 Personal Library Management
- **Smart Organization**: Tag, categorize, and search your devotions
- **Export Options**: Generate PDFs or share devotions with others
- **Privacy Filtering**: View private-only, public-only, or all devotions

### 🌐 Community Blog Feed
- **Public Inspiration**: Non-authenticated users can browse community devotions
- **Featured Content**: Algorithm-selected quality devotions for daily inspiration
- **Community Guidelines**: Moderated content with reporting system

## 🛠 Tech Stack

- **Backend**: Laravel 12 with built-in authentication
- **Frontend**: React (Laravel Starter Kit integration)
- **UI Framework**: shadcn/ui components
- **Database**: PostgreSQL
- **Icons**: Lucide React
- **AI Integration**: Gemini API
- **Hosting**: Web-based application with PWA capabilities

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- PostgreSQL 13+
- Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/faithful-bible-app.git
   cd faithful-bible-app
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
   php artisan db:seed
   ```

6. **Build frontend assets**
   ```bash
   npm run build
   ```

7. **Start the development server**
   ```bash
   php artisan serve
   npm run dev
   ```

Visit `http://localhost:8000` to see the application running!

## 📊 Database Schema

### Core Tables
- **`devotions`**: User-created devotional content with privacy controls
- **`bible_verses`**: Cached verses to minimize API calls
- **`user_settings`**: User preferences and configuration
- **`devotion_privacy_log`**: Audit trail for privacy changes
- **`devotion_reports`**: Community moderation system

## 🤖 AI Integration

The app leverages Gemini API for:
- **Verse Lookup**: Automatic fetching of Bible verse content
- **Devotion Assistance**: Contextual writing help and spiritual insights
- **Mood Matching**: Intelligent verse suggestions based on emotional state
- **Content Validation**: Ensuring biblical accuracy and proper formatting

## 🎯 Roadmap

### Phase 1: MVP ✅
- [x] Basic authentication and user management
- [x] Simple devotion creation workflow
- [x] Privacy system with public/private toggle
- [x] Personal devotion library
- [x] Basic public blog feed

### Phase 2: AI Integration 🚧
- [ ] Gemini API integration for verse lookup
- [ ] Mood-based verse suggestions
- [ ] AI-assisted devotion writing
- [ ] Enhanced public feed with featured content

### Phase 3: Enhanced UX 📋
- [ ] Advanced privacy controls
- [ ] Mobile-responsive design
- [ ] Community moderation system
- [ ] Advanced search and filtering

### Phase 4: Advanced Features 🔮
- [ ] Progressive Web App (PWA) capabilities
- [ ] Voice-to-text input
- [ ] Dark mode support
- [ ] Community engagement features

## 🎨 Design Principles

- **Privacy First**: Users control their content visibility
- **Mobile-Responsive**: Seamless experience across all devices
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: <2 second load times
- **Spiritual Sensitivity**: Respectful handling of religious content

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Development Guidelines
- Follow PSR-12 coding standards for PHP
- Use ESLint and Prettier for JavaScript/React code
- Write tests for new features
- Update documentation as needed

### Setting up for Development
```bash
# Run tests
php artisan test
npm run test

# Code formatting
composer run format
npm run format

# Static analysis
composer run analyse
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bible Gateway API** for verse content
- **shadcn/ui** for beautiful UI components
- **Laravel Community** for the excellent framework
- **Open Source Contributors** who make projects like this possible

## 📞 Support

- 📧 Email: support@faithful-app.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/faithful-bible-app/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/faithful-bible-app/discussions)

## 🌟 Show Your Support

If this project helps you in your spiritual journey, please consider:
- ⭐ Starring the repository
- 🍴 Forking the project
- 📢 Sharing with your community
- 🤝 Contributing to development

---

**"Your word is a lamp for my feet, a light on my path." - Psalm 119:105**

Built with ❤️ for the Christian community