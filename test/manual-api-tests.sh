#!/bin/bash

# Manual API Testing Script for cwm-link-api
# This script contains all the curl commands used during manual testing
# to verify API functionality and identify edge cases

BASE_URL="http://localhost:3000"

echo "========================================="
echo "Manual API Tests for cwm-link-api"
echo "========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL=0
PASSED=0

run_test() {
    TOTAL=$((TOTAL + 1))
    echo -e "${YELLOW}Test $TOTAL: $1${NC}"
}

# ==========================================
# 1. ROOT ENDPOINT TESTS
# ==========================================

echo "========================================="
echo "1. ROOT ENDPOINT TESTS"
echo "========================================="
echo ""

run_test "GET / - Root endpoint"
curl -s $BASE_URL/
echo -e "\n"

# ==========================================
# 2. GET ALL PARTS TESTS
# ==========================================

echo "========================================="
echo "2. GET ALL PARTS TESTS"
echo "========================================="
echo ""

run_test "GET /parts - Get all parts (initially)"
curl -s $BASE_URL/parts | jq .
echo ""

# ==========================================
# 3. CREATE PART TESTS (SUCCESS CASES)
# ==========================================

echo "========================================="
echo "3. CREATE PART TESTS (SUCCESS)"
echo "========================================="
echo ""

run_test "POST /parts - Create a valid part"
curl -s -X POST $BASE_URL/parts \
  -H "Content-Type: application/json" \
  -d '{
    "serialId": "TEST-001",
    "operator": "TestOperator",
    "partName": "Test Part",
    "partDescription": "A test part for validation",
    "status": "pending",
    "part": [],
    "logs": []
  }' | jq .
echo ""

# ==========================================
# 4. CREATE PART TESTS (FAILURE CASES)
# ==========================================

echo "========================================="
echo "4. CREATE PART TESTS (FAILURES)"
echo "========================================="
echo ""

run_test "POST /parts - Duplicate serialId (should fail with 500)"
curl -s -X POST $BASE_URL/parts \
  -H "Content-Type: application/json" \
  -d '{
    "serialId": "TEST-001",
    "operator": "TestOperator2",
    "partName": "Duplicate Part",
    "partDescription": "Should fail - duplicate serialId",
    "status": "pending",
    "part": [],
    "logs": []
  }' | jq .
echo ""

run_test "POST /parts - Missing serialId (should fail with 400)"
curl -s -X POST $BASE_URL/parts \
  -H "Content-Type: application/json" \
  -d '{
    "operator": "TestOperator",
    "partName": "Missing SerialId",
    "partDescription": "Should fail - missing required field",
    "status": "pending",
    "part": [],
    "logs": []
  }' | jq .
echo ""

run_test "POST /parts - Wrong type for serialId (should fail with 400)"
curl -s -X POST $BASE_URL/parts \
  -H "Content-Type: application/json" \
  -d '{
    "serialId": 12345,
    "operator": "TestOperator",
    "partName": "Wrong Type",
    "partDescription": "Should fail - serialId should be string",
    "status": "pending",
    "part": [],
    "logs": []
  }' | jq .
echo ""

run_test "POST /parts - Invalid JSON (should fail with 400)"
curl -s -X POST $BASE_URL/parts \
  -H "Content-Type: application/json" \
  -d 'invalid json' | jq .
echo ""

run_test "POST /parts - Missing required fields (should fail with 400)"
curl -s -X POST $BASE_URL/parts \
  -H "Content-Type: application/json" \
  -d '{
    "serialId": "TEST-INCOMPLETE"
  }' | jq .
echo ""

# ==========================================
# 5. GET PART BY ID TESTS
# ==========================================

echo "========================================="
echo "5. GET PART BY ID TESTS"
echo "========================================="
echo ""

run_test "GET /parts/:id - Get existing part by serialId"
curl -s $BASE_URL/parts/TEST-001 | jq .
echo ""

run_test "GET /parts/:id - Get non-existent part (should return empty)"
curl -s $BASE_URL/parts/nonexistent
echo -e "\n"

# ==========================================
# 6. UPDATE PART TESTS
# ==========================================

echo "========================================="
echo "6. UPDATE PART TESTS"
echo "========================================="
echo ""

run_test "PATCH /parts/:id - Update part with valid data"
curl -s -X PATCH $BASE_URL/parts/TEST-001 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "partDescription": "Updated description"
  }' | jq .
echo ""

run_test "PATCH /parts/:id - Update non-existent part (should fail with 404)"
curl -s -X PATCH $BASE_URL/parts/nonexistent \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }' | jq .
echo ""

# ==========================================
# 7. ADD LOG TESTS
# ==========================================

echo "========================================="
echo "7. ADD LOG TESTS"
echo "========================================="
echo ""

run_test "POST /parts/:serialId/log - Add log to existing part"
curl -s -X POST $BASE_URL/parts/TEST-001/log \
  -H "Content-Type: application/json" \
  -d '{
    "step": "inspection",
    "operator": "QAOperator"
  }' | jq .
echo ""

run_test "POST /parts/:serialId/log - Add log to non-existent part (should fail with 404)"
curl -s -X POST $BASE_URL/parts/nonexistent/log \
  -H "Content-Type: application/json" \
  -d '{
    "step": "inspection",
    "operator": "QAOperator"
  }' | jq .
echo ""

run_test "POST /parts/:serialId/log - Missing operator field (should fail with 500)"
curl -s -X POST $BASE_URL/parts/TEST-001/log \
  -H "Content-Type: application/json" \
  -d '{
    "step": "assembly"
  }' | jq .
echo ""

run_test "POST /parts/:serialId/log - Missing step field (should fail with 500)"
curl -s -X POST $BASE_URL/parts/TEST-001/log \
  -H "Content-Type: application/json" \
  -d '{
    "operator": "QAOperator"
  }' | jq .
echo ""

run_test "POST /parts/:serialId/log - Add another log to verify multiple logs"
curl -s -X POST $BASE_URL/parts/TEST-001/log \
  -H "Content-Type: application/json" \
  -d '{
    "step": "assembly",
    "operator": "AssemblyOperator"
  }' | jq .
echo ""

# ==========================================
# 8. VERIFY PART WITH MULTIPLE LOGS
# ==========================================

echo "========================================="
echo "8. VERIFY PART WITH LOGS"
echo "========================================="
echo ""

run_test "GET /parts/:id - Verify part now has multiple logs"
curl -s $BASE_URL/parts/TEST-001 | jq .
echo ""

# ==========================================
# 9. DELETE PART TESTS
# ==========================================

echo "========================================="
echo "9. DELETE PART TESTS"
echo "========================================="
echo ""

run_test "DELETE /parts/:id - Delete existing part"
curl -s -X DELETE $BASE_URL/parts/TEST-001 | jq .
echo ""

run_test "DELETE /parts/:id - Delete already deleted part (should fail with 404)"
curl -s -X DELETE $BASE_URL/parts/TEST-001 | jq .
echo ""

run_test "DELETE /parts/:id - Delete non-existent part (should fail with 404)"
curl -s -X DELETE $BASE_URL/parts/nonexistent | jq .
echo ""

# ==========================================
# 10. VERIFY DELETION
# ==========================================

echo "========================================="
echo "10. VERIFY DELETION"
echo "========================================="
echo ""

run_test "GET /parts - Verify part is deleted from list"
curl -s $BASE_URL/parts | jq .
echo ""

run_test "GET /parts/:id - Verify deleted part returns empty"
curl -s $BASE_URL/parts/TEST-001
echo -e "\n"

# ==========================================
# 11. COMPLETE WORKFLOW TEST
# ==========================================

echo "========================================="
echo "11. COMPLETE WORKFLOW TEST"
echo "========================================="
echo ""

echo "Step 1: Create a new part for workflow testing"
curl -s -X POST $BASE_URL/parts \
  -H "Content-Type: application/json" \
  -d '{
    "serialId": "WORKFLOW-001",
    "operator": "WorkflowOperator",
    "partName": "Workflow Test Part",
    "partDescription": "Testing complete workflow",
    "status": "pending",
    "part": [],
    "logs": []
  }' | jq .
echo ""

echo "Step 2: Add inspection log"
curl -s -X POST $BASE_URL/parts/WORKFLOW-001/log \
  -H "Content-Type: application/json" \
  -d '{
    "step": "inspection",
    "operator": "QAOperator"
  }' | jq .
echo ""

echo "Step 3: Update status to in-progress"
curl -s -X PATCH $BASE_URL/parts/WORKFLOW-001 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress"
  }' | jq .
echo ""

echo "Step 4: Add assembly log"
curl -s -X POST $BASE_URL/parts/WORKFLOW-001/log \
  -H "Content-Type: application/json" \
  -d '{
    "step": "assembly",
    "operator": "AssemblyOperator"
  }' | jq .
echo ""

echo "Step 5: Update status to completed"
curl -s -X PATCH $BASE_URL/parts/WORKFLOW-001 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }' | jq .
echo ""

echo "Step 6: Verify final state"
curl -s $BASE_URL/parts/WORKFLOW-001 | jq .
echo ""

echo "Step 7: Delete the workflow test part"
curl -s -X DELETE $BASE_URL/parts/WORKFLOW-001 | jq .
echo ""

echo "Step 8: Verify deletion"
curl -s $BASE_URL/parts/WORKFLOW-001
echo -e "\n"

# ==========================================
# SUMMARY
# ==========================================

echo ""
echo "========================================="
echo "TEST SUMMARY"
echo "========================================="
echo "All manual tests completed!"
echo ""
echo "Key Findings:"
echo "- ValidationPipe returns 400 for invalid input"
echo "- Unique constraints return 500 (Prisma error)"
echo "- Missing DTO validation on log endpoint returns 500"
echo "- Cascade delete works correctly"
echo "- GET on non-existent part returns 200 with empty body"
echo ""
echo "See TEST_FINDINGS.md for detailed analysis"
echo "========================================="
