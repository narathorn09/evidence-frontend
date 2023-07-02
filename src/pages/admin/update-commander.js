import React, {  useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Form, Input, Select } from "antd";
import { Box, Grid } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";

const UpdateCommander = () => {
  const params = useParams();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [personData, setPersonData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/commanderById/${params?.id}`);
        setPersonData(response?.data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params?.id]);

  const defaultValues = {
    nametitle: personData?.com_nametitle,
    rank: personData?.com_rank,
    fname: personData?.com_fname,
    lname: personData?.com_lname,
    username: personData?.mem_username,
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [personData]);

  const onFinish = async (value) => {
    const data = { mem_id: params?.id, ...value };
    // console.log(data);
    try {
      const response = await requestPrivate.put("/commander", data);
      if (response) {
        alert(`แก้ไขข้อมูลสมาชิกสำเร็จ`);
        navigate(-1);
      }
    } catch (err) {
      alert(`เกิดปัญหาในการแก้ไขข้อมูลสมาชิก : ${err}`);
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
      if (response.data.length > 0 && personData?.mem_username !== username) {
        return true;
      } else if (response.data.length === 0) {
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Reset fields and set default values
  const handleResetFields = () => {
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
        <title>Add Commander - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการผู้ใช้" },
          { title: "รายชื่อผู้การ", path: `/user-management/commander/list` },
          { title: "แก้ไขข้อมูลผู้การ" },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left" }}>
          <h2>แก้ไขข้อมูลผู้การ</h2>
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

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              ยืนยัน
            </Button>
            <Button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>
              ยกเลิก
            </Button>
            <Button onClick={handleResetFields} style={{ marginLeft: 10 }}>
              คืนค่า
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </div>
  );
};
export default UpdateCommander;
