import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { Grid, Typography } from "@mui/material";

const BreadcrumbLayout = ({ pages }) => {
  return (
    <Grid container>
      <Grid item md={12} xs={12}>
        <Breadcrumbs
          separator={
            <Grid
              sx={{
                fontSize: "12px",
                opacity: 0.5,
                mb: "-4px",
              }}
            >
              /
            </Grid>
          }
        >
          {pages?.map((page) =>
            page?.path ? (
              <Grid
                key={page?.title}
                to={page?.path}
                component={Link}
                sx={{
                  fontSize: "12px",
                  textDecoration: "none",
                  color: "#7D3232",
                }}
              >
                {page?.title}
              </Grid>
            ) : (
              <Grid
                key={page?.title}
                // component={Link}
                sx={{ fontSize: "12px", textDecoration: "none", mb: "-3px" }}
              >
                {page?.title}
              </Grid>
            )
          )}
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
};
BreadcrumbLayout.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      path: PropTypes.string,
    })
  ),
};
BreadcrumbLayout.defaultProps = {
  pages: [],
};
export default BreadcrumbLayout;
