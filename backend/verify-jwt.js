const API_URL = 'http://localhost:5000/api';

async function testJWT() {
    try {
        console.log('1. Testing Login...');
        // Use a test user known to exist or create one. 
        const testUser = {
            name: 'JWT Test User',
            email: `jwt_test_${Date.now()}@example.com`,
            password: 'password123',
            phone_number: '1234567890'
        };

        // Register
        try {
            await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testUser)
            });
            console.log('   User registered.');
        } catch (e) {
            console.log('   User might already exist (expected if re-running).');
        }

        // Login
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });

        const loginData = await loginRes.json();
        const token = loginData.token;
        const userId = loginData.user ? loginData.user.id : null;
        console.log('   Login successful. Token received:', token ? 'YES' : 'NO');

        if (!token) {
            console.error('   FAILED: No token received.', loginData);
            return;
        }

        console.log('\n2. Testing Protected Route (GET /user/:id) WITH Token...');
        try {
            const profileRes = await fetch(`${API_URL}/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                console.log('   Success! Data received:', profileData.email === testUser.email ? 'MATCH' : 'MISMATCH');
            } else {
                console.error('   FAILED: Protected route rejected valid token.', profileRes.status);
            }
        } catch (e) {
            console.error('   FAILED: Protected route rejected valid token.', e.message);
        }

        console.log('\n3. Testing Protected Route WITHOUT Token...');
        try {
            const noTokenRes = await fetch(`${API_URL}/user/${userId}`);
            if (noTokenRes.status === 401) {
                console.log('   Success! Access denied as expected (401).');
            } else {
                console.error('   FAILED: Protected route allowed access without token! Status:', noTokenRes.status);
            }
        } catch (e) {
            console.error('   Unexpected error:', e.message);
        }

        console.log('\n4. Testing Protected Route WITH INVALID Token...');
        try {
            const invalidTokenRes = await fetch(`${API_URL}/user/${userId}`, {
                headers: { Authorization: `Bearer invalid_token_123` }
            });
            if (invalidTokenRes.status === 401) {
                console.log('   Success! Access denied as expected (401).');
            } else {
                console.error('   FAILED: Protected route allowed access with invalid token! Status:', invalidTokenRes.status);
            }
        } catch (e) {
            console.error('   Unexpected error:', e.message);
        }

    } catch (error) {
        console.error('Unexpected error during test:', error.message);
    }
}

testJWT();
