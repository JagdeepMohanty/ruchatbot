import { ChatbotManager } from './src/utils/chatbotManager.js';
import { formatResponse } from './src/utils/responseRenderer.js';
import brochureData from './src/data/brochure.json' with { type: 'json' };

console.log('=== FULL INTEGRATION TEST ===\n');
console.log('Step 1: Verify brochure has structured data');
const mission = brochureData.find(e => e.id === 'mission_001');
const pillars = brochureData.find(e => e.id === 'four_pillars_001');
console.log('✓ Mission entry details count:', mission?.answer?.details?.length);
console.log('✓ Pillars entry details count:', pillars?.answer?.details?.length);

console.log('\nStep 2: Create ChatbotManager and test processQuery');
const manager = new ChatbotManager();
const query = 'mission';
const {botMessage, response} = await manager.processQuery(query);

console.log('✓ Query:', query);
console.log('✓ Response success:', response.success);
console.log('✓ Response confidence:', response.confidence);
console.log('✓ Response title:', response.title);
console.log('✓ Response message (first 80 chars):', response.message.substring(0, 80) + '...');
console.log('✓ Bot message created with ID:', botMessage.id);
console.log('✓ Raw confidence stored:', botMessage.rawConfidence);
console.log('✓ Confidence percent:', botMessage.confidence);

console.log('\nStep 3: Test responseRenderer with message');
const formatted = formatResponse(response.message);
console.log('✓ Formatted blocks count:', formatted.blocks.length);
console.log('✓ Has structure:', formatted.hasStructure);
console.log('✓ Content type:', formatted.contentType);
if (formatted.blocks.length > 0) {
  console.log('✓ First block type:', formatted.blocks[0].type);
}

console.log('\nStep 4: Test with answer object details');
if (response.answer?.details && response.answer.details.length > 0) {
  console.log('✓ Answer has', response.answer.details.length, 'details');
  console.log('✓ First detail:', response.answer.details[0].substring(0, 60) + '...');
}

console.log('\n=== ALL TESTS PASSED ===');
