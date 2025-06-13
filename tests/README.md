# YouTube Web App - Testing Guide

This project uses a **consolidated test runner** with **page-based organization** and **focused testing** capabilities for efficient development and comprehensive validation.

## 🧪 Test Organization

### **Page-Based Tests** (UI/Component Tests)
- **Location**: `tests/pages/`
- **Purpose**: Test UI components, user interactions, and page functionality
- **Speed**: Fast (uses Puppeteer with real browser)
- **Dependencies**: Frontend server running on localhost:3000

### **Integration Tests** (API Tests)
- **Location**: `tests/integration/`
- **Purpose**: Test real API integration and backend connectivity
- **Speed**: Fast (direct API calls)
- **Dependencies**: Backend server running on localhost:8080

## 🚀 Quick Start

### Run All Tests (Recommended for Task Completion)
```bash
npm test
```

### Focused Testing (For Development)
```bash
# Test specific page during development
npm test -- --page=videos
npm test -- --page=homepage
npm test -- --page=aspect-selection

# Test only integration (API) tests
npm test -- --integration

# Test only UI/page tests
npm test -- --ui

# Verbose output for debugging
npm test -- --page=videos --verbose
```

## 📋 Available Test Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm test` | Run all tests (pages + integration) | Task completion validation |
| `npm test -- --page=videos` | Test videos page only | Developing video features |
| `npm test -- --page=homepage` | Test homepage only | Developing dashboard |
| `npm test -- --integration` | Test API integration only | Backend connectivity |
| `npm test -- --ui` | Test all pages only | Frontend development |
| `npm test -- --help` | Show usage help | Reference |

## 🏗️ Test Architecture

```
tests/
├── test-runner.js              # Consolidated test runner
├── pages/                      # Page-specific tests
│   ├── homepage.test.js        # Dashboard/homepage functionality
│   ├── videos.test.js          # Video grid, filtering, cards
│   ├── aspect-selection.test.js # Aspect selection page
│   ├── aspect-edit-form.test.js # Form editing and validation
│   ├── aspect-progress-tracking.test.js # Progress tracking
│   └── create.test.js          # Video creation page
├── integration/                # API integration tests
│   ├── backend-health.test.js  # Backend connectivity
│   ├── api-client.test.js      # API client functionality
│   └── string-based-ids.test.js # PRD #18 validation
└── utils/
    └── test-helpers.js         # Shared test utilities
```

## 🎯 Development Workflow

### **During Active Development**
```bash
# Quick feedback loop - test only what you're working on
npm test -- --page=videos        # Working on video features
npm test -- --page=aspect-edit-form  # Working on forms
npm test -- --integration        # Working on API integration
```

### **Before Committing/Task Completion**
```bash
# Comprehensive validation
npm test                         # Run everything
npm test -- --verbose           # Detailed output if needed
```

### **Debugging Failed Tests**
```bash
# Check specific components
npm test -- --page=homepage --verbose
npm test -- --integration --verbose

# Check backend connectivity first
npm test -- --integration
```

## 📊 Test Coverage

### **Page Tests** (UI/Component)
✅ **Homepage**: Navigation, content, performance  
✅ **Videos Page**: Grid display, filtering, cards  
✅ **Aspect Selection**: Page functionality, navigation  
✅ **Aspect Edit Form**: Form validation, submission  
✅ **Aspect Progress**: Progress tracking features  
✅ **Create Page**: Video creation workflow  

### **Integration Tests** (API)
✅ **Backend Health**: Connectivity, response times  
✅ **API Client**: Endpoint testing, data validation  
✅ **String-Based IDs**: PRD #18 compliance validation  

## 🔧 Requirements

### **For Page Tests**
- Frontend server running: `npm run dev` (in app directory)
- Browser dependencies: `npm install puppeteer`

### **For Integration Tests**
- Backend server running on localhost:8080
- API endpoints responding correctly

## 🎨 Benefits of This Structure

✅ **Page-Based Organization** - Tests mirror app structure  
✅ **Focused Testing** - Test only what you're working on  
✅ **Fast Feedback** - Quick iteration during development  
✅ **Comprehensive Validation** - Full test suite for task completion  
✅ **Clear Ownership** - Each page has its own test suite  
✅ **Easy Debugging** - Isolated test failures  
✅ **Parallel Development** - Multiple devs can work independently  

## 🐛 Troubleshooting

### **Page Tests Failing**
```bash
# Check if frontend is running
curl http://localhost:3000

# Run specific page test with verbose output
npm test -- --page=homepage --verbose
```

### **Integration Tests Failing**
```bash
# Check backend connectivity
curl http://localhost:8080/api/videos/list

# Run integration tests only
npm test -- --integration --verbose
```

### **Performance Issues**
- Page tests: ~2-3 seconds per page
- Integration tests: ~0.1-0.2 seconds total
- Use focused testing during development for faster feedback

## 📈 Test Results

**Recent Results:**
- **Page Tests**: 6/6 pages passing
- **Integration Tests**: 3/3 tests passing  
- **Overall Success Rate**: 100%
- **Performance**: Fast focused testing, comprehensive validation

The consolidated test runner provides the perfect balance of **fast focused testing during development** and **comprehensive validation for task completion**.
