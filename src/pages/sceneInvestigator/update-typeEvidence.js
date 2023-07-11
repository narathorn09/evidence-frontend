import React, { useEffect ,useState} from "react";
import { Helmet } from "react-helmet";
import { Button, Form, Input } from "antd";
import { Box, Grid } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";

const UpdateTypeEvidence = () => {
  const params = useParams();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const [form] = Form.useForm();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/typeEvidenceById/${params?.id}`);
        setItem(response?.data[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [params?.id]);

  const defaultValues = {
    type_e_name: item?.type_e_name,
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [item]);

  const onFinish = async (value) => {
    const data = {type_e_id: params?.id, ...value}
    // console.log(data);
    try {
      const response = await requestPrivate.put("/typeEvidence", data);
      if (response) {
        alert(`แก้ไขประเภทของวัตถุพยานสำเร็จ`);
        navigate(-1);
      }
    } catch (err) {
      alert(`เกิดปัญหาในการแก้ไขประเภทของวัตถุพยาน : ${err}`);
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
        <title>Add Type Evidence - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการประเภทของวัตถุพยาน" },
          { title: "รายการประเภทของวัตถุพยาน", path: `/inves/manage-type-evidence/list` },
          { title: "แก้ไขประเภทของวัตถุพยาน" },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left" }}>
          <h2>แก้ไขประเภทของวัตถุพยาน</h2>
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
            label="ปรเภทของวัตถุพยาน"
            name="type_e_name"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>กรุณากรอกปรเภทของวัตถุพยาน!</span>
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
              onClick={handleResetFields}
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

export default UpdateTypeEvidence;
