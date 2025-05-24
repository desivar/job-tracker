// src/components/PipelineColumn.jsx
import React from 'react';
import './PipelineColumn.css'; // We'll create this CSS file next

function PipelineColumn({ title, dealsCount, totalValue, children }) {
  return (
    <div className="pipeline-column">
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="column-menu">...</span> {/* Placeholder for menu icon */}
      </div>
      <div className="column-summary">
        {totalValue} $ - {dealsCount} deals
      </div>
      <div className="column-cards">
        {children} {/* This is where the individual JobCards will go */}
      </div>
      <button className="add-deal-button">+ Add deal</button>
    </div>
  );
}

export default PipelineColumn;