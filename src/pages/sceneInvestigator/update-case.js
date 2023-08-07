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
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Box, Grid, Chip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { Delete, ExpandMore, ExpandLess } from "@mui/icons-material";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import "dayjs/locale/th";
import locale from "antd/es/locale/th_TH";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
// import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Swal from "sweetalert2";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(utc);
// dayjs.extend(timezone);

// dayjs.tz.setDefault("Asia/Bangkok");
dayjs.locale("th");

const { TextArea } = Input;
let indexSelector = 0;

const UpdateCase = () => {
  const params = useParams();
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [typeEvidence, setTypeEvidence] = useState([]);
  const [invesId, setInvesId] = useState();
  const [form] = Form.useForm();
  const [evidence, setEvidence] = useState([]);
  const [isReload, setIsReload] = useState(false);
  const [group, setGroup] = useState([]);
  const [caseData, setCaseData] = useState({});
  const [dateSave, setDateSave] = useState("");
  const [dateAccident, setdateAccident] = useState("");
  const [timeSave, setTimeSave] = useState("");
  const [timeAccident, setTimeAccident] = useState("");
  const [efDelete, setEfDelete] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(
          `/caseByCaseId/${params?.caseId}`
        );
        setCaseData(response.data[0]);
        setEvidence(response.data[0].evidence_list);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลคดี : ${err}`);
      }
    };
    fetchData();
  }, [params?.caseId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/group`);
        setGroup(response.data);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มงาน : ${err}`);
      }
    };
    fetchData();
  }, []);

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

  const defaultValues = {
    case_numboko: caseData?.case_numboko,
    case_type: caseData?.case_type,
    case_save_date: dayjs(caseData?.case_save_date).format("YYYY-MM-DD"),
    case_save_time: caseData?.case_save_time,
    case_accident_date: dayjs(caseData?.case_accident_date).format(
      "YYYY-MM-DD"
    ),
    case_accident_time: caseData?.case_accident_time,
    case_location: caseData?.case_location,
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [caseData]);

  useEffect(() => {
    setDateSave(caseData.case_save_date);
    setdateAccident(caseData.case_accident_date);
    setTimeSave(caseData?.case_save_time);
    setTimeAccident(caseData?.case_accident_time);
  }, [
    caseData.case_save_date,
    caseData.case_accident_date,
    caseData?.case_save_time,
    caseData?.case_accident_time,
  ]);

  const onFinish = async (value) => {
    const data = {
      ...value,
      inves_id: invesId,
      evidence_list: evidence,
    };

    const defElements = data.evidence_list.filter((evidence) =>
      caseData.evidence_list.some(
        (item) => item.evidence_id === evidence.evidence_id
      )
    );

    const newElements = data.evidence_list.filter(
      (evidence) =>
        !caseData.evidence_list.some(
          (item) => item.evidence_id === evidence.evidence_id
        )
    );

    const missingElements = caseData.evidence_list.filter(
      (evidence) =>
        !data.evidence_list.some(
          (item) => item.evidence_id === evidence.evidence_id
        )
    );

    try {
      if (evidence.length > 0) {
        const responseAfterUpdateImg = await requestPrivate.put(
          "/update/uploads",
          {
            defElements: defElements,
            missingElements: missingElements,
            newElements: newElements,
            efDelete: efDelete,
          }
        );

        if (responseAfterUpdateImg && responseAfterUpdateImg.status === 200) {
          const allData = {
            ...value,
            case_id: caseData.case_id,
            inves_id: invesId,
            defEvidence: responseAfterUpdateImg.data.defEvidence,
            removeEvidenceFactorInDef:
              responseAfterUpdateImg.data.removeEvidenceFactorInDef,
            newEvidence: responseAfterUpdateImg.data.newEvidence,
            removeEvidence: responseAfterUpdateImg.data.removeEvidence,
          };
          console.log(allData);

          const responseCase = await requestPrivate.put("/case", allData);
          if (responseCase.status === 200) {
            Swal.fire({
              title: "แก้ไขสำเร็จ!",
              text: "แก้ไขข้อมูลคดีสำเร็จ",
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            navigate(-1);
          }
        } else {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "เกิดข้อผิดพลาดในการแก้ไขแก้ไขข้อมูลคดี",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      } else {
        const data = {
          ...value,
          inves_id: invesId,
          evidence_list: [],
        };

        console.log("data", data);
      }
    } catch (err) {
      alert(`เกิดปัญหาในการเพิ่มคดี : ${err}`);
    }
  };

  const onFinishFailed = (errorInfo) => {
    // console.log("Failed:", errorInfo);
    return;
  };

  const [items, setItems] = useState(["ยาเสพติด", "ลักทรัพย์"]);
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!name) return;
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
      if (newEvidence[index].evidence_factor[i]?.ef_id !== undefined)
        setEfDelete((prev) => [
          ...prev,
          {
            ...newEvidence[index].evidence_factor[i],
          },
        ]);
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
          ...updatedEvidence.evidence_factor[i],
          ef_photo_remove:
            updatedEvidence.evidence_factor[i]?.ef_photo ||
            updatedEvidence.evidence_factor[i]?.ef_photo_remove,
          ef_photo: reader.result || null,
          ef_detail: updatedEvidence.evidence_factor[i]?.ef_detail || "",
          // assignGroupId:
          //   updatedEvidence.evidence_factor[i]?.assignGroupId || null,
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
      updatedEvidenceFactor.ef_photo_remove =
        updatedEvidenceFactor.ef_photo?.split(";")[1]?.split(",")[0] ===
        "base64"
          ? null
          : updatedEvidenceFactor.ef_photo;
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
        ...updatedEvidence.evidence_factor[i],
        // ef_photo: updatedEvidence.evidence_factor[i]?.ef_photo || null,
        ef_detail: text,
        // assignGroupId:
        //   updatedEvidence.evidence_factor[i]?.assignGroupId || null,
      });
      newEvidence[index] = updatedEvidence;
      return newEvidence;
    });
  };

  const handleTypeEvidenceSelected = (valueId, valueSelected) => {
    if (valueId === valueSelected) return false;
    return evidence.some((selected) => selected.type_e_id === valueSelected);
  };

  const handleDateChange = (dateDayJs, dateString, name) => {
    // console.log("dateString", dateString);
    if (name === "case_save_date") {
      const formattedDate = dayjs(dateString, "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      form.setFieldValue(`${name}`, formattedDate);
      setDateSave(formattedDate);
    } else if (name === "case_accident_date") {
      const formattedDate = dayjs(dateString, "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      form.setFieldValue(`${name}`, formattedDate);
      setdateAccident(formattedDate);
    } else if (name === "case_save_time") {
      form.setFieldValue(`${name}`, dateString);
      setTimeSave(dateString);
    } else if (name === "case_accident_time") {
      form.setFieldValue(`${name}`, dateString);
      setTimeAccident(dateString);
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
        <title>Edit Case - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการคดี" },
          { title: "รายการคดี", path: "/inves/manage-case/list" },
          { title: "แก้ไขคดี" },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left" }}>
          <h2>แก้ไขคดี</h2>
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
                      maxLength={50}
                      // showCount={true}
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
              <ConfigProvider locale={locale}>
                <DatePicker
                  format="DD-MM-YYYY"
                  allowClear={false}
                  defaultValue={dayjs(dateSave)}
                  value={dayjs(dateSave)}
                  onChange={(date, dateString) =>
                    handleDateChange(date, dateString, "case_save_date")
                  }
                />
              </ConfigProvider>
            </Form.Item>

            <Form.Item
              name="case_save_time"
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
              <ConfigProvider locale={locale}>
                <TimePicker
                  allowClear={false}
                  value={dayjs(timeSave, "HH:mm:ss")}
                  defaultValue={dayjs(timeSave, "HH:mm:ss")}
                  onChange={(time, timeString) =>
                    handleDateChange(time, timeString, "case_save_time")
                  }
                />
              </ConfigProvider>
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
              <ConfigProvider locale={locale}>
                <DatePicker
                  format="DD-MM-YYYY"
                  allowClear={false}
                  defaultValue={dayjs(dateAccident)}
                  value={dayjs(dateAccident)}
                  onChange={(date, dateString) =>
                    handleDateChange(date, dateString, "case_accident_date")
                  }
                />
              </ConfigProvider>
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
              <ConfigProvider locale={locale}>
                <TimePicker
                  allowClear={false}
                  value={dayjs(timeAccident, "HH:mm:ss")}
                  defaultValue={dayjs(timeAccident, "HH:mm:ss")}
                  onChange={(time, timeString) =>
                    handleDateChange(time, timeString, "case_accident_time")
                  }
                />
              </ConfigProvider>
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
                  if (value && value.length > 255) {
                    return Promise.reject({
                      message: (
                        <span style={{ fontSize: "12px" }}>
                          ไม่สามารถกรอกเกิน 255 ตัวอักษรได้
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
            let nameType = null;
            typeEvidence.forEach((type) => {
              if (type.type_e_id === evidence[index]?.type_e_id) {
                nameType = type.type_e_name;
              }
            });
            if (evidence[index]?.evidence_amount === null) {
              evidence[index].evidence_amount = 1;
            }
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
                        nameType || evidence[index]?.type_e_name || ""
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
                            {
                              ef_photo: null,
                              ef_detail: "",
                              assignGroupId: null,
                            },
                          ];
                        } else if (info.type === "down") {
                          let evs = evidence.slice();
                          evs[index].evidence_factor.splice(-1, 1);
                          setEfDelete((prev) => [
                            ...prev,
                            {
                              ...evs[index].evidence_factor[
                                evs[index].evidence_factor.length - 1
                              ],
                            },
                          ]);
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
                                label={`${
                                  nameType ||
                                  evidence[index]?.type_e_name ||
                                  "วัตถุที่"
                                } ${i + 1}`}
                              />
                              {evidence[index].evidence_amount !== 1 && (
                                <Tooltip title="ลบ">
                                  <Button
                                    shape="circle"
                                    icon={<Delete />}
                                    onClick={() =>
                                      handleDeleteEvidenceFactor(i, index)
                                    }
                                  />
                                </Tooltip>
                              )}
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
                                        evidence[index]?.evidence_factor[
                                          i
                                        ]?.ef_photo
                                          ?.split(";")[1]
                                          ?.split(",")[0] !== "base64"
                                          ? `${process.env.REACT_APP_URL_ASSET}/${evidence[index]?.evidence_factor[i]?.ef_photo}`
                                          : `${evidence[index]?.evidence_factor[i]?.ef_photo}`
                                      }
                                      // src={`${process.env.REACT_APP_URL_ASSET}/${evidence[index]?.evidence_factor[i]?.ef_photo}`}
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
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                              }}
                            >
                              <TextArea
                                placeholder="รายละเอียดของวัตถุพยาน"
                                value={
                                  evidence[index]?.evidence_factor[i]?.ef_detail
                                }
                                onChange={(e) => {
                                  handleChangeDetail(e, i, index);
                                }}
                              />
                              <Select
                                placeholder="เลือกกลุ่มงานที่จะมอบงานตรวจ"
                                allowClear={true}
                                value={
                                  evidence[index]?.evidence_factor[i]
                                    ?.assignGroupId
                                }
                                defaultValue={
                                  evidence[index]?.evidence_factor[i]?.group_id
                                }
                                onClear={() => {
                                  const res = [...evidence]; // Clone the evidence array
                                  const re = {
                                    ...evidence[index]?.evidence_factor[i],
                                    assignGroupId_remove: true,
                                  };
                                  console.log("re", re);
                                  res[index].evidence_factor[i] = re; // Update the specific evidence_factor
                                  setEvidence(res);
                                }}
                                onChange={(value, obj) => {
                                  console.log("obj", obj);
                                  const res = [...evidence]; // Clone the evidence array
                                  const re = {
                                    ...evidence[index]?.evidence_factor[i],
                                    assignGroupId: obj?.value || null,
                                    assignGroupId_remove: obj?.value
                                      ? false
                                      : true,
                                  };
                                  console.log("re", re);
                                  res[index].evidence_factor[i] = re; // Update the specific evidence_factor
                                  setEvidence(res);
                                }}
                                style={{ marginTop: "10px" }}
                              >
                                {group.map((group, index) => (
                                  <Select.Option
                                    key={index}
                                    disabled={group.group_status === "1"}
                                    value={group.group_id}
                                  >{`${group.group_name}`}</Select.Option>
                                ))}
                              </Select>
                            </Box>
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
                  new_evidence: "new",
                  type_e_id: null,
                  evidence_amount: null,
                  evidence_factor: [{                            
                    ef_photo: null,
                    ef_detail: "",
                    assignGroupId: null,
                  }],
                  expanded: false,
                };
                setEvidence([...evidence, res]);
              }}
            >
              เพิ่มวัตถุพยาน
            </Button>
          </Form.Item>

          <Form.Item {...tailLayout}>
            {/* <Button type="primary" htmlType="submit">
              ยืนยัน
            </Button> */}
            {evidence.length > 0 ? (
              <Button type="primary" htmlType="submit">
                ยืนยัน
              </Button>
            ) : (
              <Tooltip
                title={
                  <Box
                    style={{
                      // textAlign: "center",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Grid sx={{ mr: 1 }}>
                      <ExclamationCircleOutlined />
                    </Grid>
                    <Grid>กรุณาเพิ่มวัตถุพยาน</Grid>
                  </Box>
                }
              >
                <Button type="primary" htmlType="submit" disabled={true}>
                  ยืนยัน
                </Button>
              </Tooltip>
            )}
            <Button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>
              ยกเลิก
            </Button>
            {/* <Button
              onClick={() => form.setFieldsValue(defaultValues)}
              style={{ marginLeft: 10 }}
            >
              คืนค่า
            </Button> */}
          </Form.Item>
        </Form>
      </Box>
    </div>
  );
};

export default UpdateCase;
