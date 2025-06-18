import React from "react";
import { Box, Container, Typography, Link, Divider } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";

const Footer = () => {
  const teamMembers = [
    "Oluwashina Samuel Ibukun",
    "Jaden Micheal Binett",
    "Desire Delmy Vargas Tinoco",
    "Shared Santillan",
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          Job Tracker Application
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
          gutterBottom
        >
          Group 11 Final Project • Brigham Young University 2025
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          Team Members:
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          gutterBottom
        >
          {teamMembers.join(" • ")}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {"Copyright © "}
          <Link color="inherit" href="https://byu.edu/">
            BYU
          </Link>{" "}
          {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
