import React from 'react';
import logo from './assets/arbor-nature-logo.png'; // make sure the file exists

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <img src={logo} alt="Arbor Nature Logo" style={{ maxWidth: '300px' }} />
      <h1>Welcome to Time Tracker</h1>
    </div>
  );
}

export default Home;
