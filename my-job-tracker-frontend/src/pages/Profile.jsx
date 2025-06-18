import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  CircularProgress,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";

const validationSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  // Role-specific validations will be added conditionally
});

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      position: "",
      department: "",
      resume: null,
      skills: [],
      experience: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (values[key] !== null) {
            formData.append(key, values[key]);
          }
        });

        await apiClient.put("/api/users/profile", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Profile updated successfully");
        fetchUserData();
      } catch (error) {
        toast.error("Failed to update profile");
      }
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get("/api/users/profile");
        formik.setValues(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchUserProfile();
  }, [formik]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await apiClient.get("/api/auth/me");
      setUser({ ...response.data, role: userData.role });

      // If user is an applicant, fetch their applications
      if (userData.role === "applicant") {
        const applicationsResponse = await apiClient.get(
          "/api/applications/me"
        );
        setApplications(applicationsResponse.data);
      }
    } catch (error) {
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                margin: "0 auto 16px",
                bgcolor: "primary.main",
                fontSize: "2.5rem",
              }}
            >
              {user?.firstName?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Typography variant="h6">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {user?.role?.replace("_", " ").toUpperCase()}
            </Typography>
            <Chip
              label={user?.email}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="firstName"
                    label="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>

                {/* Role-specific fields */}
                {(user?.role === "recruiter" ||
                  user?.role === "hiring_manager") && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="company"
                        label="Company"
                        value={formik.values.company}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name="department"
                        label="Department"
                        value={formik.values.department}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  </>
                )}

                {user?.role === "hiring_manager" && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="position"
                      label="Position"
                      value={formik.values.position}
                      onChange={formik.handleChange}
                    />
                  </Grid>
                )}

                {user?.role === "applicant" && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="resume"
                        type="file"
                        InputLabelProps={{ shrink: true }}
                        onChange={(event) => {
                          formik.setFieldValue(
                            "resume",
                            event.currentTarget.files[0]
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="skills"
                        label="Skills (comma-separated)"
                        value={formik.values.skills.join(", ")}
                        onChange={(e) => {
                          formik.setFieldValue(
                            "skills",
                            e.target.value.split(",").map((s) => s.trim())
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="experience"
                        label="Experience"
                        multiline
                        rows={4}
                        value={formik.values.experience}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Show applications for applicants */}
            {user?.role === "applicant" && applications.length > 0 && (
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  My Applications
                </Typography>
                <List>
                  {applications.map((application) => (
                    <ListItem key={application._id}>
                      <ListItemText
                        primary={application.job.title}
                        secondary={`Status: ${
                          application.status
                        } • Applied on: ${new Date(
                          application.createdAt
                        ).toLocaleDateString()}`}
                      />
                      <Chip
                        label={application.stage}
                        color={
                          application.stage === "Hired"
                            ? "success"
                            : application.stage === "Rejected"
                            ? "error"
                            : "default"
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;
