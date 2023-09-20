import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button, Form, Input, Select } from "antd";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import Swal from "sweetalert2";

const CreateCommander = () => {
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (value) => {
    try {
      const response = await requestPrivate.post("/commander", value);
      if (response) {
        Swal.fire({
          title: "เพิ่มสำเร็จ!",
          text: "เพิ่มผู้การสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        navigate(-1);
      }
    } catch (err) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการเพิ่มผู้การ",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    return;
  };

  const handleUsernameChange = async (username) => {
    try {
      const response = await requestPrivate.post(`/checkUsername`, {
        username: username,
      });
      if (response.data.length > 0) {
        return true;
      } else if (response.data.length === 0) {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const defaultValues = {
    nametitle: "",
    fname: "",
    rank: "พล.ต.ต.",
    lnanme: "",
    username: "",
    password: "",
    confirm: "",
  };
  
  // Reset fields and set default values
  const handleResetFields = () => {
    form.resetFields();
    form.setFieldsValue(defaultValues);
  };

  const tailLayout = {
    wrapperCol: {
      offset: 4,
      span: 20,
    },
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, []);
  
  return (
    <div>
      <Helmet>
        <title>เพิ่มผู้การ - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการผู้ใช้" },
          { title: "รายชื่อผู้การ", path: `/user-management/commander/list` },
          { title: "เพิ่มผู้การ" },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left" }}>
          <h2>เพิ่มผู้การ</h2>
        </Grid>

        <Form
          form={form}
          size="middle "
          name="basic"
          labelCol={{
            span: 4,
          }}
          labelAlign="left"
          wrapperCol={{
            span: 20,
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="คำนำหน้า"
            name="nametitle"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>
                    กรุณาเลือกคำนำหน้าชื่อ!
                  </span>
                ),
              },
            ]}
            style={{ textAlign: "start" }}
          >
            <Select>
              <Select.Option value="นาย">นาย</Select.Option>
              <Select.Option value="นาง">นาง</Select.Option>
              <Select.Option value="นางสาว">นางสาว</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="ยศ"
            name="rank"
            rules={[
              {
                required: true,
                message: "Please input your first name!",
              },
            ]}
            style={{ textAlign: "start" }}
          >
            <Input disabled={true} />
          </Form.Item>

          <Form.Item
            label="ชื่อจริง"
            name="fname"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>กรุณากรอกชื่อจริง!</span>
                ),
              },
              {
                validator: (_, value) => {
                  if (value && value.length > 50) {
                    return Promise.reject({
                      message: (
                        <span style={{ fontSize: "12px" }}>
                          ไม่สามารถกรอกเกิน 50 ตัวอักษรได้
                        </span>
                      ),
                    });
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ textAlign: "start" }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="นามสกุล"
            name="lname"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>กรุณากรอกนามสกุล!</span>
                ),
              },
              {
                validator: (_, value) => {
                  if (value && value.length > 50) {
                    return Promise.reject({
                      message: (
                        <span style={{ fontSize: "12px" }}>
                          ไม่สามารถกรอกเกิน 50 ตัวอักษรได้
                        </span>
                      ),
                    });
                  }
                  return Promise.resolve();
                },
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
                message: (
                  <span style={{ fontSize: "12px" }}>กรุณากรอกชื่อผู้ใช้!</span>
                ),
              },
              {
                validator: (_, value) => {
                  if (value && value.length > 20) {
                    return Promise.reject({
                      message: (
                        <span style={{ fontSize: "12px" }}>
                          ไม่สามารถกรอกเกิน 20 ตัวอักษรได้
                        </span>
                      ),
                    });
                  }
                  return Promise.resolve();
                },
              },
              {
                validator: async (_, value) => {
                  let result = await handleUsernameChange(value);
                  if (!value || !result) {
                    return Promise.resolve();
                  }
                  return Promise.reject({
                    message: (
                      <span style={{ fontSize: "12px" }}>
                        ชื่อผู้ใช้ไม่พร้อมใช้งาน
                      </span>
                    ),
                  });
                },
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
                message: (
                  <span style={{ fontSize: "12px" }}>กรุณากรอกรหัสผ่าน!</span>
                ),
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
                message: (
                  <span style={{ fontSize: "12px" }}>กรุณายืนยันรหัสผ่าน!</span>
                ),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject({
                    message: (
                      <span style={{ fontSize: "12px" }}>
                        รหัสผ่านไม่ตรงกัน!
                      </span>
                    ),
                  });
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
            <Button onClick={handleResetFields} style={{ marginLeft: 10 }}>
              ล้างค่า
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </div>
  );
};
export default CreateCommander;
