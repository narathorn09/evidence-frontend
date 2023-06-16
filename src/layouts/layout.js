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
            <Header />
            <Grid className="xs:hidden md:flex">
              <SidebarDesktop />
            </Grid>
            <Grid
              item
              sx={{
                zIndex: 0,
                display: "block",
                // bgcolor: "red",
                position: "relative",
                marginLeft: { xs: "0", sm: "0", md: "var(--sidebar--width)" },
                width: { xs: "100%", sm: "100%", md: "calc(100% - 240px)" },
                pl: { xs: "24px", sm: "24px", md: "60px" },
                pr: { xs: "24px", sm: "24px", md: "60px" },
                pt: "calc(var(--header--height) + 24px)",
              }}
            >
              <Suspense fallback={<Loading />}>
                {children || (
                  <EmptyAnt
                    className="self-center justify-self-center"
                    image={EmptyAnt.PRESENTED_IMAGE_DEFAULT}
                    description={<body className="opacity-50">No data</body>}
                  />
                )}
              </Suspense>
            </Grid>
            {/* </Grid> */}
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
