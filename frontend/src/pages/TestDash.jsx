import React from 'react';

const TestDash = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#1B5E20', color: 'white', minHeight: '100vh' }}>
      <h1>TEST DASHBOARD - IT WORKS!</h1>
      <p>The route is working properly.</p>
      <button onClick={() => window.location.href = '/login'} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Back to Login
      </button>
    </div>
  );
};

export default TestDash;
