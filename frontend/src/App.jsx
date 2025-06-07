import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import SideBar from './components/common/sideBar';
import NavBar from './components/common/navBar';
import PipelineColumn from './components/PipelineColumn';
import Jobs from './components/dummyJobs';

function App() {
  const columnsData = [
    {
      id: 'qualified',
      title: 'Qualified',
      deals: [
        { id: 'd1', title: 'Umbrella Corp deal', value: 10000 },
        { id: 'd2', title: 'JMVD Inc deal', value: 3000 },
        { id: 'd3', title: 'Ownerate LLP deal', value: 2000 },
        { id: 'd4', title: 'Silicon Links Inc deal', value: 1000 },
      ],
    },
    // Other columns...
  ];

  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content Area */}
        <div className="main-content-wrapper">
          {/* Top Navbar/Header */}
          <NavBar />

          {/* Routes */}
          <Routes>
            <Route
              path="/"
              element={
                <main className="kanban-board-area">
                  {columnsData.map((column) => (
                    <PipelineColumn
                      key={column.id}
                      title={column.title}
                      dealsCount={column.deals.length}
                      totalValue={column.deals.reduce((sum, deal) => sum + deal.value, 0)}
                    >
                      {column.deals.map((deal) => (
                        <div key={deal.id} className="card-placeholder">
                          {deal.title} - ${deal.value}
                        </div>
                      ))}
                    </PipelineColumn>
                  ))}
                </main>
              }
            />
            <Route path="/jobs" element={<Jobs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;