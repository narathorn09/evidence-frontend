import { Button, Checkbox, Form, Input, Layout } from "antd";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminCreate = () => {
  const navigate = useNavigate();
  const onFinish = (value) => {
    console.log("value:", value);

    navigate("/");
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Box>
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item style={{ justifyContent: "center", display: "flex" }}>
          <img
            src="/assets/logo-bg-black.png"
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
          <Button type="primary" htmlType="submit" >
            LOGIN
          </Button>
        </Form.Item>
      </Form>
    </Box>
  );
};
export default AdminCreate;
