import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import {
  BarChart as BarChartIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getDashboardStats, getDashboardActivities } from "../api/dashboard";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalCustomers: 0,
    totalPipelines: 0,
  });

  const [activityData, setActivityData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsData = await getDashboardStats();
      setStats(statsData.data);

      // Format activity data for charts
      const activityData = await getDashboardActivities();
      const formattedActivityData = {
        labels: activityData.labels,
        datasets: [
          {
            label: "Activities",
            data: activityData.data,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };
      setActivityData(formattedActivityData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <BusinessIcon color="primary" sx={{ mb: 1 }} />
            <Typography variant="h6">{stats.totalCustomers}</Typography>
            <Typography color="textSecondary">Total Customers</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <BarChartIcon color="primary" sx={{ mb: 1 }} />
            <Typography variant="h6">{stats.totalJobs}</Typography>
            <Typography color="textSecondary">Active Jobs</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Activity Chart */}
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 1,
          boxShadow: 1,
          mb: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Activity Overview
        </Typography>
        <Box sx={{ height: 300 }}>
          <Bar
            data={activityData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
