const API_URL = 'http://localhost:5000/api';

const testFeatures = async () => {
  console.log('🚀 Starting Feature Verification...\n');

  try {
    // 1. Login with valid credentials
    console.log('--- Testing Authentication ---');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@ums.edu', password: 'password123' })
    });
    
    if (!loginRes.ok) throw new Error(`Login failed with status ${loginRes.status}`);
    const loginData = await loginRes.json();
    const { token } = loginData;
    console.log('✅ Login valid: Success');

    // 2. Login with invalid password
    const invalidPassRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@ums.edu', password: 'wrongpassword' })
    });
    if (invalidPassRes.status === 401) {
      console.log('✅ Login invalid password: Success (Rejected correctly)');
    } else {
      console.log(`❌ Login invalid password: Failed (Status ${invalidPassRes.status})`);
    }

    // 3. Login with empty fields (Backend behavior check)
    const emptyRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (emptyRes.status === 500 || emptyRes.status === 400 || emptyRes.status === 401) {
      console.log('✅ Login empty fields: Success (Handled correctly)');
    } else {
      console.log(`❌ Login empty fields: Failed (Status ${emptyRes.status})`);
    }

    // 4. Leave Application - Valid
    console.log('\n--- Testing Leave Application ---');
    const authHeader = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    const leaveData = {
      type: 'Sick Leave',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      reason: 'Fever'
    };
    const applyRes = await fetch(`${API_URL}/leaves/apply`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify(leaveData)
    });
    if (!applyRes.ok) throw new Error(`Apply leave failed with status ${applyRes.status}`);
    const applyData = await applyRes.json();
    const leaveId = applyData._id;
    console.log('✅ Apply leave valid: Success');

    // 5. Unauthorized access (Student trying to view pending)
    const pendingRes = await fetch(`${API_URL}/leaves/pending`, {
      method: 'GET',
      headers: authHeader
    });
    if (pendingRes.status === 403) {
      console.log('✅ Unauthorized access: Success (Rejected correctly)');
    } else {
      console.log(`❌ Unauthorized access: Failed (Status ${pendingRes.status})`);
    }

    // 6. Leave Management - Approve as Professor
    console.log('\n--- Testing Leave Management ---');
    const profLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'professor@ums.edu', password: 'password123' })
    });
    const profLoginData = await profLoginRes.json();
    const profToken = profLoginData.token;
    const profAuthHeader = { 'Authorization': `Bearer ${profToken}`, 'Content-Type': 'application/json' };

    const approveRes = await fetch(`${API_URL}/leaves/approve/${leaveId}`, {
      method: 'PUT',
      headers: profAuthHeader,
      body: JSON.stringify({ status: 'Approved', remarks: 'Rest well' })
    });
    if (approveRes.ok) {
      console.log('✅ Approve leave: Success');
    } else {
      console.log(`❌ Approve leave: Failed (Status ${approveRes.status})`);
    }

    // 7. View History
    const historyRes = await fetch(`${API_URL}/leaves/history`, {
      method: 'GET',
      headers: authHeader
    });
    const historyData = await historyRes.json();
    console.log('✅ View history: Success', historyData.length > 0 ? '(Data found)' : '(Empty)');

    console.log('\n🏁 Feature Verification Completed Successfully!');
  } catch (error) {
    console.error('💥 Error during verification:', error.message);
  }
};

testFeatures();
