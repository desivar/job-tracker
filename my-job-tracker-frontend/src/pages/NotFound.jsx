import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: "6rem",
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate("/")}>
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
