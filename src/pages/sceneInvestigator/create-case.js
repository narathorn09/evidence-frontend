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
  Tooltip,
  Image,
} from "antd";
import { PlusOutlined, DeleteOutlined, DeleteFilled } from "@ant-design/icons";
import { Box, Grid, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import dayjs from "dayjs";
import "dayjs/locale/th";
import locale from "antd/es/locale/th_TH";

const { TextArea } = Input;
dayjs.locale("th");
let indexSelector = 0;

const CreateCase = () => {
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [typeEvidence, setTypeEvidence] = useState([]);
  const [invesId, setInvesId] = useState();
  const [form] = Form.useForm();

  const [evidence, setEvidence] = useState([]);
  const [isReload, setIsReload] = useState(false);

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
  }, [isReload]);

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

    try {
      const responseURLs = await requestPrivate.post("/uploads", {
        evidence_list: evidence,
      });

      if (responseURLs.data.result.length > 0) {
        const data = {
          ...value,
          inves_id: invesId,
          case_save_date: case_save_date,
          case_save_time: case_save_time,
          case_accident_date: case_accident_date,
          case_accident_time: case_accident_time,
          evidence_list: [...responseURLs.data.result],
        };

        console.log("data", data);
      } else {
        alert("No evidence URLs were returned.");
      }
    } catch (err) {
      alert(`เกิดปัญหาในการเพิ่มคดี : ${err}`);
    }
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
    if(!name) return;
    setItems([...items, name]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleDeleteEvidence = (index) => {
    setEvidence((prevEvidence) => {
      const newEvidence = [...prevEvidence];
      newEvidence?.splice(index, 1);
      return newEvidence;
    });
  };

  const handleDeleteEvidenceFactor = (i, index) => {
    setEvidence((prevEvidence) => {
      const newEvidence = [...prevEvidence];
      newEvidence[index].evidence_factor.splice(i, 1);
      newEvidence[index] = {
        ...newEvidence[index],
        evidence_amount: newEvidence[index].evidence_amount - 1,
      };
      return newEvidence;
    });
  };

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

    if (file) {
      reader.readAsDataURL(file);
    }
  };

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
  };

  const handleTypeEvidenceSelected = (valueId, valueSelected) => {
    if (valueId === valueSelected) return false;
    return evidence.some((selected) => selected.type_e_id === valueSelected);
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
              placeholder="เลือกประเภทของคดี"
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
                      placeholder="อื่นๆ"
                      ref={inputRef}
                      value={name}
                      onChange={onNameChange}
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={addItem}
                    >
                      เพิ่มประเภทคดี
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
            const typeEvidenceValue =
              evidence[index].type_e_id !== undefined &&
              evidence[index].type_e_id !== ""
                ? evidence[index].type_e_id
                : item.type_e_id;
            let isLastIndex = index === evidence?.length - 1;
            if (evidence.length === 0) isLastIndex = true;
            return (
              <Box key={index}>
                <Divider orientation="left" orientationMargin="0">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Chip
                      sx={{ mr: "10px" }}
                      label={`วัตถุพยานประเภทที่ ${index + 1} ${
                        evidence[index]?.type_e_name
                          ? evidence[index]?.type_e_name
                          : ""
                      }`}
                    />

                    <Tooltip title="ลบ" style={{ marginLeft: "10px" }}>
                      <Button
                        shape="circle"
                        icon={<Delete />}
                        onClick={() => handleDeleteEvidence(index)}
                      />
                    </Tooltip>

                    <Button
                      shape="circle"
                      icon={
                        evidence[index].expanded ? (
                          <ExpandMore />
                        ) : (
                          <ExpandLess />
                        )
                      }
                      style={{
                        marginLeft: "8px",
                        transition: "transform 0.3s ease",
                        transform: evidence[index].expanded
                          ? "rotate(180deg)"
                          : "rotate(-180deg)",
                      }}
                      onClick={() => {
                        let res = evidence.slice();
                        let rs = {
                          ...evidence[index],
                          expanded: !res[index]?.expanded,
                        };
                        res[index] = rs;
                        setEvidence(res);
                      }}
                    />
                  </Box>
                </Divider>

                <Form.Item
                  label="ประเภทของวัตถุพยาน"
                  style={{
                    overflow: "hidden",

                    maxHeight: evidence[index].expanded ? "0" : "100%", // Adjust the height value as needed
                    marginBottom: 0,
                    // display: evidence[index].expanded ? "none" : "flex",
                    transition: "max-height 0.3s ease",
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
                      onClick={() => setIsReload((row) => !row)}
                      onChange={(i, obj) => {
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
                          disabled={handleTypeEvidenceSelected(
                            typeEvidenceValue,
                            item.type_e_id
                          )}
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
                      controls={true}
                      min={1}
                      onStep={(value, info) => {
                        let evs = evidence.slice();

                        if (info.type === "up") {
                          let evs = evidence.slice();
                          evs[index].evidence_factor = [
                            ...evs[index].evidence_factor,
                            { ef_photo: null, ef_detail: "" },
                          ];
                        } else if (info.type === "down") {
                          let evs = evidence.slice();
                          evs[index].evidence_factor.splice(-1, 1);
                        }
                        let re = {
                          ...evs[index],
                          evidence_amount: value,
                        };
                        evs[index] = re;

                        setEvidence(evs);
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
                              <Chip
                                sx={{ mr: "10px" }}
                                label={`${evidence[index]?.type_e_name} ${
                                  i + 1
                                }`}
                              />

                              <Tooltip title="ลบ">
                                <Button
                                  shape="circle"
                                  icon={<Delete />}
                                  onClick={() =>
                                    handleDeleteEvidenceFactor(i, index)
                                  }
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

                                  <Button
                                    onClick={() => {
                                      handleDeletePhoto(i, index);
                                    }}
                                    style={{ marginTop: "8px" }}
                                  >
                                    ลบรูปภาพ
                                  </Button>
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
                  expanded: false,
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
    </div>
  );
};

export default CreateCase;
