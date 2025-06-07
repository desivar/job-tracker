import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Jobs.css'; // Optional: Create a CSS file for styling

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch jobs from the backend
    axios.get('http://localhost:5000/jobs')
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  return (
    <div className="jobs-container">
      <h1>Jobs</h1>
      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;