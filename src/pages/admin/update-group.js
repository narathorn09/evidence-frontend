import React, { useEffect ,useState} from "react";
import { Helmet } from "react-helmet";
import { Button, Form, Input, Select } from "antd";
import { Box, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";

const UpdateGroup = () => {
  const params = useParams();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [groupData, setGroupData] = useState({});
  const [director, setDirector] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/groupById/${params?.id}`);
        setGroupData(response?.data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params?.id]);

  const defaultValues = {
    group_name: groupData?.group_name,
    director_id: groupData?.director_id
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [groupData]);

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
    const data = {group_id: params?.id, ...value}
    console.log(data);
    try {
      const response = await requestPrivate.put("/group", data);
      if (response) {
        alert(`แก้ไขข้อมูลกลุ่มงานสำเร็จ`);
        navigate(-1);
      }
    } catch (err) {
      alert(`เกิดปัญหาในการแก้ไขข้อมูลกลุ่มงาน : ${err}`);
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    return;
  };

  const handleResetFields = () => {
    form.setFieldsValue(defaultValues);
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
        <title>Edit Group - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการกลุ่มงาน" },
          { title: "รายชื่อกลุ่มงาน", path: `/group-management/list` },
          { title: "แก้ไขข้อมูลกลุ่มงาน" },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left" }}>
          <h2>แก้ไขข้อมูลกลุ่มงาน</h2>
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
            <Select>
              {director.map((director, index) => (
                <Select.Option
                  key={index}
                  value={director.director_id}
                >{`${director.director_rank} ${director.director_fname} ${director.director_lname}`}</Select.Option>
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
              onClick={handleResetFields}
              style={{ marginLeft: 10 }}
            >
              คืนค่า
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </div>
  );
};

export default UpdateGroup;