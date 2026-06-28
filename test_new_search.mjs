import { getFormattedResponse } from './src/utils/searchEngine.js';

const tests = [
  'mission',
  'four pillars'
];

console.log('Testing response format structure:\n');

tests.forEach(q => {
  const result = getFormattedResponse(q);
  console.log(`\n=== Query: "${q}" ===`);
  console.log('Response keys:', Object.keys(result).sort());
  console.log('Message:', result.message.substring(0, 80) + '...');
  console.log('RawAnswer type:', typeof result.rawAnswer);
  console.log('RawAnswer keys:', result.answer ? Object.keys(result.answer).sort() : 'N/A');
  if (result.answer?.details) {
    console.log('Details count:', result.answer.details.length);
    console.log('First detail:', result.answer.details[0].substring(0, 60) + '...');
  }
});


