import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { getItemsNav } from "./items-navigate/get-item-nav";
import {
  Box,
  Grid,
  SwipeableDrawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Biotech, ExpandMore } from "@mui/icons-material";
import { useAuth } from "../contexts/auth-context";

const SidebarMobile = ({ openNavMobile, closeNavMobile, isopenNavMobile }) => {
  const { auth } = useAuth();
  const items = getItemsNav(auth?.user?.role);
  const location = useLocation();
  const storedExpanded = localStorage.getItem("expanded");
  const [expanded, setExpanded] = useState(
    storedExpanded ? JSON.parse(storedExpanded) : []
  );

  useEffect(() => {
    const storedExpanded = localStorage.getItem("expanded");
    if (storedExpanded) {
      setExpanded(JSON.parse(storedExpanded));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expanded", JSON.stringify(expanded));
  }, [expanded]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    if (isExpanded) {
      setExpanded((prevExpanded) => [...prevExpanded, panel]); // Add panel to expanded state
    } else {
      setExpanded((prevExpanded) =>
        prevExpanded.filter((item) => item !== panel)
      ); // Remove panel from expanded state
    }
  };

  return (
    <SwipeableDrawer
      anchor={"left"}
      open={isopenNavMobile}
      onClose={closeNavMobile}
      onOpen={openNavMobile}
    >
      <Box
        sx={{
          width: "var(--sidebar--width)",
          height: "100vh",
          top: "0",
          backgroundColor: "#ffff",
          // position: "fixed",
          zIndex: 2,
          overflowY: "auto",
          borderRight: "1px solid rgba(0,0,0,0.1)",
          paddingBottom: "100px",
          "&::-webkit-scrollbar": {
            width: "1px",

            // display: "none"
            visibility: "hidden",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            // visibility: "hidden",
          },
        }}
      >
        <Grid
          container
          sx={{
            height: "var(--header--height)",
            width: "100%",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            pl: 3,
            pr: 3,
          }}
        >
          <Grid
            item
            xs={2}
            sm={2}
            md={3}
            sx={{
              display: "flex",
              alignItems: "center",
              width: "50px",
              height: "50px",
              borderRight: "1px solid var(--color--main-light4)",
            }}
          >
            <Biotech
              sx={{
                width: "40px",
                height: "40px",
                color: "var(--color--main)",
              }}
            />
          </Grid>
          <Grid
            item
            container
            xs={10}
            sm={10}
            md={9}
            direction={"column"}
            sx={{ pl: 2, m: 0 }}
          >
            <Grid
              sx={{
                fontWeight: "bold",
                color: "var(--color--main)",
                fontSize: "14px",
              }}
            >
              Forensic Science
            </Grid>
            <Grid
              sx={{
                fontWeight: "light",
                fontSize: "12px",
                color: "var(--color--main)",
              }}
            >
              หน่วยพิสูจน์หลักฐาน
            </Grid>
          </Grid>
        </Grid>

        <Grid sx={{ pl: 2.7, pr: 3, mt: 2 }}>
          {items.map((item, index) =>
            item.childItems ? (
              <Grid
                container
                key={`${item.key} + ${index}`}
                direction={"column"}
                sx={{ mt: index === 0 ? "10px" : "0" }}
              >
                <Accordion
                  square={true}
                  // defaultExpanded={["G1"]}
                  // defaultExpanded={expanded.includes(item.key)}
                  TransitionProps={{ unmountOnExit: true }}
                  sx={{
                    boxShadow: "none",
                    p: 0,
                    m: 0,
                    mb: index === items.length - 1 ? 10 : 0,
                  }}
                  disableGutters={true}
                  expanded={expanded.includes(item.key)} // Check if panel is in expanded state
                  onChange={handleAccordionChange(item.key)}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMore
                        sx={{
                          fontSize: "16px",
                          color: "var(--color--main)",
                        }}
                      />
                    }
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{
                      p: 0,
                      m: 0,

                      mt: "2px",
                      minHeight: "0px",
                      height: "36px",
                      ":hover": {
                        color: "var(--color--main)",
                        backgroundColor: "var(--color--main-light04)",
                      },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                    }}
                  >
                    <Grid
                      container
                      direction="row"
                      sx={{
                        pl: "10px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Grid
                        sx={{
                          opacity: 0.9,
                          display: "flex",
                          alignItems: "center",
                          fontSize: "20px",
                        }}
                      >
                        {item.icon}
                      </Grid>
                      <Grid
                        sx={{
                          fontWeight: "bold",
                          fontSize: ".875rem",
                          pl: "6px",
                        }}
                      >
                        {item.label}
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      p: 0,
                      m: 0,
                      pl: "10px",
                      mb: index === items.length - 1 ? 10 : 0,
                      mt: 0.5,
                    }}
                  >
                    <Grid container direction={"row"}>
                      <Grid
                        item
                        md={0.1}
                        sx={{
                          width: "2px",
                          height: "auto",
                          backgroundColor: "rgba(0,0,0,0.05)",
                          marginLeft: "0px",
                        }}
                      ></Grid>
                      <Grid item md={11.9} container direction={"column"}>
                        {item.childItems.map((subItem, i) => {
                          const pathNav = new RegExp(subItem.linkP, "i");
                          const result = location.pathname.match(pathNav);
                          return (
                            <Grid
                              item
                              component={Link}
                              key={`${subItem.key} + ${i}`}
                              to={subItem.link}
                              onClick={closeNavMobile}
                              sx={{
                                textAlign: "left",
                                textDecoration: "none",
                                borderRadius: "8px",
                                padding: "6px",
                                pl: "24px",
                                marginLeft: "-2px",
                                marginBottom: "4px",
                                color: result
                                  ? "var(--color--main)"
                                  : "#000000",
                                backgroundColor: result
                                  ? "var(--color--main-light1)"
                                  : "",
                                borderLeft: result
                                  ? "3px solid var(--color--main)"
                                  : "3px solid rgba(0,0,0,0.01)",
                                fontWeight: result ? "bold" : "0",
                                fontSize: ".875rem",
                                ":hover": {
                                  color: "var(--color--main)",
                                  borderLeft: "3px solid var(--color--main)",
                                  backgroundColor: "var(--color--main-light04)",
                                  borderRadius: "8px",
                                },
                              }}
                            >
                              {subItem.label}
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ) : (
              <Grid
                key={`${item.key} + ${index}`}
                component={Link}
                to={item.link}
                onClick={closeNavMobile}
                container
                direction={"row"}
                sx={{
                  alignItems: "center",
                  textDecoration: "none",
                  borderRadius: "8px",
                  height: "36px",
                  mt: "2px",
                  pl: "10px",
                  color:
                    location?.pathname === item.link
                      ? "var(--color--main)"
                      : "#000000",
                  backgroundColor:
                    location?.pathname === item.link
                      ? "var(--color--main-light1)"
                      : "",
                  fontWeight: location?.pathname === item.link ? "bold" : "0",
                  fontSize: ".875rem",
                  ":hover": {
                    color: "var(--color--main)",
                    backgroundColor: "var(--color--main-light04)",
                    borderRadius: "8px",
                  },
                  ":hover .text-hover": {
                    color: "var(--color--main)",
                  },
                }}
              >
                <Grid
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "20px",
                    opacity: 0.8,
                  }}
                >
                  {item.icon}
                </Grid>
                <Grid
                  item
                  sx={{
                    textAlign: "left",
                    fontWeight: "bold",
                    pl: "6px",
                    color:
                      location?.pathname === item.link
                        ? "var(--color--main)"
                        : "#000000",
                  }}
                  className="text-hover"
                >
                  {item.label}
                </Grid>
              </Grid>
            )
          )}
        </Grid>
      </Box>
    </SwipeableDrawer>
  );
};

export default SidebarMobile;
