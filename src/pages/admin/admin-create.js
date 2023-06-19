import { Button, Checkbox, Form, Input, Layout, Col, Row } from "antd";
import { Box, Grid } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../axios-config";
import BreadcrumbLayout from "../../components/breadcrumbs";

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
      offset: 4,
      span: 20,
    },
  };
  return (
    <>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการผู้ใช้" },
          { title: "รายชื่อผู้ดูแลระบบ", path: `/user-management/admin/list` },
          { title: "เพิ่มผู้ดูแลระบบ" },
        ]}
      />
      <Box sx={{ width: "100%" , height: "100%"}}>
        <Grid sx={{ textAlign: "left" }}>
          <h2>เพิ่มผู้ดูแลระบบ</h2>
        </Grid>

        <Form
          size="middle "
          name="basic"
          labelCol={{
            span: 4,
          }}
          labelAlign="left"
          wrapperCol={{
            span: 20,
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
            label="ชื่อจริง"
            name="admin_fname"
            rules={[
              {
                required: true,
                message: "Please input your first name!",
              },
            ]}
            style={{ textAlign: "start" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="นามสกุล"
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
            label="ชื่อผู้ใช้"
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
            label="รหัสผ่าน"
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
            label="ยืนยันรหัสผ่าน"
            name="confirm"
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
              ยืนยัน
            </Button>
            <Button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>
              ยกเลิก
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </>
  );
};
export default AdminCreate;
