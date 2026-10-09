import http from 'http';

const API_URL = 'http://localhost:5000/api';

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      hostname: 'localhost',
      port: 5000,
      path: '/api' + path,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function runTests() {
  console.log("==========================================");
  console.log("🚀 INITIATING FULL E2E API DIAGNOSTICS");
  console.log("==========================================");

  try {
    // 1. Citizen Login Test
    console.log("\n[1] Testing Citizen Login Flow...");
    let res = await request('POST', '/auth/login', { email: 'arjun.krishnan@ecocity.in', password: '123456' });
    if (res.status === 200 && res.data.token) {
      console.log("✅ Citizen Login SUCCESS");
    } else {
      console.error("❌ Citizen Login FAILED:", res);
      return;
    }
    const citizenToken = res.data.token;

    // 2. Profile Fetch Test
    console.log("\n[2] Testing Profile Fetch Flow...");
    res = await request('GET', '/auth/profile', null, citizenToken);
    if (res.status === 200 && res.data.name) {
      console.log("✅ Profile Fetch SUCCESS (User: " + res.data.name + ")");
    } else {
      console.error("❌ Profile Fetch FAILED:", res);
    }

    // 3. Profile Update Test
    console.log("\n[3] Testing Profile Update Flow...");
    res = await request('PUT', '/auth/profile', { phone: '+91 9999999999' }, citizenToken);
    if (res.status === 200 && res.data.user.phone === '+91 9999999999') {
      console.log("✅ Profile Update SUCCESS");
    } else {
      console.error("❌ Profile Update FAILED:", res);
    }

    // 4. Admin Login Test
    console.log("\n[4] Testing Admin Login Flow...");
    res = await request('POST', '/auth/login', { email: 'meera.iyer@ecocity.in', password: '123456' });
    if (res.status === 200 && res.data.user.role === 'admin') {
      console.log("✅ Admin Login SUCCESS (Role: " + res.data.user.role + ")");
    } else {
      console.error("❌ Admin Login FAILED:", res);
      return;
    }
    const adminToken = res.data.token;

    // 5. Fetch Bins Test
    console.log("\n[5] Testing Bins Retrieval Flow...");
    res = await request('GET', '/bins?status=active', null, citizenToken);
    if (res.status === 200 && Array.isArray(res.data)) {
      console.log("✅ Bins Retrieval SUCCESS (Found " + res.data.length + " bins)");
    } else {
      console.error("❌ Bins Retrieval FAILED:", res);
    }

    // 6. Analytics Fetch Test
    console.log("\n[6] Testing Analytics Data Flow...");
    res = await request('GET', '/bins/analytics', null, adminToken);
    if (res.status === 200 && res.data.totalBins !== undefined) {
      console.log("✅ Analytics Retrieval SUCCESS (Total bins: " + res.data.totalBins + ")");
    } else {
      console.error("❌ Analytics Retrieval FAILED:", res);
    }

    console.log("\n==========================================");
    console.log("🎉 ALL FLOWS COMPLETED SUCCESSFULLY");
    console.log("==========================================");

  } catch (err) {
    console.error("FATAL TEST ERROR:", err);
  }
}

runTests();
