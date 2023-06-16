import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getItemsNav } from "./items-navigate/get-item-nav";
import { Box, Button, Grid, Divider } from "@mui/material";
import BiotechIcon from "@mui/icons-material/Biotech";
import { Layout as LayoutAnt } from "antd";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const items = getItemsNav();

const SidebarDesktop = () => {
  const location = useLocation();
  const [selectedChildItem, setSelectedChildItem] = useState("");

  useEffect(() => {
    // Retrieve the selected child item from localStorage if available
    const storedChildItem = localStorage.getItem("selectedChildItem");
    if (storedChildItem) {
      setSelectedChildItem(storedChildItem);
    }
  }, []);

  useEffect(() => {
    // Save the selected child item to localStorage
    localStorage.setItem("selectedChildItem", selectedChildItem);
  }, [selectedChildItem]);

  return (
    <Box
      sx={{
        width: "var(--sidebar--width)",
        height: "100vh",
        top: "0",
        backgroundColor: "#ffff",
        position: "fixed",
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
          <BiotechIcon
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
              fontSize: "10px",
              color: "var(--color--main)",
            }}
          >
            หน่วยพิสูจน์หลักฐาน
          </Grid>
        </Grid>
      </Grid>

      <Grid sx={{ pl: 3, pr: 3 }}>
        {items.map((item, index) =>
          item.childItems ? (
            <Grid
              container
              key={item.key}
              direction={"column"}
              sx={{ mt: index === 0 ? "10px" : "0" }}
            >
              <Accordion
                square={true}
                defaultExpanded={item.childItems.some(
                  (subItem) =>
                    subItem.link === localStorage.getItem("selectedChildItem")
                )}
                TransitionProps={{ unmountOnExit: true }}
                sx={{
                  boxShadow: "none",
                  p: 0,
                  m: 0,
                  mb: index === items.length - 1 ? 10 : 0,
                }}
                disableGutters={true}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        fontSize: "16px",
                        color: "var(--color--main)",
                        // transform: "rotate(-90deg)",
                      }}
                    />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{
                    p: 0,
                    m: 0,
                    mt: "0px",
                    height: "16px",
                    ":hover": {
                      color: "var(--color--main)",
                    },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid
                    sx={{
                      fontWeight: "bold",
                      fontSize: ".875rem",
                    }}
                  >
                    {item.title}
                  </Grid>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ p: 0, m: 0, mb: index === items.length - 1 ? 10 : 0 }}
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
                      {item.childItems.map((subItem) => {
                        return (
                          <Grid
                            item
                            component={Link}
                            key={subItem.key}
                            to={subItem.link}
                            onClick={() => setSelectedChildItem(subItem.link)}
                            sx={{
                              textAlign: "left",
                              textDecoration: "none",
                              borderRadius: "8px",
                              padding: "6px",
                              pl: "24px",
                              marginLeft: "-2px",
                              marginBottom: "4px",
                              color:
                                location?.pathname === subItem.link
                                  ? "var(--color--main)"
                                  : "#000000",
                              backgroundColor:
                                location?.pathname === subItem.link
                                  ? "var(--color--main-light1)"
                                  : "",
                              borderLeft:
                                location?.pathname === subItem.link
                                  ? "3px solid var(--color--main)"
                                  : "3px solid rgba(0,0,0,0.01)",
                              fontWeight:
                                location?.pathname === subItem.link
                                  ? "bold"
                                  : "0",
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
            <></>
          )
        )}
      </Grid>
    </Box>
  );
};
export default SidebarDesktop;
