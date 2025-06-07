import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import './index.css'; // For global styles
import SideBar from './components/common/sideBar';
import NavBar from './components/common/navBar';

import PipelineColumn from './components/PipelineColumn'; // Import the new component

function App() {
  // Dummy data for columns and cards - this will eventually come from your backend
  const columnsData = [
    {
      id: 'qualified',
      title: 'Qualified',
      deals: [
        { id: 'd1', title: 'Umbrella Corp deal', value: 10000 },
        { id: 'd2', title: 'JMVD Inc deal', value: 3000 },
        { id: 'd3', title: 'Ownerate LLP deal', value: 2000 },
        { id: 'd4', title: 'Silicon Links Inc deal', value: 1000 }
      ]
    },
    {
      id: 'contactMade',
      title: 'Contact Made',
      deals: [
        { id: 'd5', title: 'Principalspace Inc deal', value: 5250 },
        { id: 'd6', title: 'Blue Marble LLP deal', value: 1150 }
      ]
    },
    {
      id: 'demoScheduled',
      title: 'Demo Scheduled',
      deals: [
        { id: 'd7', title: 'Moover Limited deal', value: 3100 },
        { id: 'd8', title: 'Wolfs Corp deal', value: 1700 }
      ]
    },
    {
      id: 'proposalMade',
      title: 'Proposal Made',
      deals: [
        { id: 'd9', title: 'Omnicorp deal', value: 2700 }
      ]
    },
    {
      id: 'negotiationsStarted',
      title: 'Negotiations Started',
      deals: [
        { id: 'd10', title: 'Big Wheels Inc deal', value: 4200 },
        { id: 'd11', title: 'Mindbend LLP deal', value: 1600 }
      ]
    }
  ];

  {/*return(
    <Routes>
    <Route path="/" element={<h2>Welcome to the Kanban Board</h2>} />
    <Route path="/jobs" element={<Jobs />} />
    </Routes>
  );
  */}


  return (
    <div className="app-container">
      {/* Left Sidebar */}
        <SideBar />
      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Top Navbar/Header */}
        <NavBar />




        {/* Kanban Board Area */}
        <main className="kanban-board-area">
          {/* Map through our dummy data to render columns */}
          {columnsData.map(column => (
            <PipelineColumn
              key={column.id}
              title={column.title}
              dealsCount={column.deals.length}
              totalValue={column.deals.reduce((sum, deal) => sum + deal.value, 0)}
            >
              {/* For now, just show placeholders. We'll create JobCard component next */}
              {column.deals.map(deal => (
                <div key={deal.id} className="card-placeholder">
                  {deal.title} - ${deal.value}
                </div>
              ))}
            </PipelineColumn>
          ))}
        </main>
      </div>
    </div>
  );
}

export default App;
