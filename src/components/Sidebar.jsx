import React, { useState } from 'react';
import { testsConfig } from '../config/testsConfig';

const Sidebar = ({ activeTestId, setActiveTestId }) => {
  return (
    <div className="sidebar" style={{ overflowY: 'auto' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>Sample Size Calculator</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem', padding: '0 0.5rem', lineHeight: '1.4' }}>
        Useful for real world evidence applications.
      </p>
      <nav>
        {testsConfig.map((categoryGroup, index) => (
          <div key={index} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              {categoryGroup.category}
            </h3>
            {categoryGroup.tests.map(test => (
              <button
                key={test.id}
                className={`nav-link ${activeTestId === test.id ? 'active' : ''}`}
                onClick={() => setActiveTestId(test.id)}
                style={{ width: '100%', textAlign: 'left', background: activeTestId === test.id ? '' : 'transparent' }}
              >
                {test.name}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
