import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Form, Input, Select } from "antd";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import Swal from "sweetalert2";

const CreateGroup = () => {
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [director, setDirector] = useState([]);
  const [group, setGroup] = useState([]);

  const gruopStatus = [
    { value: "0", text: "เปิด" },
    { value: "1", text: "ปิด" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/director`);
        setDirector(response.data);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลผู้กำกับ : ${err}`);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await requestPrivate.get(`/group`).then((response) => {
        setGroup(response.data);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/director`);
        setDirector(response.data);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลผู้กำกับ : ${err}`);
      }
    };

    fetchData();
  }, []);

  const onFinish = async (value) => {
    try {
      const response = await requestPrivate.post("/group", value);
      if (response) {
        Swal.fire({
          title: "เพิ่มสำเร็จ!",
          text: "เพิ่มกลุ่มงานสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        navigate(-1);
      }
    } catch (err) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการเพิ่มกลุ่มงาน",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    return;
  };

  const handleDirectorSelected = (valueSelected) => {
    // if (valueId === valueSelected) return false;
    return group.some((selected) => selected.director_id === valueSelected);
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
        <title>Add Group - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการกลุ่มงาน" },
          { title: "รายชื่อกลุ่มงาน", path: `/group-management/list` },
          { title: "เพิ่มกลุ่มงาน" },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left" }}>
          <h2>เพิ่มกลุ่มงาน</h2>
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
            label="ชื่อกลุ่มงาน"
            name="group_name"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>
                    กรุณากรอกชื่อกลุ่มงาน!
                  </span>
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
            label="ผู้กำกับ"
            name="director_id"
            // rules={[
            //   {
            //     required: true,
            //     message: (
            //       <span style={{ fontSize: "12px" }}>
            //         กรุณาเลือกผู้กำกับ!
            //       </span>
            //     ),
            //   },
            // ]}
            style={{ textAlign: "start" }}
          >
            <Select allowClear={true}>
              {director.map((director, index) => (
                <Select.Option
                  key={index}
                  disabled={handleDirectorSelected(director.director_id)}
                  value={director.director_id}
                >{`${director.director_rank} ${director.director_fname} ${director.director_lname}`}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="สถานะของกลุ่มงาน"
            name="group_status"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>
                    กรุณาเลือกสถานะกลุ่มงาน!
                  </span>
                ),
              },
            ]}
            style={{ textAlign: "start" }}
          >
            <Select>
              {gruopStatus.map((item, index) => (
                <Select.Option
                  key={index}
                  value={item.value}
                >{`${item.text}`}</Select.Option>
              ))}
            </Select>
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

export default CreateGroup;
