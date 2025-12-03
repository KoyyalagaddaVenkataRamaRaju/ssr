import React, { useState, useEffect } from 'react';
import ProblemList from '../pages/studentSections/ProblemList';

function CodingProblems() {
  const [selectedPlatform, setSelectedPlatform] = useState('leetcode');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, [selectedPlatform]);

  const fetchProblems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/problems/${selectedPlatform}`);
      console.log(response);
      if (!response.ok) throw new Error('Failed to fetch problems');
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
      setError('Failed to load problems. Please try again.');
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Coding Problem Explorer</h2>
        </div>

        <div style={platformSelectorStyle}>
          <button
            onClick={() => setSelectedPlatform('leetcode')}
            style={{
              ...platformButtonStyle,
              ...(selectedPlatform === 'leetcode' ? activeButtonStyle : {})
            }}
          >
            LeetCode
          </button>
          <button
            onClick={() => setSelectedPlatform('codechef')}
            style={{
              ...platformButtonStyle,
              ...(selectedPlatform === 'codechef' ? activeButtonStyle : {})
            }}
          >
            CodeChef
          </button>
          <button
            onClick={() => setSelectedPlatform('hackerrank')}
            style={{
              ...platformButtonStyle,
              ...(selectedPlatform === 'hackerrank' ? activeButtonStyle : {})
            }}
          >
            HackerRank
          </button>
        </div>

        {loading && (
          <div style={loadingStyle}>
            <p>Loading problems...</p>
          </div>
        )}

        {error && (
          <div style={errorStyle}>
            <p>{error}</p>
            <button onClick={fetchProblems} style={retryButtonStyle}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && problems.length > 0 && (
          <ProblemList problems={problems} platform={selectedPlatform} />
        )}

        {!loading && !error && problems.length === 0 && (
          <div style={emptyStateStyle}>
            <p>No problems found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: 'calc(100vh - 73px)',
  backgroundColor: '#f5f5f5'
};

const contentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '2rem'
};

const headerStyle = {
  marginBottom: '2rem'
};

const titleStyle = {
  fontSize: '1.75rem',
  fontWeight: '600',
  color: '#2c3e50'
};

const platformSelectorStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  flexWrap: 'wrap'
};

const platformButtonStyle = {
  padding: '0.75rem 2rem',
  fontSize: '1rem',
  fontWeight: '500',
  backgroundColor: 'white',
  color: '#2c3e50',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: '#ddd',      
  borderRadius: '6px',
  transition: 'all 0.2s'
};

const activeButtonStyle = {
  backgroundColor: '#3498db',
  color: 'white',
  borderColor: '#3498db'     
};


const loadingStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  color: '#7f8c8d',
  fontSize: '1.1rem'
};

const errorStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  color: '#e74c3c',
  fontSize: '1.1rem'
};

const retryButtonStyle = {
  marginTop: '1rem',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  backgroundColor: '#3498db',
  color: 'white',
  borderRadius: '6px'
};

const emptyStateStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  color: '#7f8c8d',
  fontSize: '1.1rem'
};

export default CodingProblems;
