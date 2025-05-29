# YouTube Web Application

A YouTube content management web application built with Next.js 15, React 19, and TypeScript. Features a clean dashboard interface for managing video content with comprehensive automated testing.

## 🚀 Project Overview

This application provides a web interface for YouTube content management with the following pages:
- **Dashboard**: Overview with statistics and quick actions
- **Video List**: Browse and manage videos
- **Create Video**: Add new video content
- **Video Edit**: Modify existing videos

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
│   │       │   └── Header.tsx     # Navigation header
│   │       ├── videos/page.tsx    # Video list page
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
- ✅ Videos page content verification
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

**Development Stage**: Foundational setup complete
- ✅ Project structure established
- ✅ Navigation and routing configured
- ✅ Basic page layouts implemented
- ✅ Comprehensive test suite operational
- ✅ Initial project setup, documentation, and testing infrastructure complete.
- 🚀 Ready for core feature development (e.g., form implementations, data management).

## 🔧 Development Features

- **Hot Reload**: Turbopack for fast development
- **Type Safety**: Full TypeScript implementation
- **Modern CSS**: Tailwind CSS 4 integration
- **Code Quality**: ESLint configuration
- **Testing**: Automated browser testing with Puppeteer

## 📝 Notes

This is a foundational implementation focusing on solid architecture and testing infrastructure. The current pages display placeholder content with proper navigation structure, ready for feature implementation.

The initial phase of project setup, including robust testing and comprehensive documentation, is now complete. The project is well-poised for the development of core application features.
