import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import JobForm from "../components/JobForm";
import { getJobs, createJob, updateJob, deleteJob } from "../api/jobs";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  // Get user role from localStorage
  const user = useMemo(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : {};
  }, []);

  const canCreateJobs = ["admin", "recruiter", "hiring_manager"].includes(
    user.role
  );
  const canEditJobs = ["admin", "recruiter", "hiring_manager"].includes(
    user.role
  );
  const canDeleteJobs = ["admin"].includes(user.role);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getJobs();
      setJobs(response.data);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData);
      fetchJobs();
      setOpenDialog(false);
      toast.success("Job created successfully");
    } catch (error) {
      toast.error(error.message || "Failed to create job");
    }
  };

  const handleUpdateJob = async (jobData) => {
    try {
      await updateJob(selectedJob._id, jobData);
      fetchJobs();
      setOpenDialog(false);
      setSelectedJob(null);
      toast.success("Job updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update job");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(jobId);
        fetchJobs();
        toast.success("Job deleted successfully");
      } catch (error) {
        toast.error(error.message || "Failed to delete job");
      }
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const handleOpenDialog = (job = null) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedJob(null);
    setOpenDialog(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Jobs
        </Typography>
        {canCreateJobs && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Job
          </Button>
        )}
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search jobs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {job.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {job.company} • {job.location}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip label={job.type} size="small" sx={{ mr: 1 }} />
                  <Chip
                    label={job.status}
                    color={job.status === "open" ? "success" : "default"}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {job.description.substring(0, 150)}...
                </Typography>
              </CardContent>
              <CardActions>
                {canEditJobs && (
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(job)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                )}
                {canDeleteJobs && (
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteJob(job._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
                {user.role === "applicant" && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      /* TODO: Implement apply functionality */
                    }}
                  >
                    Apply
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <JobForm
          onSubmit={selectedJob ? handleUpdateJob : handleCreateJob}
          initialValues={selectedJob}
          mode={selectedJob ? "edit" : "create"}
        />
      </Dialog>
    </Box>
  );
};

export default Jobs;
