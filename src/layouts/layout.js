import React, { useState, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { Empty as EmptyAnt } from "antd";
import { Grid } from "@mui/material";
import SidebarDesktop from "./sidebar-desktop";
import SidebarMobile from "./sidebar-mobile";
import Header from "./header-layout";
import Loading from "../components/loading";

const Layout = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  const openNavMobile = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const openNavDesktop = () => {
    setCollapsed(!collapsed);
  };

  // console.log("location", location);

  return (
    <>
      {location?.pathname !== "/login" ? (
        <div>
          <Grid container className="bg-main h-full max-h-screen">
            <Header
              isCollapsed={collapsed}
              navopenDesktop={openNavDesktop}
              navopenMobile={openNavMobile}
            />
            <div>
              <div className="xs:hidden md:flex">
                <SidebarDesktop isNavOpen={collapsed} />
              </div>
            </div>
            <Grid
              className="bg-white w-full transition-all duration-300 ease min-h-screen"
              marginLeft={{ xs: "0px", md: collapsed ? "80px" : "250px" }}
            >
              <Grid className="bg-main">
                <Grid
                  item
                  xs={12}
                  mb={12}
                  className="p-6 bg-white flex justify-center max-h-fit "
                  borderRadius={{ xs: "0px", md: "8px 0px 0px 0px" }}
                  sx={{
                    mt: "85px",
                  }}
                >
                  <Suspense fallback={<Loading />}>
                    {children || (
                      <EmptyAnt
                        className="self-center justify-self-center"
                        image={EmptyAnt.PRESENTED_IMAGE_DEFAULT}
                        description={
                          <body className="opacity-50">No data</body>
                        }
                      />
                    )}
                  </Suspense>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* <Footer
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // position: "static",
              bottom: 0,
              width: "100%",
              backgroundColor: "#f5f5f5",
              // marginLeft: 80,
              textAlign: "center",
            }}
          >
            <body>© 2023 Forensic Science, All Rights Reserved.</body>
          </Footer> */}
          <SidebarMobile navClose={onClose} isNavOpen={open} />
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Layout;


