import {
  Layout,
  Menu,
  Button as ButtonAnt,
  theme,
  Divider as DividerAnt,
  Drawer as DrawerAnt,
} from "antd";

import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Box, Stack, Grid } from "@mui/material";
import BiotechIcon from "@mui/icons-material/Biotech";
import "./sidebar.css";
const { useToken } = theme;
const { Sider, Header, Content, Footer } = Layout;

const items = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: "Home",
    link: "/",
  },
  {
    key: "2",
    icon: <VideoCameraOutlined />,
    label: "nav 2",
    link: "/2",
  },
  {
    key: "3",
    icon: <UploadOutlined />,
    label: "nav 3",
    link: "/3",
  },
];

const Sidebar = (props) => {
  const { token } = useToken();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Grid
      container
      style={{
        // minHeight: 1000,
        height: "100%",
        backgroundColor: token.colorPrimary,
        // borderColor: "rgba(255,255,255)",
        maxWidth: "calc(100hv)",
      }}
      // theme="dark"
    >
      <Header
        style={{
          paddingLeft: 0,
          paddingRight: 26,
          height: 85,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          position: "fixed",
          zIndex: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            flex: 10,
          }}
        >
          <img
            src="./assets/micro-icon.png"
            alt="logo"
            style={{ width: 80, height: 80, marginTop: 10 }}
          />
          <Grid display={{ xs: "none", md: "flex" }}>
            <h4 style={{ color: "#FFFFFF" }}>Forensic Science</h4>
          </Grid>
          <Grid display={{ xs: "none", md: "flex" }}>
            <ButtonAnt
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 32,
                height: 32,
                color: "#fff",
                backgroundColor: "rgba(255, 255, 255, 0)",
                marginLeft: 30,
              }}
            />
          </Grid>
        </Box>

        <ButtonAnt icon={<LogoutOutlined />} onClick={() => navigate("/login")}>
          Logout
        </ButtonAnt>
        <Grid display={{ xs: "flex", md: "none" }}>
          <ButtonAnt
            icon={collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            onClick={showDrawer}
            style={{
              width: 32,
              height: 32,
              color: "#fff",
              backgroundColor: "rgba(255, 255, 255, 0)",
              marginLeft: 30,
            }}
          />
        </Grid>
      </Header>
      {/* <Layout> */}
      <Grid item display={{ xs: "none", md: "flex" }}>
        <Sider
          trigger={null}
          theme="dark"
          collapsible
          collapsed={collapsed}
          // onCollapse={(value) => setCollapsed(value)}
          width={250}
          style={{
            position: "fixed",
            left: 0,
            top: 70,
            height: "calc(100%)",
            zIndex: 1,
            backgroundColor: "#001529",
          }}
        >
          <Menu theme="dark" mode="inline" style={{ padding: 10 }}>
            {items.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                style={
                  location.pathname === item.link
                    ? {
                        backgroundColor: "rgba(255,255,255,0.3)",
                        color: "#ffffff",
                      }
                    : {}
                }
              >
                <Link to={item.link}>{item.label}</Link>
              </Menu.Item>
            ))}
            <Menu.Item
              style={{ height: 500, visibility: "hidden" }}
            ></Menu.Item>
          </Menu>
        </Sider>
      </Grid>
      <Grid
        item
        marginLeft={{ xs: "0px", md: collapsed ? "80px" : "250px" }}
        // margin={{xs: 10}}
        style={{
          // borderRadius: "8px 0px 0px 0px",
          padding: "0px 0px 0px",
          backgroundColor: "#001529",
          // marginLeft:  ,
          // minHeight: "100vh",
          transition: "margin-left 0.3s ease",
          width: "100%",
          borderColor: "rgba(255,255,255)",
        }}
      >
        {/* <Layou
            style={{
              borderRadius: "8px 8px 0  0",
              padding: 24,
              marginRight: 24,
            }}
          > */}
        <Grid
          borderRadius={{ xs: "0px", md: "8px 0px 0px 0px" }}
          style={{
            padding: 24,
            minHeight: "100vh",
            background: "rgba(255,255,255)", // Update the background color here
            display: "flex",
            justifyContent: "center",
            // transition: "margin 0.2s",
            marginTop: 85,
          }}
        >
          {props?.children || <></>}
        </Grid>
        {/* </Layout> */}
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
      </Grid>
      {/* </Layout> */}

      <DrawerAnt
        title=" "
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
        key="right"
        style={{
          // minWidth: "calc(100hv)",
          backgroundColor: token.colorPrimary,
        }}
        width={"calc(100% - 20%)"}
      >
        <Menu theme="dark" mode="inline">
          {items.map((item) => (
            <Menu.Item
              onClick={onClose}
              key={item.key}
              icon={item.icon}
              style={
                location.pathname === item.link
                  ? {
                      backgroundColor: "rgba(255,255,255,0.3)",
                      color: "#ffffff",
                    }
                  : {}
              }
            >
              <Link to={item.link}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </DrawerAnt>
    </Grid>
  );
};

export default Sidebar;
