import React from "react";
import { Helmet } from "react-helmet";
import { Button, Form, Input } from "antd";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import Swal from "sweetalert2";

const CreateTypeEvidence = () => {
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (value) => {
    try {
      const response = await requestPrivate.post("/typeEvidence", value);
      if (response) {
        Swal.fire({
          title: "เพิ่มสำเร็จ!",
          text: "เพิ่มประเภทของวัตถุพยานสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        navigate(-1);
      }
    } catch (err) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการเพิ่มประเภทของวัตถุพยาน",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    return;
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
        <title>Add Type Evidence - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการประเภทของวัตถุพยาน" },
          {
            title: "รายการประเภทของวัตถุพยาน",
            path: `/inves/manage-type-evidence/list`,
          },
          { title: "เพิ่มประเภทของวัตถุพยาน" },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left" }}>
          <h2>เพิ่มประเภทของวัตถุพยาน</h2>
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
            label="ปรเภทของวัตถุพยาน"
            name="type_e_name"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>
                    กรุณากรอกปรเภทของวัตถุพยาน!
                  </span>
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
            ]}
            style={{ textAlign: "start" }}
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
            <Button
              onClick={() => form.resetFields()}
              style={{ marginLeft: 10 }}
            >
              ล้างค่า
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </div>
  );
};

export default CreateTypeEvidence;
