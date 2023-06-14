import { Button, Checkbox, Form, Input, Layout, Col, Row } from "antd";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request, requestPrivate } from "../../axios-config";

const AdminCreate = () => {
  const navigate = useNavigate();

  const onFinish = async (value) => {
    await request.post("/admin", value).then((response) => {
      console.log("response:", response.data);
      navigate(-1);
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 10,
    },
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ textAlign: "center" }}>
        <h2>Add Admin</h2>
      </Box>

      <Form
        size="middle "
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 10,
        }}
        // layout="vertical"
        style={{
          //   display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Firstname"
          name="admin_fname"
          rules={[
            {
              required: true,
              message: "Please input your first name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Lastname"
          name="admin_lname"
          rules={[
            {
              required: true,
              message: "Please input your last name!",
            },
          ]}
        >
          <Input />
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
        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={() => navigate(-1)}style={{marginLeft: 10}}>Cancel</Button>
        </Form.Item>
      </Form>
    </Box>
  );
};
export default AdminCreate;
