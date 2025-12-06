import fetch from 'node-fetch';

async function register() {
    try {
        const response = await fetch('http://localhost:3002/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'testapi@example.com',
                password: 'password123'
            }),
        });

        const text = await response.text();
        console.log('Status:', response.status);
        try {
            const data = JSON.parse(text);
            console.log('Response:', JSON.stringify(data, null, 2));
        } catch (e) {
            console.log('Response (Text):', text);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

register();
