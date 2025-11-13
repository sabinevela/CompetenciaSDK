# Contributing to CompetenciaSDK

Thank you for your interest in contributing to CompetenciaSDK! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Report issues privately if they're security-related
- Help each other learn and grow

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Expo CLI: `npm install -g eas-cli`

### Local Development Setup

```powershell
# Clone the repository
git clone https://github.com/your-repo/CompetenciaSDK.git
cd CompetenciaSDK

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Copy environment template
Copy-Item server/.env.example server/.env
# Edit server/.env with your API keys
```

### Running Locally

```powershell
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
npm start

# Open Expo Go on your device and scan the QR code
```

## Project Structure

```
CompetenciaSDK/
├── src/
│   ├── screens/          # Expo screens (React Native)
│   ├── components/       # Reusable components
│   ├── services/         # API calls, auth
│   ├── contexts/         # React context (global state)
│   └── config.ts         # Configuration (SERVER_URL)
├── server/
│   ├── index.js          # Express server + endpoints
│   ├── scheduler.js      # Cron jobs
│   └── package.json
├── ARCHITECTURE.md       # System design
├── DEPLOYMENT.md         # Deployment guide
├── TESTING.md           # API testing guide
└── README.md            # Project overview
```

## Development Workflow

### 1. Create a Feature Branch

```powershell
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-name
```

### 2. Make Changes

- Follow existing code style
- Keep commits atomic and focused
- Write clear commit messages
- Add comments for complex logic

### 3. Test Your Changes

```powershell
# Backend testing
cd server
npm run dev
# In another terminal, see TESTING.md for API test commands

# Frontend testing
# Test in Expo Go on device
# Check navigation flows
# Verify error handling
```

### 4. Commit and Push

```powershell
git add .
git commit -m "feat: add new volcano alert feature"
# or
# git commit -m "fix: resolve network timeout issue"

git push origin feature/your-feature-name
```

### 5. Create a Pull Request

- Describe what you changed and why
- Reference related issues (closes #123)
- Include screenshots for UI changes
- Ensure all tests pass

## Coding Standards

### Frontend (TypeScript/React Native)

```typescript
// Use meaningful names
const fetchWeatherData = async (lat: number, lon: number) => {
  const response = await fetch(`${SERVER_URL}/api/weather?lat=${lat}&lon=${lon}`);
  return response.json();
};

// Add error handling
try {
  const weather = await fetchWeatherData(lat, lon);
  setWeather(weather);
} catch (error) {
  console.error('Weather fetch failed:', error);
  setError('Unable to load weather');
}

// Use early returns
if (!location) {
  return <Text>Location required</Text>;
}

// Avoid nested ternaries
const status = isLoading ? 'loading' : error ? 'error' : 'success';
```

### Backend (Node.js/Express)

```javascript
// Use async/await
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    // Validate input
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Missing coordinates' });
    }
    
    // Call external API
    const weather = await axios.get('https://api.openweathermap.org/...');
    
    // Return response
    res.json(weather.data);
  } catch (error) {
    console.error('API error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate environment variables
const requiredEnvs = ['OPENWEATHER_KEY', 'OPENAI_API_KEY'];
requiredEnvs.forEach(env => {
  if (!process.env[env]) {
    console.error(`Missing required env: ${env}`);
    process.exit(1);
  }
});
```

## Git Commit Messages

```
feat: add user notifications
fix: resolve weather API timeout
docs: update ARCHITECTURE.md
style: improve error message formatting
test: add API endpoint tests
chore: update dependencies
perf: optimize feed loading
refactor: simplify prediction logic
```

Format:
- Lowercase subject line, max 50 characters
- Blank line
- Detailed body (if needed)
- Reference issues: `closes #123`

## Documentation

When adding features, update:

1. **README.md** — Overview of the feature
2. **ARCHITECTURE.md** — System design impact
3. **TESTING.md** — How to test the feature
4. **Code comments** — Complex logic

Example:

```typescript
/**
 * Fetches weather data from OpenWeatherMap via server proxy
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Weather object with temperature, humidity, wind
 * @throws Error if API call fails
 */
const fetchWeather = async (lat: number, lon: number) => {
  // ...
};
```

## Testing

### API Endpoint Testing

```powershell
# Use the provided TESTING.md guide
# Test your new endpoint:

$body = @{ /* payload */ } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:4000/api/new-endpoint" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'} `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### Manual Testing

- Test on actual device (iOS/Android)
- Test with poor network conditions
- Test error scenarios (missing API key, API down)
- Test edge cases (empty state, no location, etc.)

### Automated Testing (Future)

```powershell
# Once tests are added:
npm test
npm run test:coverage
```

## Performance Optimization

### Frontend

- Lazy load screens with React.lazy
- Memoize expensive calculations (useMemo)
- Use FlatList for long lists
- Minimize re-renders with useCallback

### Backend

- Cache frequently accessed data (weather, volcano data)
- Use connection pooling for databases
- Implement pagination for large datasets
- Add rate-limiting for APIs

## Security Considerations

1. **Never commit secrets:**
   - API keys go in .env (not .env.example)
   - Use .gitignore for sensitive files
   - Review code before pushing

2. **Input validation:**
   - Validate coordinates are in valid ranges
   - Validate string lengths
   - Escape user input

3. **API security:**
   - Use HTTPS in production
   - Validate API key on server-side
   - Implement rate-limiting
   - Add request logging

## Reporting Issues

### Bug Reports

```markdown
**Description:** Brief description of the bug

**Steps to Reproduce:**
1. Open the app
2. Navigate to Feed screen
3. Tap create post button
4. Expected: Dialog appears
5. Actual: App crashes

**Environment:**
- Device: iPhone 14
- OS: iOS 17
- Expo version: 54.0.0

**Logs:**
[Include error logs]
```

### Feature Requests

```markdown
**Title:** Add push notifications for high-risk alerts

**Description:** Users should receive push notifications when risk probability > 80%

**Motivation:** Helps users stay informed of emergencies

**Proposed Implementation:**
- Use Firebase Cloud Messaging
- Integrate with existing alerts system
- Allow users to opt-in/out

**Additional context:** [Links, mockups, etc.]
```

## Pull Request Process

1. ✅ Tested locally
2. ✅ Updated documentation
3. ✅ Added comments for complex logic
4. ✅ No console errors/warnings
5. ✅ Follows code standards
6. ✅ Commit messages are clear
7. ✅ No breaking changes (or justified)

## Release Process

Releases follow semantic versioning: `MAJOR.MINOR.PATCH`

Example:
- `1.0.0` — Initial release
- `1.1.0` — New features (minor)
- `1.0.1` — Bug fix (patch)
- `2.0.0` — Breaking changes (major)

Releases are tagged in git:
```powershell
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## Community

- 💬 Discussions: GitHub Discussions
- 🐛 Issues: GitHub Issues
- 📧 Email: [contact info]
- 🌐 Website: [project website]

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to CompetenciaSDK! 🙏**
