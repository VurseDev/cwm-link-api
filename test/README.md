# Testing Documentation

This directory contains all testing resources for the cwm-link-api project.

## Test Files

### Automated Tests (Jest + Supertest)

#### `app.e2e-spec.ts`
Basic end-to-end test for the root endpoint.

```bash
# Run this test
npm run test:e2e
```

#### `parts.e2e-spec.ts`
Comprehensive end-to-end test suite for the Parts API covering all CRUD operations and edge cases.

**Coverage:**
- POST /parts (create) - 6 test cases
- GET /parts (list all) - 2 test cases
- GET /parts/:id (get by id) - 2 test cases
- PATCH /parts/:id (update) - 3 test cases
- POST /parts/:serialId/log (add log) - 5 test cases
- DELETE /parts/:id (delete) - 4 test cases
- Integration workflow - 1 test case

**Total: 24 tests**

```bash
# Run all e2e tests
npm run test:e2e

# Run only parts tests
npm test -- test/parts.e2e-spec.ts
```

### Manual Testing Scripts

#### `manual-api-tests.sh`
Bash script containing all curl commands used during manual API testing. This script demonstrates:
- All API endpoints with real examples
- Success and failure scenarios
- Complete workflow testing
- Response format examples

**Usage:**

```bash
# Make sure the server is running first
npm start

# In another terminal, run the manual tests
cd test
./manual-api-tests.sh
```

**Requirements:**
- `curl` - for making HTTP requests
- `jq` - for pretty-printing JSON responses (optional but recommended)

If you don't have `jq` installed:
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Or remove all `| jq .` from the script
```

## Test Configuration

### `jest-e2e.json`
Configuration file for Jest e2e tests.

```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

## Running Tests

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npm test -- test/parts.e2e-spec.ts
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Manual Tests
```bash
# Start the server
npm start

# In another terminal
cd test
./manual-api-tests.sh
```

## Test Database

The e2e tests use the same SQLite database configured in your `.env` file. Each test suite:
1. Initializes a fresh NestJS application
2. Cleans the database before each test (`beforeEach`)
3. Runs the test
4. Disconnects from Prisma and closes the app after all tests (`afterAll`)

**Important:** The automated tests will delete all data before each test to ensure a clean state.

## Expected Test Results

### Automated Tests (Jest)
```
Test Suites: 2 passed, 2 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        ~5 seconds
```

### Manual Tests
The manual test script will output:
- Each test description
- HTTP response for each request
- Success/failure indicators
- Final summary of findings

## Test Findings

For detailed analysis of test results, API behavior, and identified issues, see:
- `../TEST_FINDINGS.md` - Comprehensive test report

## Common Issues

### Port Already in Use
If tests fail with "address already in use":
```bash
# Find and kill the process using port 3000
lsof -ti :3000 | xargs kill -9
```

### Database Locked
If you see "database is locked" errors:
```bash
# Stop the dev server before running tests
# Tests create their own NestJS instance
```

### Missing Dependencies
```bash
# Reinstall all dependencies including dev dependencies
npm install --include=dev
```

## Writing New Tests

### Adding a New E2E Test

1. Create a new test file: `test/feature.e2e-spec.ts`
2. Follow the pattern from `parts.e2e-spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Feature (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should test something', () => {
    return request(app.getHttpServer())
      .get('/endpoint')
      .expect(200);
  });
});
```

### Adding a Manual Test

Add new curl commands to `manual-api-tests.sh`:

```bash
echo "========================================="
echo "NEW TEST CATEGORY"
echo "========================================="
echo ""

run_test "Description of test"
curl -s -X METHOD $BASE_URL/endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}' | jq .
echo ""
```

## Best Practices

1. **Clean State**: Always clean the database before each test
2. **Isolation**: Tests should not depend on each other
3. **Assertions**: Use specific assertions, not just status codes
4. **Documentation**: Comment complex test scenarios
5. **Real Data**: Use realistic test data that resembles production
6. **Edge Cases**: Test both success and failure paths
7. **Async/Await**: Properly handle async operations

## Resources

- [NestJS Testing Documentation](https://docs.nestjs.com/fundamentals/testing)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
