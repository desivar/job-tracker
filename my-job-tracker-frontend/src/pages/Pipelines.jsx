import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import apiClient from "../api/apiClient";

// Define validation schema
const validationSchema = yup.object({
  name: yup.string().required("Pipeline name is required"),
  description: yup.string(),
  steps: yup.array().of(yup.string()).min(1, "At least one step is required"),
});

// Define pipeline stages
const PIPELINE_STAGES = [
  "Applied",
  "Phone Screen",
  "Technical Interview",
  "Onsite Interview",
  "Offer",
  "Rejected",
];

function Pipelines() {
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [pipelines, setPipelines] = useState([]);
  const [editingPipeline, setEditingPipeline] = useState(null);
  const [newStep, setNewStep] = useState("");
  const [applications, setApplications] = useState({});

  useEffect(() => {
    fetchPipelines();
    fetchApplications();
  }, []);

  const fetchPipelines = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pipelines");
      setPipelines(response.data);
    } catch (error) {
      toast.error("Error fetching pipelines");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/api/pipelines");

      // Group applications by stage
      const grouped = PIPELINE_STAGES.reduce((acc, stage) => {
        acc[stage] = response.data.filter((app) => app.stage === stage);
        return acc;
      }, {});

      setApplications(grouped);
    } catch (error) {
      toast.error("Failed to fetch applications");
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      steps: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingPipeline) {
          await axios.put(
            `http://localhost:5000/api/pipelines/${editingPipeline._id}`,
            values
          );
          toast.success("Pipeline updated successfully");
        } else {
          await axios.post("http://localhost:5000/api/pipelines", values);
          toast.success("Pipeline created successfully");
        }
        setOpenDialog(false);
        resetForm();
        setEditingPipeline(null);
        fetchPipelines();
      } catch (error) {
        toast.error(
          editingPipeline
            ? "Error updating pipeline"
            : "Error creating pipeline"
        );
      }
    },
  });

  const handleEdit = (pipeline) => {
    setEditingPipeline(pipeline);
    formik.setValues({
      name: pipeline.name,
      description: pipeline.description || "",
      steps: [...pipeline.steps],
    });
    setOpenDialog(true);
  };

  const handleDelete = async (pipelineId) => {
    if (window.confirm("Are you sure you want to delete this pipeline?")) {
      try {
        await axios.delete(`http://localhost:5000/api/pipelines/${pipelineId}`);
        toast.success("Pipeline deleted successfully");
        fetchPipelines();
      } catch (error) {
        toast.error("Error deleting pipeline");
      }
    }
  };

  const handleAddStep = () => {
    if (newStep.trim()) {
      formik.setFieldValue("steps", [...formik.values.steps, newStep.trim()]);
      setNewStep("");
    }
  };

  const handleRemoveStep = (index) => {
    const newSteps = formik.values.steps.filter((_, i) => i !== index);
    formik.setFieldValue("steps", newSteps);
  };

  const handleOpenDialog = () => {
    formik.resetForm();
    setEditingPipeline(null);
    setOpenDialog(true);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const steps = Array.from(formik.values.steps);
    const [reorderedStep] = steps.splice(result.source.index, 1);
    steps.splice(result.destination.index, 0, reorderedStep);

    formik.setFieldValue("steps", steps);
  };

  const handleDragEndApplications = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    if (sourceStage === destStage && source.index === destination.index) {
      return;
    }

    try {
      // Update application stage in backend
      await apiClient.put(`/api/pipelines/${draggableId}`, {
        stage: destStage,
      });

      // Update local state
      const newApplications = { ...applications };
      const [movedApplication] = newApplications[sourceStage].splice(
        source.index,
        1
      );
      movedApplication.stage = destStage;
      newApplications[destStage].splice(destination.index, 0, movedApplication);

      setApplications(newApplications);
      toast.success("Application updated successfully");
    } catch (error) {
      toast.error("Failed to update application");
      fetchApplications(); // Refresh to revert changes
    }
  };

  const handleUpdateApplication = async (applicationData) => {
    try {
      await apiClient.put(
        `/api/pipelines/${editingPipeline._id}`,
        applicationData
      );
      fetchApplications();
      setOpenDialog(false);
      setEditingPipeline(null);
      toast.success("Application updated successfully");
    } catch (error) {
      toast.error("Failed to update application");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" component="h1">
          Pipelines
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Pipeline
        </Button>
      </Box>

      <Box sx={{ display: "grid", gap: 3 }}>
        {pipelines.map((pipeline) => (
          <Paper key={pipeline._id} sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  {pipeline.name}
                </Typography>
                {pipeline.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {pipeline.description}
                  </Typography>
                )}
              </Box>
              <Box>
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(pipeline)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(pipeline._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {pipeline.steps.map((step, index) => (
                <Chip
                  key={index}
                  label={step}
                  variant="outlined"
                  sx={{ borderColor: "primary.main" }}
                />
              ))}
            </Box>
          </Paper>
        ))}
      </Box>

      <DragDropContext onDragEnd={handleDragEndApplications}>
        <Grid container spacing={2}>
          {PIPELINE_STAGES.map((stage) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={stage}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {stage}
                    <Chip
                      label={applications[stage]?.length || 0}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>

                  <Droppable droppableId={stage}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ minHeight: 100 }}
                      >
                        {applications[stage]?.map((application, index) => (
                          <Draggable
                            key={application._id}
                            draggableId={application._id}
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{ mb: 1, p: 1 }}
                              >
                                <Typography variant="subtitle2">
                                  {application.applicant.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {application.job.title}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setEditingPipeline(application);
                                      setOpenDialog(true);
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingPipeline(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingPipeline ? "Edit Pipeline" : "New Pipeline"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Pipeline Name"
              margin="normal"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              margin="normal"
              multiline
              rows={2}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Pipeline Steps
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Enter a new step"
                  size="small"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddStep}
                  disabled={!newStep.trim()}
                >
                  Add
                </Button>
              </Box>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="steps">
                  {(provided) => (
                    <List
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      sx={{
                        bgcolor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      {formik.values.steps.map((step, index) => (
                        <Draggable
                          key={index}
                          draggableId={`step-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <ListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              divider
                            >
                              <Box
                                {...provided.dragHandleProps}
                                sx={{ mr: 2, cursor: "move" }}
                              >
                                <DragIndicatorIcon />
                              </Box>
                              <ListItemText primary={step} />
                              <ListItemSecondaryAction>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleRemoveStep(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              </DragDropContext>
              {formik.touched.steps && formik.errors.steps && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {formik.errors.steps}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => formik.handleSubmit()} variant="contained">
            {editingPipeline ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Pipelines;
