import { Layout, Menu, Button, theme } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Link, useMatch, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import logo from "./micro-icon.png"
const { Sider, Header, Content, Footer } = Layout;

const Sidebar = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const items = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Home",
      link: "/home",
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

  return (
    <Layout style={{ height: 1000 }}>
      <Header
        // theme="light"
        style={{
          paddingLeft: 20,
          height: 85,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            fontSize: "16px",
            width: "100%",
            color: "#fff",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div style={{ marginTop: 24, paddingRight: 30 }}>
            <img src={logo} alt="logo" style={{ width: 33, height: 38 }} />
          </div>
          <div>
            <div style={{ marginBottom: -40 }}>Forensic Science</div>
            <div
              style={{
                marginBottom: 0,
                // fontFamily: "Inter",
                fontStyle: "normal",
                fontWeight: 500,
                fontSize: "12px",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              หน่วยพิสูจน์หลักฐาน 9
            </div>
          </div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "#fff",
              marginLeft: 60,
            }}
          />
        </Box>
      </Header>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
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
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 0px 0px", background: "#001529" }}>
          <Layout
            style={{
              borderRadius: "8px 0 0  0",
              padding: 24,
            }}
          >
            <Content
              style={{
                borderRadius: "8px",
                //   margin: "24px 16px",
                padding: 24,
                minHeight: 280,
                background: "rgba(255,255,255)", // Update the background color here
              }}
            >
              {props.children}
            </Content>
          </Layout>
          <Footer>asdasd</Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Sidebar;
