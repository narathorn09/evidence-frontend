import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import { Grid, IconButton } from "@mui/material";
import { MenuRounded } from "@mui/icons-material";
import { useAuth } from "../contexts/auth-context";
import useAxiosPrivate from "../hook/use-axios-private";

const Header = ({ openNavMobile }) => {
  const navigate = useNavigate();
  const [me, setMe] = useState();
  const requestPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getMe = async () => {
      try {
        const response = await requestPrivate.get("/me", {
          signal: controller.signal,
        });
        isMounted && setMe(response?.data);
        if (response.status !== 200) navigate("/login");
      } catch (error) {
        console.error(error);
      }
    };
    getMe();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  // console.log("me", me);

  const { setAuthToken } = useAuth();
  const handleSelectChange = async (value) => {
    try {
      if (value === "profile") {
        navigate(`/profile/${me?.id}`);
      } else if (value === "logout") {
        await requestPrivate.get("/logout");
        setAuthToken(null); // Clear the access token in the authentication context
        localStorage.removeItem("token"); // Remove the access token from local storage
        navigate("/login");
      }
    } catch (err) {
      navigate("/login");
    }
  };

  return (
    <Grid
      container
      direction={"row"}
      sx={{
        width: "100vw",
        height: "var(--header--height)",
        top: "0",
        pl: {
          xs: "24px",
          sm: "24px",
          md: "calc(var(--sidebar--width) + 24px)",
        },
        pr: 3,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: " blur(8px)",
        position: "fixed",
        zIndex: 2,
        borderBottom: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      <Grid
        item
        xs={6}
        sx={{
          display: { xs: "flex", sm: "flex", md: "none" },
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <IconButton onClick={openNavMobile}>
          <MenuRounded sx={{ color: "var(--color--main)" }} />
        </IconButton>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={12}
        container
        direction={"column"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Grid sx={{ fontSize: "10px", textAlign: "left" }}>
          {me?.role === "0" && "ผู้ดูแลระบบ"}
          {me?.role === "1" && "ผู้การ"}
          {me?.role === "2" && "พนง. ตรวจสถานที่เกิดเหตุ"}
          {me?.role === "3" && "ผู้กำกับ"}
          {me?.role === "4" && "ผู้ชำนาญการ"}
        </Grid>
        <Grid>
          <Select
            value={
              (me?.rank ?? "") +
              " " +
              (me?.fname ?? "") +
              " " +
              (me?.lname ?? "")
            }
            style={{
              width: "100%",
              height: "fit-content",
              marginTop: "5px",
              backgroundColor: "rgba(125, 50, 50, 0.1)",
              borderRadius: "8px",
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
