import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Form, Input, Typography } from "antd";
import { Box, Grid, IconButton, Card } from "@mui/material";
import { Edit, AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hook/use-axios-private";

const Profile = () => {
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [me, setMe] = useState();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getMe = async () => {
      try {
        const response = await requestPrivate.get("/me", {
          signal: controller.signal,
        });
        isMounted && setMe(response?.data);
      } catch (error) {
        console.error(error);
      }
    };
    getMe();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const defaultValues = {
    nametitle: me?.nametitle,
    rank: me?.rank,
    fname: me?.fname,
    lname: me?.lname,
    username: me?.username,
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [me]);

  const handleResetFields = () => {
    form.setFieldsValue(defaultValues);
  };

  const handleCancel = () => {
    setIsEdit(false);
    form.setFieldsValue(defaultValues);
  };

  const onFinish = async (value) => {
    const data = { id: me?.id, role: me?.role, ...value };
    console.log(data);
    try {
      const response = await requestPrivate.put("/profile", data);
      if (response) {
        window.location.reload();
        alert(`แก้ไขข้อมูลส่วนตัวสำเร็จ`);
        setIsEdit(false);
      }
    } catch (err) {
      alert(`เกิดปัญหาในการแก้ไขข้อมูลส่วน : ${err}`);
      setIsEdit(false);
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
      if (response.data.length > 0 && me?.username !== username) {
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
        <title>Profile - Forensic Science</title>
      </Helmet>
      <Box sx={{ width: "100%", height: "100%" }}>
        <Box
          sx={{
            borderRadius: "8px",
            // bgcolor: "var(--color--white)",
            padding: 4,
            // boxShadow: "2px 2px 2px rgba(0,0,0,0.2)",
          }}
          component={Card}
        >
          <Grid container direction="row">
            <Grid container direction="row" item xs={11} sm={11} md={11}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                }}
              >
                <AccountCircle sx={{fontSize: "40px", color: "var(--color--main)"}}/>
              </Grid>
              <Grid item xs={12} sm={12} md={12} sx={{ textAlign: "left" }}>
                <h2>{!isEdit ? "ข้อมูลส่วนตัว" : "แก้ไขข้อมูลส่วนตัว"}</h2>
              </Grid>
            </Grid>
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {!isEdit && (
                <IconButton
                  onClick={() => setIsEdit(true)}
                  sx={{ ":hover": { color: "var(--color--main-light9)" } }}
                >
                  <Edit />
                </IconButton>
              )}
            </Grid>
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
              label={
                <span style={{ fontWeight: isEdit ? "normal" : "bold" }}>
                  ชื่อจริง
                </span>
              }
              name="fname"
              rules={[
                {
                  required: isEdit,
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
              {!isEdit ? <Typography>{me?.fname}</Typography> : <Input />}
            </Form.Item>

            <Form.Item
              label={
                <span style={{ fontWeight: isEdit ? "normal" : "bold" }}>
                  นามสกุล
                </span>
              }
              name="lname"
              rules={[
                {
                  required: isEdit,
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
              {!isEdit ? <Typography>{me?.lname}</Typography> : <Input />}
            </Form.Item>

            <Form.Item
              label={
                <span style={{ fontWeight: isEdit ? "normal" : "bold" }}>
                  ชื่อผู้ใช้
                </span>
              }
              name="username"
              initialValue={""}
              rules={[
                {
                  required: isEdit,
                  message: (
                    <span style={{ fontSize: "12px" }}>
                      กรุณากรอกชื่อผู้ใช้!
                    </span>
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
              {!isEdit ? <Typography>{me?.username}</Typography> : <Input />}
            </Form.Item>

            {isEdit && (
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  ยืนยัน
                </Button>
                <Button onClick={handleCancel} style={{ marginLeft: 10 }}>
                  ยกเลิก
                </Button>
                <Button onClick={handleResetFields} style={{ marginLeft: 10 }}>
                  คืนค่า
                </Button>
              </Form.Item>
            )}
          </Form>
        </Box>
      </Box>
    </div>
  );
};

export default Profile;
