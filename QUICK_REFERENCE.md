# QUICK REFERENCE - Strict Search Engine

## 🎯 CORE CONCEPT

**STRICT, PRIORITY-BASED FAQ RETRIEVAL**
- No guessing
- No low-confidence results
- Deterministic behavior
- Brochure-driven only

---

## 📋 PRIORITY SYSTEM

```
┌─────────────────────────────────────┐
│ Priority 1: Exact Match      → 1.0 │
│ Priority 2: Alias Map        → 0.95│
│ Priority 3: Keyword Overlap  → 0.80│
│ Priority 4: Semantic Fuse.js → 0.85│
│                                     │
│ Rejection: < 0.75 → NO MATCH       │
└─────────────────────────────────────┘
```

---

## 💻 USAGE

### Basic Search
```javascript
import { searchBrochure } from './searchEngine.js';

const result = searchBrochure("What is BBA?");

if (result.matchedEntry) {
  console.log(result.confidenceScore); // 0.95
  console.log(result.answerObject.title);
  console.log(result.matchType); // "alias_map"
}
```

### UI-Friendly Response
```javascript
import { getFormattedResponse } from './searchEngine.js';

const response = getFormattedResponse("engineering");

if (response.success) {
  // Display answer
  console.log(response.title);
  console.log(response.answer.description);
  console.log(response.answer.details);
} else {
  // Show "not found" message
  console.log(response.message);
}
```

---

## 🔧 OUTPUT CONTRACT

### Success
```javascript
{
  matchedEntry: { id, question, category, ... },
  confidenceScore: 0.95,
  answerObject: { title, description, details, ... },
  matchType: "alias_map"
}
```

### Failure
```javascript
{
  matchedEntry: null,
  confidenceScore: 0,
  answerObject: null,
  error: "no_match"
}
```

---

## ✅ VALIDATION

```bash
# Run test suite
node test_strict_search.mjs

# Expected output
✅ Passed: 13/13
🚀 PRODUCTION READY
```

---

## 📝 ADDING NEW ALIASES

Edit `ALIAS_MAP` in `searchEngine.js`:

```javascript
const ALIAS_MAP = {
  'new_keyword': 'entry_id',
  'another_keyword': 'entry_id',
  // ...
};
```

---

## 🎯 EXAMPLES

### Exact Match (1.0)
```javascript
"What programs does School of Engineering offer?"
→ engineering_001 (1.0, exact_question)
```

### Alias Map (0.95)
```javascript
"bba" → management_courses_001 (0.95, alias_map)
"placement" → placements_001 (0.95, alias_map)
```

### Keyword Overlap (0.80-0.90)
```javascript
"admission requirements" → admission_001 (0.90, keyword_overlap)
```

### Semantic (0.85+)
```javascript
"tell me about rai university" → about_001 (1.0, exact_alias)
```

### Rejection (< 0.75)
```javascript
"weather today" → NO MATCH (0.0, no_match)
```

---

## 🚫 REMOVED FEATURES

- ❌ 3-character prefix matching
- ❌ Substring/partial matching
- ❌ "Closest match" behavior
- ❌ Low-confidence results

---

## ⚙️ CONFIGURATION

### Rejection Threshold
```javascript
// searchEngine.js line ~180
if (result.confidenceScore >= 0.75) { ... }
```

### Fuse.js Settings
```javascript
threshold: 0.25,  // Stricter = lower number
distance: 50,     // Match distance
```

### Semantic Threshold
```javascript
if (confidence >= 0.85) { ... }
```

---

## 🧪 TEST CASES

```javascript
✅ Exact Question → 1.0
✅ Exact Alias → 1.0
✅ Alias Map → 0.95
✅ Keyword Overlap → 0.80-0.90
✅ Semantic → 0.85+
✅ Reject Unrelated → 0.0
✅ Reject Short Query → 0.0
✅ Deterministic → Same result
```

---

## 📚 FILES

```
src/utils/searchEngine.js       - Main engine
test_strict_search.mjs          - Test suite
STRICT_SEARCH_IMPLEMENTATION.md - Detailed docs
FINAL_VALIDATION_REPORT.md      - Validation
EXECUTIVE_SUMMARY.md            - Executive summary
QUICK_REFERENCE.md              - This file
```

---

## 🚀 DEPLOYMENT

```bash
# 1. Run tests
node test_strict_search.mjs

# 2. Build
npm run build

# 3. Deploy
# (your deployment process)
```

---

## 📞 SUPPORT

### Common Issues

**Q: Query not matching?**
- Check if keyword in ALIAS_MAP
- Verify query ≥ 2 characters
- Ensure keywords in brochure.json

**Q: Low confidence?**
- May need to add alias
- Check keyword list in entry
- Consider exact match phrasing

**Q: Inconsistent results?**
- Should never happen (deterministic)
- Re-run tests to verify

---

## ✅ CHEAT SHEET

```
Query Length:
  < 2 chars → REJECT

Priority Order:
  Exact > Alias > Keyword > Semantic

Thresholds:
  Exact: 1.0
  Alias: 0.95
  Keyword: 0.80-0.90
  Semantic: 0.85+
  Reject: < 0.75

Test Command:
  node test_strict_search.mjs

Expected Result:
  13/13 PASSED (100%)
```

---

**Version**: 1.0  
**Status**: Production Ready ✅  
**Last Updated**: January 2025
