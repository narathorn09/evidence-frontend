import React, { useState, Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { Empty as EmptyAnt } from "antd";
import { Grid } from "@mui/material";

const Header = lazy(() => import("./header-layout"));
const SidebarMobile = lazy(() => import("./sidebar-mobile"));
const SidebarDesktop = lazy(() => import("./sidebar-desktop"));
const Loading = lazy(() => import("../components/loading"));

const Layout = ({ children }) => {
  const location = useLocation();
  const [isopenNavMobile, setIsOpenNavMobile] = useState(false);

  const openNavMobile = () => {
    setIsOpenNavMobile(true);
  };

  const closeNavMobile = () => {
    setIsOpenNavMobile(false);
  };

  return (
    <>
      {location?.pathname !== "/login" ? (
        <div>
          <Grid container className="bg-main h-full max-h-screen">
            <Header openNavMobile={openNavMobile} />
            <Grid className="xs:hidden md:flex">
              <SidebarDesktop />
            </Grid>
            <Grid
              item
              sx={{
                zIndex: 1,
                // display: "block",
                position: "flex",
                marginLeft: { xs: "0", sm: "0", md: "var(--sidebar--width)" },
                width: {
                  xs: "100%",
                  sm: "100%",
                  md: "calc(100vw - var(--sidebar--width))",
                },
                pl: { xs: "24px", sm: "24px", md: "40px" },
                pr: { xs: "24px", sm: "24px", md: "40px" },
                pt: "calc(var(--header--height) + 24px)",
                pb: "48px",
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
          <SidebarMobile
            openNavMobile={openNavMobile}
            closeNavMobile={closeNavMobile}
            isopenNavMobile={isopenNavMobile}
          />
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Layout;
