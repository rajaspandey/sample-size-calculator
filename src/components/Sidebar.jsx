import React from 'react';
import { NavLink } from 'react-router-dom';
import { testsConfig } from '../config/testsConfig';

const Sidebar = () => {
  return (
    <div className="sidebar" style={{ overflowY: 'auto' }}>
      <h1 style={{ marginBottom: '0.25rem' }}>Sample Size Calculator</h1>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem', padding: '0 0.5rem', lineHeight: '1.4' }}>
        Useful for real world evidence applications.
      </p>
      <nav>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
            Intelligent Tools
          </h3>
          <NavLink
            to="/ai-assistant"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({ width: '100%', textAlign: 'left', background: isActive ? '' : 'transparent' })}
          >
            ✨ AI Study Designer
          </NavLink>
        </div>
        
        {testsConfig.map((categoryGroup, index) => (
          <div key={index} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
              {categoryGroup.category}
            </h3>
            {categoryGroup.tests.map(test => (
              <NavLink
                key={test.id}
                to={`/test/${test.id}`}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({ width: '100%', textAlign: 'left', background: isActive ? '' : 'transparent' })}
              >
                {test.name}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
