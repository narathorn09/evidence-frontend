import React, { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Button,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  InputNumber,
  Divider,
  Space,
  ConfigProvider,
  Modal,
  Upload,
  Tooltip,
  Image,
} from "antd";
import { PlusOutlined, DeleteOutlined, DeleteFilled } from "@ant-design/icons";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import dayjs from "dayjs";
import "dayjs/locale/th"; // Import Thai locale from dayjs
import locale from "antd/es/locale/th_TH";
import { useAuth } from "../../contexts/auth-context";
import { Delete, ExpandMore } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
const { TextArea } = Input;

dayjs.locale("th");
let indexSelector = 0;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateCase = () => {
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [typeEvidence, setTypeEvidence] = useState([]);
  const [invesId, setInvesId] = useState();
  const [form] = Form.useForm();
  const [evidence, setEvidence] = useState([]);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/typeEvidence`);
        setTypeEvidence(response.data);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลประเภทของวัตถุพยาน : ${err}`);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const data = { id: auth?.user?.id, role: auth?.user?.role };
    const fetchData = async () => {
      try {
        const response = await requestPrivate.post(`/id`, data);
        setInvesId(response?.data[0]?.inves_id);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงไอดี : ${err}`);
      }
    };

    fetchData();
  }, [auth?.user]);

  const onFinish = async (value) => {
    const case_save_time = value?.case_save_time?.$d.toString()?.split(" ")[4];
    const dateSaveString = value?.case_save_date?.toString();
    const case_save_date =
      dateSaveString?.split(" ")[1] +
      " " +
      dateSaveString?.split(" ")[2] +
      " " +
      dateSaveString?.split(" ")[3];

    const case_accident_time = value?.case_accident_time?.$d
      .toString()
      ?.split(" ")[4];
    const dateAccidentString = value?.case_accident_date?.toString();
    const case_accident_date =
      dateAccidentString?.split(" ")[1] +
      " " +
      dateAccidentString?.split(" ")[2] +
      " " +
      dateAccidentString?.split(" ")[3];

    const data = {
      ...value,
      inves_id: invesId,
      case_save_date: case_save_date,
      case_save_time: case_save_time,
      case_accident_date: case_accident_date,
      case_accident_time: case_accident_time,
      evidence_list: evidence,
    };
    console.log(data);

    // try {
    //   const response = await requestPrivate.post("/typeEvidence", value);
    //   if (response) {
    //     alert(`เพิ่มประเภทของวัตถุพยานสำเร็จ`);
    //     navigate(-1);
    //   }
    // } catch (err) {
    //   alert(`เกิดปัญหาในการเพิ่มประเภทของวัตถุพยาน : ${err}`);
    // }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    return;
  };

  const [items, setItems] = useState(["jack", "lucy"]);
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${indexSelector++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = useCallback(async (file) => {
    console.log("file", file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  }, []);

  const handleChangePhoto = useCallback(
    async (e, i, index) => {
      setEvidence((prevEvidence) => {
        const newEvidence = [...prevEvidence];
        const updatedEvidence = { ...newEvidence[index] };
        updatedEvidence.evidence_factor.splice(i, 1, {
          ef_photo: e.file || null,
          ef_detail: updatedEvidence.evidence_factor[i]?.ef_detail || "",
        });
        newEvidence[index] = updatedEvidence;
        return newEvidence;
      });

      setCheck((prevCheck) => !prevCheck);
    },
    [evidence]
  );

  const handleDeletePhoto = (i, index) => {
    setEvidence((prevEvidence) => {
      const newEvidence = [...prevEvidence];
      const updatedEvidence = { ...newEvidence[index] };

      let updatedEvidenceFactor = { ...updatedEvidence.evidence_factor[i] };

      updatedEvidenceFactor.ef_photo = null;

      updatedEvidence.evidence_factor[i] = updatedEvidenceFactor;
      newEvidence[index] = updatedEvidence;

      return newEvidence;
    });

    setCheck((prevCheck) => !prevCheck);
  };

  const handleChangeDetail = (e, i, index) => {
    const text = e.target.value;
    setEvidence((prevEvidence) => {
      const newEvidence = [...prevEvidence];
      const updatedEvidence = { ...newEvidence[index] };
      updatedEvidence.evidence_factor.splice(i, 1, {
        ef_photo: updatedEvidence.evidence_factor[i]?.ef_photo || null,
        ef_detail: text,
      });
      newEvidence[index] = updatedEvidence;
      return newEvidence;
    });

    setCheck((prevCheck) => !prevCheck);
  };

  const handleDeleteEvidence = (index) => {
    console.log("index", index);
    setEvidence((prevEvidence) => {
      const newEvidence = [...prevEvidence];
      newEvidence?.splice(index, 1);

      return newEvidence;
    });

    setCheck((prevCheck) => !prevCheck);
  };

  useEffect(() => {
    console.log("evidence", evidence);
  }, [check]);

  const handleFileChange = (e, i, index) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setEvidence((prevEvidence) => {
        const newEvidence = [...prevEvidence];
        const updatedEvidence = { ...newEvidence[index] };
        updatedEvidence.evidence_factor.splice(i, 1, {
          ef_photo: reader.result || null,
          ef_detail: updatedEvidence.evidence_factor[i]?.ef_detail || "",
        });
        newEvidence[index] = updatedEvidence;
        return newEvidence;
      });
    };
    setCheck((prevCheck) => !prevCheck);
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const tailLayout = {
    wrapperCol: {
      offset: 4,
      span: 20,
    },
  };

  return (
    <div>
      <Helmet>
        <title>Add Case - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการคดี" },
          { title: "รายการคดี" },
          { title: "เพิ่มคดี" },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left" }}>
          <h2>เพิ่มคดี</h2>
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
            label="หมายเลข บก."
            name="case_numboko"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>
                    กรุณากรอกหมายเลข บก. !
                  </span>
                ),
              },
              {
                validator: (_, value) => {
                  if (value && value.length > 10) {
                    return Promise.reject({
                      message: (
                        <span style={{ fontSize: "12px" }}>
                          ไม่สามารถกรอกเกิน 10 ตัวอักษรได้
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
            label="ประเภทของคดี"
            name="case_type"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>
                    กรุณาเลือกประเภทของคดี !
                  </span>
                ),
              },
            ]}
            style={{ textAlign: "start" }}
          >
            <Select
              style={{
                width: 300,
              }}
              placeholder="custom dropdown render"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider
                    style={{
                      margin: "8px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <Input
                      placeholder="Please enter item"
                      ref={inputRef}
                      value={name}
                      onChange={onNameChange}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={addItem}
                    >
                      Add item
                    </Button>
                  </Space>
                </>
              )}
              options={items.map((item) => ({
                label: item,
                value: item,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="วันและเวลาที่ลงบันทึกคดี"
            style={{
              marginBottom: 0,
            }}
            required={true}
          >
            <Form.Item
              name="case_save_date"
              // labelCol={{
              //   span: 4,
              // }}
              // wrapperCol={{
              //   span: 8,
              // }}
              rules={[
                {
                  required: true,
                  message: (
                    <span style={{ fontSize: "12px" }}>
                      กรุณาเลือกวันที่ลงบันทึกคดี !
                    </span>
                  ),
                },
              ]}
              style={{
                textAlign: "start",
                display: "inline-block",
              }}
            >
              {/* <ConfigProvider locale={locale}> */}
              <DatePicker />
              {/* </ConfigProvider> */}
            </Form.Item>

            <Form.Item
              name="case_save_time"
              // labelCol={{
              //   span: 0,
              // }}
              // wrapperCol={{
              //   span: 8,
              // }}
              rules={[
                {
                  required: true,
                  message: (
                    <span style={{ fontSize: "12px" }}>
                      กรุณาเลือกเวลาที่ลงบันทึกคดี !
                    </span>
                  ),
                },
              ]}
              style={{
                textAlign: "start",
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0 8px",
              }}
            >
              <TimePicker />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="วันและเวลาที่เกิดเหตุ"
            style={{
              marginBottom: 0,
            }}
            required={true}
          >
            <Form.Item
              name="case_accident_date"
              rules={[
                {
                  required: true,
                  message: (
                    <span style={{ fontSize: "12px" }}>
                      กรุณาเลือกวันที่เกิดเหตุ !
                    </span>
                  ),
                },
              ]}
              style={{
                textAlign: "start",
                display: "inline-block",
              }}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              name="case_accident_time"
              rules={[
                {
                  required: true,
                  message: (
                    <span style={{ fontSize: "12px" }}>
                      กรุณาเลือกเวลาที่เกิดเหตุ !
                    </span>
                  ),
                },
              ]}
              style={{
                textAlign: "start",
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0 8px",
              }}
            >
              <TimePicker />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="สถานที่ที่เกิดเหตุ"
            name="case_location"
            rules={[
              {
                required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>
                    กรุณากรอกสถานที่ที่เกิดเหตุ !
                  </span>
                ),
              },
              {
                validator: (_, value) => {
                  if (value && value.length > 150) {
                    return Promise.reject({
                      message: (
                        <span style={{ fontSize: "12px" }}>
                          ไม่สามารถกรอกเกิน 150 ตัวอักษรได้
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
            <TextArea />
          </Form.Item>

          {evidence.map((item, index) => {
            let isLastIndex = index === evidence?.length - 1;
            if (evidence.length === 0) isLastIndex = true;
            return (
              <Box key={index}>
                <Divider orientation="left" orientationMargin="0">
                  <Box sx={{ display: "flex", align: "center" }}>
                    <Box sx={{ mr: 2 }}> วัตถุพยานที่ {index + 1}</Box>

                    <Tooltip title="ลบ">
                      <Button
                        shape="circle"
                        icon={<Delete />}
                        onClick={() => handleDeleteEvidence(index)}
                      />
                    </Tooltip>
                    <Tooltip title="ดูเพิ่มเติม">
                      <Button
                        shape="circle"
                        icon={<ExpandMore />}
                        // onClick={() => handleDeleteEvidence(index)}
                      />
                    </Tooltip>
                  </Box>
                </Divider>

                <Form.Item
                  label="ประเภทของวัตถุพยาน"
                  style={{
                    marginBottom: 0,
                  }}
                  required={true}
                >
                  <Form.Item
                    // name={["type_e_id"]}

                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "12px" }}>
                            กรุณาเลือกประเภทของวัตถุพยาน !
                          </span>
                        ),
                      },
                    ]}
                    style={{
                      textAlign: "start",
                      display: "inline-block",
                      width: "calc(30% - 8px)",
                    }}
                  >
                    <Select
                      value={evidence[index]?.type_e_id}
                      onChange={(i, obj) => {
                        console.log("obj", obj);
                        let res = evidence.slice();
                        let re = {
                          ...evidence[index],
                          type_e_id: obj.value,
                          type_e_name: obj.children,
                        };
                        res[index] = re;
                        setEvidence(res);
                      }}
                    >
                      {typeEvidence.map((item, index) => (
                        <Select.Option
                          key={index}
                          value={item.type_e_id}
                        >{`${item.type_e_name}`}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="จำนวน"
                    // name="evidence_amount"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: "12px" }}>
                            กรุณากรอกจำนวน !
                          </span>
                        ),
                      },
                    ]}
                    style={{
                      textAlign: "start",
                      display: "inline-block",
                      width: "calc(50% - 8px)",
                      margin: "0 18px",
                    }}
                  >
                    <InputNumber
                      value={evidence[index]?.evidence_amount}
                      // defaultValue={1}
                      min={1}
                      onChange={(value) => {
                        let res = evidence.slice();
                        let re = {
                          ...evidence[index],
                          evidence_amount: value,
                        };
                        res[index] = re;
                        setEvidence(res);
                      }}
                    />
                  </Form.Item>
                  {Array.from(
                    { length: evidence[index]?.evidence_amount },
                    (item, i) => {
                      return (
                        <div key={i}>
                          <Divider orientation="left" orientationMargin="0">
                            <Box sx={{ display: "flex", align: "center" }}>
                              <Box sx={{ mr: 2 }}>
                                {evidence[index]?.type_e_name} {i + 1}
                              </Box>
                              <Tooltip title="ลบ">
                                <Button
                                  shape="circle"
                                  icon={<Delete />}
                                  // onClick={() => handleDeleteEvidence(index)}
                                />
                              </Tooltip>
                            </Box>
                          </Divider>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              mb: "32px",
                            }}
                          >
                            <label
                              htmlFor={`file-input-${i}-${index}`}
                              style={{
                                display: evidence[index]?.evidence_factor[i]
                                  ?.ef_photo
                                  ? "none"
                                  : "flex",
                                position: "relative",
                              }}
                            >
                              <input
                                id={`file-input-${i}-${index}`}
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={(e) => handleFileChange(e, i, index)}
                                style={{ display: "none" }}
                              />
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: "100px",
                                  height: "100px",

                                  border: "2px dotted rgba(0, 0, 0, 0.4)",
                                  // objectFit: "contain",
                                  // margin: "0",
                                  // padding: "8px",
                                  borderRadius: "8px",
                                  ":hover": {
                                    cursor: "pointer",
                                    backgroundColor:
                                      "var(--color--main-light1)",
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    wordWrap: "all",
                                    textAlign: "center",
                                    opacity: 0.4,
                                  }}
                                >
                                  คลิกเพื่อเลือกรูปภาพ
                                </Box>
                              </Box>
                            </label>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                marginRight: "8px",
                              }}
                            >
                              {evidence[index]?.evidence_factor[i]
                                ?.ef_photo && (
                                <>
                                  <Box
                                    sx={{
                                      width: "100px",
                                      height: "100px",
                                    }}
                                  >
                                    <Image
                                      width={"100%"}
                                      height={"100%"}
                                      style={{
                                        border: "1px solid rgba(0, 0, 0, 0.1)",
                                        objectFit: "contain",
                                        margin: "0",
                                        padding: "8px",
                                        borderRadius: "8px",
                                      }}
                                      src={
                                        evidence[index]?.evidence_factor[i]
                                          ?.ef_photo
                                      }
                                    />
                                  </Box>
                                  {/* <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      // border: "1px solid rgba(0, 0, 0, 0.1)",
                                      objectFit: "contain",
                                      margin: "0",
                                      padding: "8px",
                                      // borderRadius: "8px",
                                    }}
                                  > */}

                                  <Button
                                    // shape="circle"
                                    // icon={<DeleteOutlined />}
                                    onClick={() => {
                                      handleDeletePhoto(i, index);
                                    }}
                                    style={{ marginTop: "8px" }}
                                  >
                                    ลบรูปภาพ
                                  </Button>

                                  {/* </Box> */}
                                </>
                              )}
                            </Box>

                            <TextArea
                              placeholder="รายละเอียดของวัตถุพยาน"
                              value={
                                evidence[index]?.evidence_factor[i]?.ef_detail
                              }
                              onChange={(e) => {
                                handleChangeDetail(e, i, index);
                              }}
                            />
                          </Box>

                          {/* <Upload
                            listType="picture-card"
                            showUploadList={true}
                            maxCount={1}
                            onPreview={handlePreview}
                            beforeUpload={() => false}
                            isImageUrl={() => true}
                            onChange={(file, fileList) => {
                              handleChangePhoto(file, i, index);
                            }}
                            onRemove={() => handleDeletePhoto(i, index)}
                          >
                            {uploadButton}
                          </Upload> */}
                        </div>
                      );
                    }
                  )}
                </Form.Item>
              </Box>
            );
          })}

          <Form.Item
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 20,
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                let res = evidence.slice();
                res = {
                  type_e_id: null,
                  evidence_amount: null,
                  evidence_factor: [],
                };
                setEvidence([...evidence, res]);
              }}
            >
              เพิ่มวัตถุพยาน
            </Button>
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
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
};

export default CreateCase;
