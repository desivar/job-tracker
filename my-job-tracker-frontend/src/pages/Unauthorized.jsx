import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You don't have permission to access this page.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate("/dashboard")}
            sx={{ mr: 2 }}
          >
            Go to Dashboard
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Unauthorized;
