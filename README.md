# YouTube Web Application

A YouTube content management web application built with Next.js 15, React 19, and TypeScript. Features a clean dashboard interface for managing video content with comprehensive automated testing.

## 🚀 Project Overview

This application provides a web interface for YouTube content management with the following pages:
- **Dashboard**: Overview with statistics and quick actions
- **Video Management**: Browse and manage videos with phase filtering
- **Create Video**: Add new video content
- **Video Edit**: Modify existing videos

### Latest Features
- **Phase Filter Bar**: Production-ready component with real API integration
- **Video Phase Management**: Filter videos by production phases (Published, Started, etc.)
- **Visual Design System**: Consistent styling with yellow accent colors and mockup alignment

## 🛠️ Technology Stack

**Frontend:**
- Next.js 15.3.2 with Turbopack
- React 19.0.0
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

**Testing:**
- Puppeteer 24.9.0
- Custom optimized test runner
- 14 comprehensive tests covering all pages
- Lightning-fast execution (~1.2 seconds)

## 📁 Project Structure

```
youtube-web/
├── app/                    # Next.js application
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx           # Dashboard homepage
│   │       ├── layout.tsx         # App layout
│   │       ├── components/
│   │       │   ├── Header.tsx        # Navigation header
│   │       │   └── PhaseFilterBar.tsx # Video phase filtering
│   │       ├── videos/page.tsx       # Video management page
│   │       ├── create/page.tsx    # Video creation page
│   │       └── edit/page.tsx      # Video editing page
│   ├── public/            # Static assets and logos
│   └── package.json       # App dependencies
├── tests/
│   └── test-runner.js     # Optimized Puppeteer test suite
├── mock/                  # Mock server and HTML templates
├── run-tests.js          # Test execution guide
└── package.json          # Root dependencies (Puppeteer)
```

## 🧪 Testing

The project features a comprehensive automated testing suite with optimal performance:

### Test Coverage
- ✅ Homepage structure and content validation
- ✅ Navigation functionality across all pages
- ✅ Video Management page with Phase Filter Bar
- ✅ Create page form detection
- ✅ Edit page functionality
- ✅ Performance metrics (page load times)
- ✅ UI element presence and interaction
- ✅ Cross-page navigation flows

### Running Tests
```bash
# From the app directory (recommended)
cd app && npm test

# Direct execution
node tests/test-runner.js

# View test guide
npm run test:guide
```

### Test Performance
- **Execution Time**: ~1.2 seconds for 14 comprehensive tests
- **Success Rate**: 100% (14/14 tests passing)
- **Optimization**: Batched DOM evaluations, minimal navigation
- **Browser**: Headless Chrome with optimized flags

## 🚦 Getting Started

### Prerequisites
- Node.js (latest LTS recommended)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/vfarcic/youtube-web.git
cd youtube-web

# Install root dependencies (Puppeteer)
npm install

# Install app dependencies
cd app
npm install
```

### Development
```bash
# Start development server
cd app
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

The application will be available at `http://localhost:3000`

## 📊 Current Status

**Development Stage**: Phase Filter Bar Complete
- ✅ Project structure established
- ✅ Navigation and routing configured
- ✅ Video Management page with phase filtering
- ✅ PhaseFilterBar component with API integration
- ✅ Comprehensive test suite operational
- ✅ Visual design alignment with mockups
- ✅ Production-ready error handling and fallbacks
- 🚀 Ready for additional feature development (video CRUD operations, advanced filtering).

## 🔧 Development Features

- **Hot Reload**: Turbopack for fast development
- **Type Safety**: Full TypeScript implementation
- **Modern CSS**: Tailwind CSS 4 integration
- **Code Quality**: ESLint configuration
- **Testing**: Automated browser testing with Puppeteer

## 📝 Notes

This is a foundational implementation with a production-ready Phase Filter Bar component. The Video Management page features comprehensive phase filtering with real API integration, fallback handling, and visual design aligned with mockups. The robust testing infrastructure and clean architecture provide a solid foundation for continued feature development.

The Phase Filter Bar implementation is complete with "Started" as default selection, stable button ordering, and production-ready error handling.
