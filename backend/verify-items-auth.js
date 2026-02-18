// Native fetch is available in Node 18+

const API_URL = 'http://localhost:5000/api';

async function testItemProtection() {
    console.log('--- Starting Item Route Protection Verification ---');

    // 1. Register/Login to get a valid token
    console.log('\n1. Authenticating...');
    let token = null;
    let userId = null;
    try {
        // Try login first
        let loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test_auth@example.com', password: 'password123' })
        });

        if (!loginRes.ok) {
            // If login fails, try register
            console.log('   Login failed, trying registration...');
            const regRes = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Test Auth User',
                    email: 'test_auth@example.com',
                    password: 'password123',
                    phone_number: '0000000000'
                })
            });

            // Login again after registration
            loginRes = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test_auth@example.com', password: 'password123' })
            });
        }

        const loginData = await loginRes.json();
        token = loginData.token;
        userId = loginData.user.id;
        console.log('   Authentication successful. Token received.');

    } catch (e) {
        console.error('   CRITICAL: Authentication failed.', e.message);
        return;
    }

    // 2. Test Unprotected Item Creation (Should Fail)
    console.log('\n2. Testing Unauthorized Item Creation (No Token)...');
    try {
        const res = await fetch(`${API_URL}/items/lost`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Unprotected Item',
                category: 'Electronics',
                date: '2024-01-01',
                area: 'Library',
                description: 'This should fail',
                contact_info: 'test@example.com',
                user_id: userId
            })
        });

        if (res.status === 401) {
            console.log('   SUCCESS: Request rejected with 401 Unauthorized.');
        } else {
            console.error(`   FAILURE: Request allowed with status ${res.status} (Expected 401).`);
        }
    } catch (e) {
        console.error('   Error during unauthorized test:', e.message);
    }

    // 3. Test Protected Item Creation (Should Succeed)
    console.log('\n3. Testing Authorized Item Creation (With Token)...');
    let itemId = null;
    try {
        const res = await fetch(`${API_URL}/items/lost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Protected Item',
                category: 'Electronics',
                date: '2024-01-01',
                area: 'Library',
                description: 'This should succeed',
                contact_info: 'test@example.com',
                user_id: userId
            })
        });

        if (res.status === 201) {
            console.log('   SUCCESS: Item created successfully.');
            const data = await res.json();
            itemId = data.item.id;
        } else {
            const err = await res.json();
            console.error(`   FAILURE: Request failed with status ${res.status}.`, err);
        }
    } catch (e) {
        console.error('   Error during authorized test:', e.message);
    }

    // 4. Test Protected Item Deletion (Should Succeed)
    if (itemId) {
        console.log(`\n4. Testing Authorized Item Deletion (ID: ${itemId})...`);
        try {
            const res = await fetch(`${API_URL}/items/lost/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                console.log('   SUCCESS: Item deleted successfully.');
            } else {
                const err = await res.json();
                console.error(`   FAILURE: Delete failed with status ${res.status}.`, err);
            }
        } catch (e) {
            console.error('   Error during delete test:', e.message);
        }
    } else {
        console.log('\n4. Skipping Delete Test (Item creation failed).');
    }

    console.log('\n--- Verification Complete ---');
}

testItemProtection();
