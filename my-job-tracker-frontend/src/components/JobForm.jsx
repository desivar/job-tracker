import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  title: yup.string().required("Job title is required"),
  company: yup.string().required("Company name is required"),
  location: yup.string().required("Location is required"),
  type: yup.string().required("Job type is required"),
  description: yup.string().required("Job description is required"),
  requirements: yup.string().required("Requirements are required"),
  salary: yup.string().required("Salary range is required"),
  status: yup.string().required("Status is required"),
});

const JobForm = ({ onSubmit, initialValues, mode = "create" }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      title: "",
      company: "",
      location: "",
      type: "",
      description: "",
      requirements: "",
      salary: "",
      status: "open",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await onSubmit(values);
        toast.success(
          `Job ${mode === "create" ? "created" : "updated"} successfully!`
        );
        if (mode === "create") {
          resetForm();
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        {mode === "create" ? "Create New Job" : "Edit Job"}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Job Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="company"
              name="company"
              label="Company"
              value={formik.values.company}
              onChange={formik.handleChange}
              error={formik.touched.company && Boolean(formik.errors.company)}
              helperText={formik.touched.company && formik.errors.company}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="location"
              name="location"
              label="Location"
              value={formik.values.location}
              onChange={formik.handleChange}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Job Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
                label="Job Type"
              >
                <MenuItem value="full-time">Full Time</MenuItem>
                <MenuItem value="part-time">Part Time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
                <MenuItem value="internship">Internship</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Job Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="requirements"
              name="requirements"
              label="Requirements"
              multiline
              rows={4}
              value={formik.values.requirements}
              onChange={formik.handleChange}
              error={
                formik.touched.requirements &&
                Boolean(formik.errors.requirements)
              }
              helperText={
                formik.touched.requirements && formik.errors.requirements
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="salary"
              name="salary"
              label="Salary Range"
              value={formik.values.salary}
              onChange={formik.handleChange}
              error={formik.touched.salary && Boolean(formik.errors.salary)}
              helperText={formik.touched.salary && formik.errors.salary}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                error={formik.touched.status && Boolean(formik.errors.status)}
                label="Status"
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting
              ? "Saving..."
              : mode === "create"
              ? "Create Job"
              : "Update Job"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default JobForm;
