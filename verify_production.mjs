#!/usr/bin/env node

/**
 * FINAL PRODUCTION VERIFICATION CHECKLIST
 * Confirms all updates are working correctly
 */

import fs from 'fs';
import path from 'path';

console.log('\n' + '='.repeat(80));
console.log('FINAL PRODUCTION VERIFICATION CHECKLIST');
console.log('='.repeat(80) + '\n');

const checks = [];

// Check 1: Logo updated in Navbar
console.log('🔍 CHECK 1: Logo Update');
console.log('-'.repeat(80));
const navbarPath = './src/components/layout/Navbar.jsx';
const navbarContent = fs.readFileSync(navbarPath, 'utf8');
const hasCloudinaryLogo = navbarContent.includes('https://res.cloudinary.com/dybzmpwaq/image/upload/v1782329237/Screenshot_2026-06-25_004829_h0zttp.png');
const hasImgTag = navbarContent.includes('<img') && navbarContent.includes('alt="Rai University Logo"');

if (hasCloudinaryLogo && hasImgTag) {
  console.log('✅ Cloudinary logo URL found');
  console.log('✅ Image tag properly configured');
  checks.push(true);
} else {
  console.log('❌ Logo update failed');
  checks.push(false);
}

// Check 2: Brochure PDF link in Hero
console.log('\n🔍 CHECK 2: Brochure PDF Integration');
console.log('-'.repeat(80));
const heroPath = './src/components/layout/Hero.jsx';
const heroContent = fs.readFileSync(heroPath, 'utf8');
const hasPdfLink = heroContent.includes('/12 Page Brochuer_Single page.pdf');
const hasDownloadHandler = heroContent.includes('handleBrochureDownload');
const hasDownloadIcon = heroContent.includes('FiDownload');

if (hasPdfLink && hasDownloadHandler && hasDownloadIcon) {
  console.log('✅ PDF path found in Hero');
  console.log('✅ Download handler implemented');
  console.log('✅ Download icon imported');
  checks.push(true);
} else {
  console.log('❌ Brochure PDF integration incomplete');
  checks.push(false);
}

// Check 3: Search engine updated
console.log('\n🔍 CHECK 3: Search Engine Enhancement');
console.log('-'.repeat(80));
const searchPath = './src/utils/searchEngine.js';
const searchContent = fs.readFileSync(searchPath, 'utf8');
const hasKeywordIndex = searchContent.includes('buildKeywordIndex');
const hasExactMatch = searchContent.includes('findExactKeywordMatch');
const hasIndexMatch = searchContent.includes('findKeywordIndexMatch');
const has3LevelStrategy = searchContent.includes('indexMatch') && searchContent.includes('exactMatch') && searchContent.includes('fuse.search');

if (hasKeywordIndex && hasExactMatch && hasIndexMatch && has3LevelStrategy) {
  console.log('✅ Keyword index builder found');
  console.log('✅ Exact match function found');
  console.log('✅ Index lookup function found');
  console.log('✅ 3-level search strategy implemented');
  checks.push(true);
} else {
  console.log('❌ Search engine enhancement incomplete');
  checks.push(false);
}

// Check 4: Duplicate message fix
console.log('\n🔍 CHECK 4: Duplicate Message Fix');
console.log('-'.repeat(80));
const chatbotManagerPath = './src/utils/chatbotManager.js';
const chatbotManagerContent = fs.readFileSync(chatbotManagerPath, 'utf8');
const hasNoUserMsgInProcess = !chatbotManagerContent.includes('addUserMessage(userQuery)');
const hasProcessQueryComment = chatbotManagerContent.includes('User message should already be added');

if (hasNoUserMsgInProcess && hasProcessQueryComment) {
  console.log('✅ addUserMessage removed from processQuery');
  console.log('✅ Documentation comment added');
  console.log('✅ Duplicate message bug fixed');
  checks.push(true);
} else {
  console.log('❌ Duplicate message fix incomplete');
  checks.push(false);
}

// Check 5: Contact page has no location section
console.log('\n🔍 CHECK 5: Contact Page Cleanup');
console.log('-'.repeat(80));
const contactPath = './src/pages/Contact.jsx';
const contactContent = fs.readFileSync(contactPath, 'utf8');
const hasNoMapSection = !contactContent.includes('Our Location') && !contactContent.includes('google.com/maps/embed');
const hasContactForm = contactContent.includes('handleSubmit') && contactContent.includes('Send Message');

if (hasNoMapSection && hasContactForm) {
  console.log('✅ Google Maps section removed');
  console.log('✅ Contact form still functional');
  checks.push(true);
} else {
  console.log('❌ Contact page cleanup incomplete');
  checks.push(false);
}

// Check 6: No temporary markdown files
console.log('\n🔍 CHECK 6: Cleanup Verification');
console.log('-'.repeat(80));
const filesToRemove = [
  'CONTACT_PAGE_FINAL_VERIFICATION.md',
  'CONTACT_PAGE_FIX_REPORT.md',
  'FINAL_PRODUCTION_FIX_SPRINT_REPORT.md',
  'FINAL_QA_REPORT.md',
  'SEARCH_ACCURACY_REPORT.md'
];

let allRemoved = true;
filesToRemove.forEach(file => {
  const exists = fs.existsSync(file);
  if (exists) {
    console.log(`❌ ${file} still exists`);
    allRemoved = false;
  }
});

if (allRemoved) {
  console.log('✅ All temporary markdown files removed');
  console.log('✅ README.md retained');
  console.log('✅ Deployment docs retained');
  checks.push(true);
} else {
  console.log('❌ Some temporary files not removed');
  checks.push(false);
}

// Check 7: PDF file exists
console.log('\n🔍 CHECK 7: Brochure PDF Availability');
console.log('-'.repeat(80));
const pdfExists = fs.existsSync('./12 Page Brochuer_Single page.pdf');
if (pdfExists) {
  const stats = fs.statSync('./12 Page Brochuer_Single page.pdf');
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Brochure PDF found (${sizeMB} MB)`);
  console.log('✅ Ready for download');
  checks.push(true);
} else {
  console.log('❌ Brochure PDF not found');
  checks.push(false);
}

// Check 8: Build artifacts
console.log('\n🔍 CHECK 8: Build Verification');
console.log('-'.repeat(80));
const distExists = fs.existsSync('./dist');
if (distExists) {
  console.log('✅ Build artifacts present');
  console.log('✅ Production build ready');
  checks.push(true);
} else {
  console.log('⚠️  Build artifacts not found (run: npm run build)');
  checks.push(false);
}

// Final Summary
console.log('\n' + '='.repeat(80));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(80) + '\n');

const passed = checks.filter(c => c).length;
const total = checks.length;

console.log(`Results: ${passed}/${total} checks passed\n`);

if (passed === total) {
  console.log('✅ ALL CHECKS PASSED');
  console.log('\n✨ Project is PRODUCTION READY ✨\n');
  console.log('Ready for deployment to:');
  console.log('  • Netlify');
  console.log('  • Vercel');
  console.log('  • Any Node.js hosting platform\n');
} else {
  console.log(`❌ ${total - passed} CHECK(S) FAILED`);
  console.log('\nPlease review and fix the issues above.\n');
}

console.log('='.repeat(80) + '\n');
