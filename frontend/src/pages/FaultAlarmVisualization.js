import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/FaultAlarmVisualization.css';
import Navbar from '../componants/navbar';

function FaultAlarmVisualization() {
  const [healthyNodes, setHealthyNodes] = useState([]);
  const [faultyNodes, setFaultyNodes] = useState([]);
  const [displayList, setDisplayList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/faults/counts');
        const result = await response.json();

        if (response.ok) {
          setHealthyNodes(result.healthyNodes || []); // Handle undefined data gracefully
          setFaultyNodes(result.faultNodes || []);
        } else {
          setError(result.message || 'Error fetching node data');
        }
      } catch (error) {
        setError('Failed to fetch node data. Please try again later.');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHealthyClick = () => setDisplayList(healthyNodes);
  const handleFaultyClick = () => setDisplayList(faultyNodes);

  // Handle node click for redirection
  // const handleNodeClick = (nodeName) => {
  //   navigate(`/faulty-node/${nodeName}`); // Redirect to a detailed page for the node
  // };

  const handleNodeClick = (nodeName) => {
    navigate(`/faulty-node/${encodeURIComponent(nodeName)}`); // Redirect to a detailed page for the node
};
  return (
    <div>
      <Navbar />

      {/* Card Container */}
      <div className="card-container">
        <div className="card" onClick={handleHealthyClick}>
          <h3>
            <strong>Healthy Nodes Count:</strong> {healthyNodes.length}
          </h3>
        </div>
        <div className="card" onClick={handleFaultyClick}>
          <h3>
            <strong>Faulty Node Count:</strong> {faultyNodes.length}
          </h3>
        </div>
      </div>

      {/* Nodes Section */}
      <div className="nodes">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : displayList ? (
          <ul className="node-list">
            {displayList.map((node, index) => (
              <li
                key={index}
                onClick={() => handleNodeClick(node)} // Add click handler for redirection
                className="node-item"
              >
                {node}
              </li>
            ))}
          </ul>
        ) : (
          <div className="sentence">
            <h3>
              The system currently monitors <strong>{healthyNodes.length + faultyNodes.length}</strong> nodes, out of which <strong>{healthyNodes.length}</strong> are healthy and <strong>{faultyNodes.length}</strong> have faults.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default FaultAlarmVisualization;
