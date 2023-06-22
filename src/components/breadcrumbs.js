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
                fontSize: "13px",
                opacity: 0.5,
                mb: -0.4
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
                  fontSize: "13px",
                  // textDecoration: "none",
                  color: "var(--color--main)",
                }}
              >
                {page?.title}
              </Grid>
            ) : (
              <Grid
                key={page?.title}
                component={Link}
                sx={{ fontSize: "13px", textDecoration: "none", color: "rgba(0,0,0,0.5)" , cursor: "default"}}
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
