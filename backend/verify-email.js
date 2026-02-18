// Native fetch is available in Node 18+

const API_URL = 'http://localhost:5000/api';

async function testEmailSending() {
    console.log('--- Starting Email Sending Verification ---');

    console.log('\n1. Sending Test Email...');
    try {
        const res = await fetch(`${API_URL}/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test_user@example.com',
                message: 'This is a test message from the auto-verification script. Subject should be FindLossForm.'
            })
        });

        if (res.ok) {
            console.log('   SUCCESS: Email sent successfully (200 OK).');
            const data = await res.json();
            console.log('   Response:', data);
        } else {
            console.error(`   FAILURE: Email sending failed with status ${res.status}.`);
            const err = await res.json();
            console.error('   Error details:', err);
        }

    } catch (e) {
        console.error('   CRITICAL: Network/Server error during email test.', e.message);
    }

    console.log('\n--- Verification Complete ---');
}

testEmailSending();
