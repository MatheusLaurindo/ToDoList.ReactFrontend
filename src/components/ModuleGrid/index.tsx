import { Box, Divider, Grid, Typography } from "@mui/material";
import React, { ReactElement } from "react";
import '@fontsource/roboto';

function ModuleGrid({ title, component }: IModuleGrid) {
  return (
    <Grid style={{ padding: "0 4rem", margin: "1.5rem" }}>
      <Box
        mt={4}
        sx={{
          display: "flex",
          flexDirection: "row",
          mb: 1,
        }}
      >
        <Typography variant="h4" color="#fff">{title}</Typography>
      </Box>
      <Divider />
      <Box mt={1}>
        <Grid container spacing={2}>
          <Grid item sm={12} md={12} lg={12} xl={12}>
            {component}
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

type IModuleGrid = {
  title: string;
  component?: ReactElement;
};

export default ModuleGrid;
