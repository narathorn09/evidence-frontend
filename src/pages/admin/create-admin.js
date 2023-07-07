import React from "react";
import { Helmet } from "react-helmet";
import { Button, Form, Input } from "antd";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";

const CreateAdmin = () => {
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (value) => {
    console.log(value);
    try {
      const response = await requestPrivate.post("/admin", value);
      if (response) {
        alert(`เพิ่มสมาชิกสำเร็จ`);
        navigate(-1);
      }
    } catch (err) {
      alert(`เกิดปัญหาในการเพิ่มสมาชิก : ${err}`);
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

  const tailLayout = {
    wrapperCol: {
      offset: 4,
      span: 20,
    },
  };

  return (
    <div>
      <Helmet>
        <title>Add Admin - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการผู้ใช้" },
          { title: "รายชื่อผู้ดูแลระบบ", path: `/user-management/admin/list` },
          { title: "เพิ่มผู้ดูแลระบบ" },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left" }}>
          <h2>เพิ่มผู้ดูแลระบบ</h2>
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
          // fields={fields}
          // onFieldsChange={(fieldValues, allFields) => {
          //   if (fieldValues[0].name[0] === 'username')
          //   validUsername(fieldValues[0].value);
          // }}
          // onValuesChange={(changedValues, allValues) => {
          //   // if (changedValues?.username)
          //   handleUsernameChange(changedValues?.username);
          // }}
        >
          <Form.Item
            label="ชื่อจริง"
            name="admin_fname"
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
            name="admin_lname"
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
            initialValue={""}
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>กรุณากรอกชื่อผู้ใช้!</span>
                ),
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
            <Button
              onClick={() => form.resetFields()}
              style={{ marginLeft: 10 }}
            >
              รีเซ็ต
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </div>
  );
};

export default CreateAdmin;
