# Faithful Bible Devotion App - Development Rules & Guidelines

## Core Principles

### 1. Privacy-First Architecture
- **Default Privacy**: All devotions are private by default
- **Explicit Consent**: Users must actively choose to share publicly before saving
- **Clear Indicators**: Visual cues (lock/globe icons) must be present throughout UI
- **Anonymous Sharing**: Public devotions never reveal personal identifying information
- **Privacy Audit**: Track all privacy changes with timestamps and user actions

### 2. Spiritual Content Integrity
- **Theological Accuracy**: All Bible verses must be validated through Gemini API
- **Content Moderation**: Implement community guidelines and reporting for public devotions
- **Respectful AI**: AI-generated content should enhance, not replace, personal spiritual reflection
- **Source Attribution**: Always cite Bible version (default NIV) and provide proper references

### 3. Technical Stack Constraints
- **Single API Strategy**: Use only Gemini API for all AI functionality
- **Component Library**: Exclusively use shadcn/ui components for consistency
- **Database**: PostgreSQL only - no exceptions for core functionality
- **Icons**: Lucide React only for visual consistency
- **Authentication**: Laravel built-in authentication system only

## Development Guidelines

### 4. User Experience Standards
- **Response Time**: Maximum 2 seconds for devotion creation workflow
- **Mobile-First**: Design for mobile devices first, then scale up
- **Progressive Enhancement**: Core functionality must work without JavaScript
- **Accessibility**: WCAG 2.1 AA compliance for all interactive elements
- **Offline Capability**: PWA features for accessing saved devotions

### 5. AI Integration Rules
- **Cost Optimization**: Cache frequently requested verses in PostgreSQL
- **Rate Limiting**: Implement smart API call management to prevent abuse
- **Fallback Strategy**: Graceful degradation when Gemini API is unavailable
- **Content Quality**: AI suggestions must be contextually appropriate and biblically sound
- **User Control**: Users can always override AI suggestions

### 6. Feature Development Priorities
- **MVP First**: Core devotion creation, privacy controls, and basic public feed
- **Incremental Enhancement**: Add AI features only after core functionality is stable
- **Community Features**: Public sharing and moderation systems come after private functionality
- **Advanced Features**: PWA, analytics, and community engagement are Phase 4 priorities

## Technical Architecture Rules

### 7. Database Design Standards
- **Normalization**: Follow 3NF principles for all core tables
- **Audit Trails**: Track privacy changes and user actions for security
- **Performance**: Index all frequently queried fields (user_id, is_public, created_at)
- **Scalability**: Design schema to handle 10,000+ users and 100,000+ devotions

### 8. API Design Principles
- **RESTful Routes**: Follow Laravel resource routing conventions
- **Validation**: Server-side validation for all user inputs
- **Error Handling**: Graceful error responses with user-friendly messages
- **Caching**: Implement smart caching for Bible verses and AI responses

### 9. Security Requirements
- **Input Sanitization**: Sanitize all user-generated content before storage
- **CSRF Protection**: Laravel CSRF tokens on all forms
- **Rate Limiting**: Prevent abuse of AI features and devotion creation
- **Content Filtering**: Moderate public devotions for inappropriate content

## Content Guidelines

### 10. Community Standards
- **Family-Friendly**: All public content must be appropriate for all ages
- **Denominational Neutrality**: Avoid sectarian theological positions
- **Encouraging Tone**: Promote positive, uplifting spiritual content
- **Spam Prevention**: Prevent duplicate or low-quality devotion submissions

### 11. Mood-Based Matching Rules
- **Predefined Categories**: Anxiety, gratitude, struggle, joy, confusion
- **Custom Input**: Allow free-text mood description for personalized suggestions
- **Contextual Suggestions**: Match verses to emotional states appropriately
- **Balanced Responses**: Provide hope alongside acknowledgment of difficult emotions

## Performance Standards

### 12. Optimization Requirements
- **Page Load**: Initial page load under 3 seconds on 3G connection
- **Database Queries**: Maximum 5 queries per devotion display
- **Image Optimization**: Compress all images to WebP format where possible
- **CDN Usage**: Serve static assets from CDN for global performance

### 13. Testing Standards
- **Unit Tests**: Minimum 80% code coverage for core functionality
- **Integration Tests**: Test all API endpoints and database interactions
- **User Acceptance**: Test devotion creation workflow with real users
- **Performance Tests**: Load testing for concurrent user scenarios

## Deployment & Operations

### 14. Environment Management
- **Development**: Local Laravel Sail environment for all developers
- **Staging**: Production-like environment for final testing
- **Production**: Secure, monitored environment with automated backups
- **Configuration**: Environment-specific settings via .env files only

### 15. Monitoring & Maintenance
- **Error Tracking**: Log all application errors with user context
- **Performance Monitoring**: Track API response times and database query performance
- **User Analytics**: Privacy-respecting analytics for feature usage
- **Backup Strategy**: Daily automated backups of user data and devotions

## Decision-Making Framework

### 16. When to Consult These Rules
- **Before implementing any new feature**
- **When making technical architecture decisions**
- **When designing user interfaces or workflows**
- **When integrating third-party services or APIs**
- **When handling user data or privacy concerns**

### 17. Rule Exceptions
- **Documentation Required**: Any deviation must be documented with reasoning
- **Team Approval**: Exceptions require approval from technical lead
- **Testing Impact**: Additional testing required for rule deviations
- **Rollback Plan**: Must have clear rollback strategy for exceptions

## Success Criteria Alignment

### 18. Measurement Standards
- **User Engagement**: Track devotion creation rate and session duration
- **Technical Performance**: Monitor API response times and error rates
- **Community Health**: Measure public devotion quality and user satisfaction
- **Privacy Compliance**: Audit privacy setting usage and user understanding

---

*These rules serve as the foundation for all development decisions in the Faithful Bible devotion app. They should be reviewed and updated as the project evolves, but core principles around privacy, spiritual integrity, and technical excellence remain constant.*