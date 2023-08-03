import React, { useState, useCallback, useEffect } from "react";
import { Button, Form, Input } from "antd";
import { Helmet } from "react-helmet";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Biotech } from "@mui/icons-material";
import { request } from "../axios-config";
import { useAuth } from "../contexts/auth-context";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuthToken } = useAuth();
  const [loadings, setLoadings] = useState(false);
  const [login, setLogin] = useState(false);

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
          setLogin(true);
          setLoadings(false);
          Swal.fire({
            title: "เข้าสู่ระบบสำเร็จ!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
        }
      } catch (err) {
        setLoadings(false);
        Swal.fire({
          title: "เข้าสู่ระบบไม่สำเร็จ!",
          text: "โปรดตรวจสอบ username และ password อีกครั้ง",
          icon: "error",
          confirmButtonText: "ตกลง",
        });
      }
    },
    [setAuthToken]
  );

  useEffect(() => {
    const role = auth?.user?.role;
    if (role) {
      if (role === "0") navigate("/home"); //admin
      else if (role === "1") navigate("/home"); //commander
      else if (role === "2") navigate("/home"); //Scene Investigator
      else if (role === "3") navigate("/home"); //Director
      else if (role === "4") navigate("/home"); //Expert
      console.log("Auth", auth?.user);
    }
  }, [login]);

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
              // rules={[
              //   {
              //     required: true,
              //     message: (
              //       <span style={{ fontSize: "12px" }}>
              //         กรุณากรอก username!
              //       </span>
              //     ),
              //   },
              // ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              // rules={[
              //   {
              //     required: true,
              //     message: (
              //       <span style={{ fontSize: "12px" }}>
              //         กรุณากรอก password!
              //       </span>
              //     ),
              //   },
              // ]}
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
