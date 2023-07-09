import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Form, Input, Typography, Select, Modal, Tooltip } from "antd";
import { Box, Grid, IconButton, Card } from "@mui/material";
import { Edit, AccountCircle, Key } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hook/use-axios-private";

const Profile = () => {
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [me, setMe] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [group, setGroup] = useState({});

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
    groupid: me?.groupid,
    groupName: group?.group_name,
    groupNameDirector:
      group?.director_rank +
      " " +
      group?.director_fname +
      " " +
      group?.director_lname,
  };

  useEffect(() => {
    if (me?.groupid) {
      const fetchData = async () => {
        try {
          const response = await requestPrivate.get(
            `/groupById/${me?.groupid}`
          );
          setGroup(response.data[0]);
        } catch (err) {
          alert(`เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มงาน : ${err}`);
        }
      };
      fetchData();
    }
  }, [me]);

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [me, group]);

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

  const tailLayoutpass = {
    wrapperCol: {
      offset: 0,
      span: 24,
    },
  };

  const [formPass] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handlePassFinish = async (value) => {
    const data = { id: me?.id, ...value };
    try {
      const response = await requestPrivate.put("/password", data);
      if (response) {
        if(response.data === false) return alert(`รหัสผ่านไม่ถูกต้อง !`);
        alert(`เปลี่ยนรหัสผ่านสำเร็จ !`);
        setIsModalOpen(false);
        formPass.resetFields();
      }
    } catch (err) {
      alert(`เกิดปัญหาในการเปลี่ยนรหัสผ่าน : ${err}`);
    }
  };

  const handlePassFailed = (fail) => {
    // console.log("fail", fail);
    // setIsModalOpen(false);
  };

  const handlePassCancel = () => {
    formPass.resetFields();
    setIsModalOpen(false);
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
                <AccountCircle
                  sx={{ fontSize: "40px", color: "var(--color--main)", mr: 2 }}
                />
                <h3 style={{ color: "var(--color--main)" }}>
                  {me?.role === "0" && "ผู้ดูแลระบบ"}
                  {me?.role === "1" && "ผู้การ"}
                  {me?.role === "2" && "พนักงานตรวจสถานที่เกิดเหตุ"}
                  {me?.role === "3" && "ผู้กำกับ"}
                  {me?.role === "4" && "ผู้ชำนาญการ"}
                </h3>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                sx={{ textAlign: "left", mb: 2 }}
              >
                <Box
                  sx={{
                    backgroundColor: "var(--color--main-light9)",
                    width: "fit-content",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    borderRadius: "8px",
                    paddingTop: "3px",
                    paddingBottom: "3px",
                  }}
                >
                  <body style={{ color: "var(--color--white)" }}>
                    {!isEdit ? "ข้อมูลส่วนตัว" : "แก้ไขข้อมูลส่วนตัว"}
                  </body>
                </Box>
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
                <Tooltip title="แก้ไขข้อมูล">
                  <Button
                    style={{ marginRight: "16px" }}
                    onClick={() => setIsEdit(true)}
                    shape="circle"
                    icon={<Edit />}
                  />
                </Tooltip>
              )}
              <Tooltip title="เปลี่ยนรหัสผ่าน">
                <Button onClick={showModal} shape="circle" icon={<Key />} />
              </Tooltip>
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
            {me?.nametitle && (
              <Form.Item
                label={
                  <span style={{ fontWeight: isEdit ? "normal" : "bold" }}>
                    คำนำหน้าชื่อ
                  </span>
                }
                name="nametitle"
                rules={[
                  {
                    required: isEdit,
                    message: (
                      <span style={{ fontSize: "12px" }}>
                        กรุณาเลือกคำนำหน้าชื่อ!
                      </span>
                    ),
                  },
                ]}
                style={{ textAlign: "start" }}
              >
                {!isEdit ? (
                  <Typography>{me?.nametitle}</Typography>
                ) : (
                  <Select>
                    <Select.Option value="นาย">นาย</Select.Option>
                    <Select.Option value="นาง">นาง</Select.Option>
                    <Select.Option value="นางสาว">นางสาว</Select.Option>
                  </Select>
                )}
              </Form.Item>
            )}

            {me?.rank && (
              <Form.Item
                label={
                  <span style={{ fontWeight: isEdit ? "normal" : "bold" }}>
                    ยศ
                  </span>
                }
                name="rank"
                style={{ textAlign: "start" }}
              >
                {!isEdit ? (
                  <Typography>{me?.rank}</Typography>
                ) : (
                  <Input disabled={true} />
                )}
              </Form.Item>
            )}

            {!isEdit && (
              <Form.Item
                label={
                  <span style={{ fontWeight: isEdit ? "normal" : "bold" }}>
                    ชื่อ - นามสกุล
                  </span>
                }
                style={{ textAlign: "start" }}
              >
                {!isEdit ? (
                  <Typography>{me?.fname + " " + me?.lname}</Typography>
                ) : (
                  <Input />
                )}
              </Form.Item>
            )}

            {isEdit && (
              <>
                {" "}
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
                        <span style={{ fontSize: "12px" }}>
                          กรุณากรอกชื่อจริง!
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
                        <span style={{ fontSize: "12px" }}>
                          กรุณากรอกนามสกุล!
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
                >
                  {!isEdit ? <Typography>{me?.lname}</Typography> : <Input />}
                </Form.Item>
              </>
            )}
            {me?.groupid && (
              <Form.Item
                label={
                  <span style={{ fontWeight: isEdit ? "normal" : "bold" }}>
                    กลุ่มงาน
                  </span>
                }
                name="groupName"
                style={{ textAlign: "start" }}
              >
                {!isEdit ? (
                  <Typography>{group?.group_name}</Typography>
                ) : (
                  <Input disabled={true} />
                )}
              </Form.Item>
            )}

            {me?.groupid && (
              <Form.Item
                label={
                  <span style={{ fontWeight: isEdit ? "normal" : "bold" }}>
                    ผู้กำกับประจำกลุ่มงาน
                  </span>
                }
                name="groupNameDirector"
                style={{ textAlign: "start" }}
              >
                {!isEdit ? (
                  <Typography>
                    {group?.director_rank +
                      " " +
                      group?.director_fname +
                      " " +
                      group?.director_lname}
                  </Typography>
                ) : (
                  <Input disabled={true} />
                )}
              </Form.Item>
            )}

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

      <Modal
        title={
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            <Button
              shape="circle"
              icon={<Key />}
              style={{ marginRight: "16px" }}
            />
            เปลี่ยนรหัสผ่าน
          </Box>
        }
        open={isModalOpen}
        // onOk={handlePassOk}
        onCancel={handlePassCancel}
        centered={true}
        okText="ยืนยัน"
        cancelText="ยกเลิก"
        footer={null}
      >
        <Form
          form={formPass}
          size="middle "
          name="pass"
          labelCol={{
            span: 8,
          }}
          labelAlign="left"
          wrapperCol={{
            span: 16,
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
          onFinish={handlePassFinish}
          onFinishFailed={handlePassFailed}
          autoComplete="off"
        >
          <Form.Item
            label="รหัสผ่านปัจจุบัน"
            name="password"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>
                    กรุณากรอกรหัสผ่านปัจจุบัน!
                  </span>
                ),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="รหัสผ่านใหม่"
            name="new_password"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>
                    กรุณากรอกรหัสผ่านใหม่!
                  </span>
                ),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="ยืนยันรหัสผ่านใหม่"
            name="confirm"
            dependencies={["new_password"]}
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
                  if (!value || getFieldValue("new_password") === value) {
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
          <Form.Item
            {...tailLayoutpass}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "0px",
            }}
          >
            <Button onClick={handlePassCancel} style={{ marginRight: 10 }}>
              ยกเลิก
            </Button>
            <Button type="primary" htmlType="submit">
              ยืนยัน
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
