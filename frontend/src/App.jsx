import './App.css'; // We'll create this file for App-specific styles
import './index.css'; // For global styles

function App() {
  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <aside className="sidebar">
        {/* Placeholder for sidebar content (icons, logo etc.) */}
        <div className="sidebar-logo">P</div>
        <nav className="sidebar-nav">
          {/* Example nav items */}
          <div className="nav-item">📊</div>
          <div className="nav-item">📋</div>
          <div className="nav-item">✉️</div>
          {/* ... more icons */}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Top Navbar/Header */}
        <header className="navbar">
          <div className="navbar-left">
            <h1 className="navbar-title">Deals</h1> {/* Or "Job Tracker" */}
          </div>
          <div className="navbar-center">
            {/* Search Bar */}
            <input type="text" placeholder="Search" className="search-input" />
          </div>
          <div className="navbar-right">
            {/* Add Button */}
            <button className="add-button">+ Deal</button>
            {/* User Profile */}
            <div className="user-profile">
              <img src="https://via.placeholder.com/30" alt="User" />
              <span>Desire Vargas</span>
            </div>
          </div>
        </header>

        {/* Kanban Board Area */}
        <main className="kanban-board-area">
          {/* This is where our PipelineColumns will go */}
          <h2>Your Pipelines will appear here</h2>
          {/* Example of a column placeholder */}
          <div className="kanban-column-placeholder">
            <h3>To Do</h3>
            <div className="card-placeholder">Card 1</div>
            <div className="card-placeholder">Card 2</div>
          </div>
          {/* ... more column placeholders */}
        </main>
      </div>
    </div>
  );
}

export default App;
