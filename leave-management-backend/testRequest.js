async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@ums.edu', password: 'password123' })
    });
    const loginData = await loginRes.json();
    
    const token = loginData.token;
    console.log('Login successful. Token:', token);

    const applyRes = await fetch('http://localhost:5000/api/leaves/apply', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        type: 'Sick Leave',
        startDate: '2026-10-10',
        endDate: '2026-10-12',
        reason: 'Got sick'
      })
    });

    const applyData = await applyRes.json();
    console.log('Apply successful:', applyData);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
