import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import * as schema from './db/schema';
import { getTodayString } from './lib/date-utils';

const db = drizzle(process.env.DATABASE_URL!);

async function verifyPinFlow() {
    console.log('🔍 PIN Generator Flow Verification\n');
    console.log('='.repeat(50));

    const today = getTodayString();
    console.log(`📅 Today's date (Manila): ${today}\n`);

    // Check database for today's PIN
    const pins = await db.select().from(schema.dailyPins).where(eq(schema.dailyPins.date, today));

    console.log('📊 Database Query Results:');
    console.log(`   Pins found for today: ${pins.length}`);

    if (pins.length === 0) {
        console.log('   ✅ No PIN in database');
        console.log('   ✅ Expected: UI should show "No PIN Active" with "Generate Today\'s PIN" button\n');
    } else {
        console.log(`   ✅ PIN exists: ${pins[0].pin}`);
        console.log(`   ✅ Created at: ${pins[0].createdAt}`);
        console.log('   ✅ Expected: UI should display the PIN with countdown timer\n');
    }

    // Show all pins in database for reference
    const allPins = await db.select().from(schema.dailyPins);
    console.log('📋 All PINs in database:');
    if (allPins.length === 0) {
        console.log('   (none)');
    } else {
        allPins.forEach(pin => {
            const isCurrent = pin.date === today ? '← CURRENT' : '';
            console.log(`   ${pin.date}: ${pin.pin} ${isCurrent}`);
        });
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Verification complete');
}

verifyPinFlow().catch(console.error);
