import { Button, Checkbox, Form, Input, Row, Col, Layout } from "antd";
import { Box, Stack, Grid } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const { Sider, Header, Content, Footer } = Layout;

const Login = () => {
  const navigate = useNavigate();
 const [loadings, setLoadings] = useState(false);

  const onFinish = (value) => {
    setLoadings(true);
    setTimeout(() => {
      setLoadings(false);
      navigate("/");
    }, 2000);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Layout
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexFlow: "row wrap",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh)",
        background: "#001529",
        padding: 20,
      }}
    >
      <Box
        sx={{
          padding: 5,
          borderRadius: "8px",
          boxShadow: "2px 2px 2px 0px rgba(0, 0, 0, 0.2)",
          background: "rgba(255, 255, 255,1)",
          width: "calc(100% + 16px)",
          maxWidth: 400,
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
            password: "12345678",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item style={{ justifyContent: "center", display: "flex" }}>
            <img
              src="./assets/logo-bg-black.png"
              alt="logo"
              style={{ width: 100, height: 100, borderRadius: "50%" }}
            />
          </Form.Item>
          <Form.Item
            style={{
              justifyContent: "center",
              display: "flex",
              marginTop: -20,
              marginBottom: 0,
            }}
          >
            {/* <h2>Forensic Science</h2> */}
            <h2>LOGIN</h2>
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

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item style={{ justifyContent: "center", display: "flex" }}>
            <Button type="primary" htmlType="submit" loading={loadings}>
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Layout>
  );
};
export default Login;
