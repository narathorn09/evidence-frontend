import React, { useState, useCallback } from "react";
import { Button, Form, Input } from "antd";
import { Helmet } from "react-helmet";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Biotech } from "@mui/icons-material";
import { request } from "../axios-config";
import { useAuth } from "../contexts/auth-context";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();
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
          await setAuthToken(accessToken);
          navigate("/");
          setLoadings(false);
        }
      } catch (err) {
        setLoadings(false);
        alert("Invalid username / password");
      }
    },
    [navigate, setAuthToken]
  );

  // const onFinishFailed = (errorInfo) => {
  //   console.log("Failed:", errorInfo);
  // };

  return (
    <div>
      <Helmet>
        <title>Login - Forensic Science</title>
      </Helmet>

      <Box
        sx={{
          boxSizing: "border-box",
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "rgba(0,0,0,0.05)",
          pl: "20px",
          pr: "20px",
        }}
      >
        <Box
          sx={{
            padding: 5,
            pb: 6,
            borderRadius: "8px",
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
              alignItems: "center",
              justifyContent: "center",
            }}
            initialValues={{
              remember: true,
              username: "admin",
              password: "123456",
            }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item style={{ justifyContent: "center", display: "flex" }}>
              <Box
                sx={{
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Biotech
                  sx={{ color: "var(--color--main)", fontSize: "60px" }}
                />
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
                  message: (
                    <span style={{ fontSize: "12px" }}>กรุณากรอก username!</span>
                  ),
                  
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
                  message: (
                    <span style={{ fontSize: "12px" }}>กรุณากรอก password!</span>
                  ),
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loadings}
              style={{ width: "100%" }}
            >
              LOGIN
            </Button>
          </Form>
        </Box>
      </Box>
    </div>
  );
};
export default Login;
