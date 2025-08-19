// test-calendar.js
// Test script to verify Google Calendar integration

const { getCalendarEvents, getUpcomingEvents } = require('./app/lib/google-calendar-service');

async function testCalendarIntegration() {
  console.log('=== Testing Google Calendar Integration ===\n');
  
  try {
    console.log('1. Testing basic calendar events fetch...');
    const calendarData = await getCalendarEvents();
    console.log(`   ✅ Successfully fetched ${calendarData.count} events`);
    console.log(`   Title: ${calendarData.title}`);
    console.log(`   Last updated: ${calendarData.lastUpdated}\n`);
    
    console.log('2. Testing upcoming events fetch...');
    const upcomingEvents = await getUpcomingEvents(5);
    console.log(`   ✅ Successfully fetched ${upcomingEvents.length} upcoming events\n`);
    
    if (upcomingEvents.length > 0) {
      console.log('3. Sample event data:');
      console.log(`   Title: ${upcomingEvents[0].title}`);
      console.log(`   Date: ${upcomingEvents[0].formattedDate}`);
      console.log(`   Location: ${upcomingEvents[0].location || 'Not specified'}\n`);
    }
    
    console.log('🎉 All tests passed! Google Calendar integration is working correctly.');
  } catch (error) {
    console.error('❌ Error during testing:');
    console.error(`   ${error.message}`);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Check if the Google Calendar ID is correct');
    console.log('   2. Verify the calendar is public');
    console.log('   3. Check network connectivity');
  }
}

testCalendarIntegration();