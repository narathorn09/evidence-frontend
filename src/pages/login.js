import { Button, Checkbox, Form, Input, Layout } from "antd";
import { Box } from "@mui/material";
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Biotech } from "@mui/icons-material";
import { request } from "../axios-config";
import { useAuth } from "../contexts/auth-context";

const Login = () => {
  const { setAuthToken } = useAuth();
  const navigate = useNavigate();
  const [loadings, setLoadings] = useState(false);

  const onFinish = useCallback(
    async (values) => {
      try {
        setLoadings(true);
        const response = await request.post("/login", values, {
          withCredentials: true,
        });

        if (response.status === 200) {
          const { accessToken } = response.data;
          await setAuthToken(accessToken); // Update authentication state with the token
          navigate("/"); // Navigate to the desired page
          setLoadings(false);
        }
      } catch (err) {
        // console.error("Login error:", err);
        setLoadings(false);
        alert("Invalid username / password");
      }
    },
    [navigate, setAuthToken]
  );

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Box
      sx={{
        boxSizing: "border-box",
        display: "flex",
        // flexFlow: "row wrap",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        // height: "100%",
        minHeight: "100vh",
        background: "rgba(0,0,0,0.05)",
        // padding: 20,
        pl: "20px",
        pr: "20px",
        // pt: 2,
        // pb: 2,
      }}
    >
      <Box
        sx={{
          padding: 5,
          pb: 6,
          borderRadius: "8px",
          // boxShadow: "2px 2px 2px 0px rgba(0, 0, 0, 0.2)",
          background: "rgba(255, 255, 255,1)",
          width: "calc(100% + 16px)",
          maxWidth: 300,
          minWidth: 200,
        }}
      >
        <Form
          size="middle "
          name="basic"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          layout="vertical"
          style={{
            //   display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          initialValues={{
            remember: true,
            username: "admin",
            password: "123456",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item style={{ justifyContent: "center", display: "flex" }}>
            {/* <img
              src="/assets/logo-bg-black.png"
              alt="logo"
              style={{ width: 100, height: 100, borderRadius: "50%" }}
            /> */}
            <Box
              sx={{
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Biotech sx={{ color: "var(--color--main)", fontSize: "60px" }} />
              <Box
                sx={{
                  color: "var(--color--main)",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Forensic Science
              </Box>
              <Box
                sx={{
                  color: "var(--color--main)",
                  fontSize: "10px",
                  fontWeight: "light",
                }}
              >
                หน่วยพิสูจน์หลักฐาน
              </Box>

              <Box
                sx={{
                  color: "var(--color--main)",
                  fontSize: "24px",
                  fontWeight: "bold",
                  mt: "30px",
                }}
              >
                LOGIN
              </Box>
            </Box>
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* <Form.Item style={{ justifyContent: "center", display: "flex" }}> */}
          <Button
            type="primary"
            htmlType="submit"
            loading={loadings}
            style={{ width: "100%" }}
          >
            LOGIN
          </Button>
          {/* </Form.Item> */}
        </Form>
      </Box>
    </Box>
  );
};
export default Login;
