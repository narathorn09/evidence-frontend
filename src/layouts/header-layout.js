import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { Layout as LayoutAnt, Button as ButtonAnt, Select } from "antd";
import { Box, Grid } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("นายนราธร หนูพุ่ม");

  const handleSelectChange = (value) => {
    if (value === "profile") {
      navigate("/profile");
    } else if (value === "logout") {
      navigate("/login");
    }
  };

  return (
    <Grid
      container
      sx={{
        width: "100vw",
        height: "var(--header--height)",
        top: "0",
        pl: { xs: "0", sm: "0", md: "var(--sidebar--width)" },
        pr: 3,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: " blur(8px)",
        position: "fixed",
        zIndex: 2,
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        // transition: "width 100ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      }}
    >
      <Grid
        item
        container
        direction={"column"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Grid sx={{ fontSize: "10px", textAlign: "left" }}>ผู้ดูแลระบบ</Grid>
        <Grid>
          <Select
            value={name}
            style={{
              width: "fit-content",
              height: "fit-content",
              // marginRight: "-11px",
              marginTop: "5px",
              backgroundColor: "rgba(125, 50, 50, 0.1)",
              borderRadius: "8px",
              // padding: "-10px",
              fontSize: "5px",
            }}
            bordered={false}
            options={[
              {
                value: "profile",
                label: "ข้อมูลส่วนตัว",
              },
              {
                value: "logout",
                label: "ออกจากระบบ",
              },
            ]}
            onChange={handleSelectChange}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Header;
