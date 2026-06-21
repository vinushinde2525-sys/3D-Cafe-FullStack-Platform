// Test environment setup — runs before each test file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-at-least-32-characters-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-chars';
process.env.JWT_EXPIRE = '7d';
process.env.JWT_REFRESH_EXPIRE = '30d';
process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.SESSION_SECRET = 'test-session-secret';
process.env.PORT = '5001';
