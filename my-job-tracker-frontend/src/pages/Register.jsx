import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
} from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";

const validationSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username should be of minimum 3 characters length")
    .required("Username is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password should be of minimum 6 characters length")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  firstName: yup
    .string()
    .min(2, "First name should be of minimum 2 characters length")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name should be of minimum 2 characters length")
    .required("Last name is required"),
  role: yup
    .string()
    .oneOf(
      ["applicant", "recruiter", "hiring_manager"],
      "Invalid role selected"
    )
    .required("Role is required"),
  department: yup
    .string()
    .min(2, "Department should be of minimum 2 characters length")
    .required("Department is required"),
  company: yup.string().when("role", {
    is: (val) => val === "recruiter" || val === "hiring_manager",
    then: () =>
      yup
        .string()
        .required("Company is required for recruiters and hiring managers"),
    otherwise: () => yup.string(),
  }),
  position: yup.string().when("role", {
    is: (val) => val === "recruiter" || val === "hiring_manager",
    then: () =>
      yup
        .string()
        .min(2, "Position should be of minimum 2 characters length")
        .required("Position is required for recruiters and hiring managers"),
    otherwise: () => yup.string(),
  }),
  resume: yup.string().when("role", {
    is: "applicant",
    then: () => yup.string().required("Resume is required for applicants"),
    otherwise: () => yup.string(),
  }),
  skills: yup.array().when("role", {
    is: "applicant",
    then: () =>
      yup
        .array()
        .min(1, "At least one skill is required")
        .required("Skills are required for applicants"),
    otherwise: () => yup.array(),
  }),
  experience: yup.number().when("role", {
    is: "applicant",
    then: () =>
      yup
        .number()
        .min(0, "Experience cannot be negative")
        .required("Years of experience is required for applicants"),
    otherwise: () => yup.number(),
  }),
});

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "Human Resources",
  "Finance",
  "Legal",
  "Operations",
];

const commonSkills = [
  "JavaScript",
  "Python",
  "Java",
  "React",
  "Node.js",
  "SQL",
  "AWS",
  "Docker",
  "Git",
  "Agile",
  "Project Management",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Team Work",
];

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "applicant",
      department: "",
      company: "",
      position: "",
      resume: "",
      skills: [],
      experience: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // First register the user
        const registrationData = {
          ...values,
          resume: "", // We'll update this after upload
        };

        console.log("Sending registration data:", registrationData);

        const response = await apiClient.post(
          "/api/auth/register",
          registrationData
        );

        console.log("Registration successful:", response.data);

        // If user is applicant and has selected a file, upload it
        if (values.role === "applicant" && selectedFile) {
          const formData = new FormData();
          formData.append("resume", selectedFile);
          try {
            console.log("Uploading resume...");
            const uploadResponse = await apiClient.post(
              "/api/upload/resume",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${response.data.data.token}`,
                },
              }
            );
            console.log("Upload response:", uploadResponse.data);

            if (uploadResponse.data.status === "success") {
              // Update user profile with resume URL
              await apiClient.put(
                "/api/users/profile",
                { resume: uploadResponse.data.url },
                {
                  headers: {
                    Authorization: `Bearer ${response.data.data.token}`,
                  },
                }
              );
            }
          } catch (error) {
            console.error("File upload error details:", {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status,
            });
            toast.error(
              error.response?.data?.message ||
                error.message ||
                "Failed to upload resume. Please try again."
            );
          }
        }

        toast.success("Registration successful! Please sign in.");
        navigate("/login");
      } catch (error) {
        console.error("Registration error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        const message =
          error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      formik.setFieldValue("resume", file.name);
    }
  };

  const showCompanyField = ["recruiter", "hiring_manager"].includes(
    formik.values.role
  );
  const showPositionField = ["recruiter", "hiring_manager"].includes(
    formik.values.role
  );
  const showApplicantFields = formik.values.role === "applicant";

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <PersonAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formik.values.role}
                    label="Role"
                    onChange={formik.handleChange}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                  >
                    <MenuItem value="applicant">Job Applicant</MenuItem>
                    <MenuItem value="recruiter">Recruiter</MenuItem>
                    <MenuItem value="hiring_manager">Hiring Manager</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department"
                    name="department"
                    value={formik.values.department}
                    label="Department"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.department &&
                      Boolean(formik.errors.department)
                    }
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {showCompanyField && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="company"
                    name="company"
                    label="Company"
                    value={formik.values.company}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.company && Boolean(formik.errors.company)
                    }
                    helperText={formik.touched.company && formik.errors.company}
                  />
                </Grid>
              )}

              {showPositionField && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="position"
                    name="position"
                    label="Position"
                    value={formik.values.position}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.position && Boolean(formik.errors.position)
                    }
                    helperText={
                      formik.touched.position && formik.errors.position
                    }
                  />
                </Grid>
              )}

              {showApplicantFields && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      id="experience"
                      name="experience"
                      label="Years of Experience"
                      value={formik.values.experience}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.experience &&
                        Boolean(formik.errors.experience)
                      }
                      helperText={
                        formik.touched.experience && formik.errors.experience
                      }
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Autocomplete
                      multiple
                      id="skills"
                      options={commonSkills}
                      freeSolo
                      value={formik.values.skills}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("skills", newValue);
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Skills"
                          error={
                            formik.touched.skills &&
                            Boolean(formik.errors.skills)
                          }
                          helperText={
                            formik.touched.skills && formik.errors.skills
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <input
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      id="resume-file"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="resume-file">
                      <Button variant="outlined" component="span" fullWidth>
                        Upload Resume (PDF, DOC, DOCX)
                      </Button>
                    </label>
                    {selectedFile && (
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Selected file: {selectedFile.name}
                      </Typography>
                    )}
                    {formik.touched.resume && formik.errors.resume && (
                      <Typography
                        color="error"
                        variant="caption"
                        display="block"
                      >
                        {formik.errors.resume}
                      </Typography>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register;
