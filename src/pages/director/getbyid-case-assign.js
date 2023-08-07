import React, { useState, useEffect, useRef } from "react";
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
  Typography,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  DeleteFilled,
  FileImageOutlined,
} from "@ant-design/icons";
import { Box, Grid, Chip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { Delete, ExpandMore, ExpandLess, Circle } from "@mui/icons-material";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import dayjs from "dayjs";
import "dayjs/locale/th";
import locale from "antd/es/locale/th_TH";
const { TextArea } = Input;
dayjs.locale("th");
let indexSelector = 0;

const GetCaseAssignById = () => {
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
  const [DirectorId, setDirectorId] = useState(null);

  useEffect(() => {
    const data = { id: auth?.user?.id, role: auth?.user?.role };
    const fetchData = async () => {
      try {
        const response = await requestPrivate.post(`/id`, data);
        setDirectorId(response?.data[0]?.director_id);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงไอดี : ${err}`);
      }
    };

    fetchData();
  }, [auth?.user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.post(`/caseAssignByCaseId`, {
          director_id: DirectorId,
          case_id: params?.caseId,
        });
        setCaseData(response.data[0]);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มงาน : ${err}`);
      }
    };
    fetchData();
  }, [DirectorId]);

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

  console.log("typeEvidence", typeEvidence);

  const defaultValues = {
    case_numboko: caseData?.case_numboko,
    case_type: caseData?.case_type,
    case_save_date: caseData?.case_save_date,
    case_save_time: caseData?.case_save_time,
    case_accident_date: caseData?.case_accident_date,
    case_accident_time: caseData?.case_accident_time,
    case_location: caseData?.case_location,
  };

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [caseData]);

  console.log(
    "caseData?.evidence_list?.evidence_factor",
    caseData?.evidence_list?.evidence_factor
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
        <title>Get Case - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการคดี" },
          { title: "รายการคดี", path: "/director/manage-case/list" },
          { title: `คดีหมายเลข บก. ที่ ${caseData?.case_numboko}` },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left", mb: 2 }}>
          <h2>ข้อมูลคดี</h2>
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
          autoComplete="off"
        >
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>หมายเลข บก.</span>}
            name="case_numboko"
            rules={[
              {
                // required: true,
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
            <Typography>{caseData?.case_numboko}</Typography>
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>ประเภทของคดี</span>}
            name="case_type"
            rules={[
              {
                // required: true,
                message: (
                  <span style={{ fontSize: "12px" }}>
                    กรุณาเลือกประเภทของคดี !
                  </span>
                ),
              },
            ]}
            style={{ textAlign: "start" }}
          >
            <Typography>{caseData?.case_type}</Typography>
          </Form.Item>

          <Form.Item
            label={
              <span style={{ fontWeight: "bold" }}>
                วันและเวลาที่ลงบันทึกคดี
              </span>
            }
            style={{
              marginBottom: 0,
            }}
            // required={true}
          >
            <Form.Item
              name="case_save_date"
              rules={[
                {
                  // required: true,
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
              <Typography>
                {dayjs(caseData?.case_save_date).format("DD MMM YYYY")}
              </Typography>
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
              <Typography>
                {"\u00A0|" +
                  "\u00A0\u00A0" +
                  "เวลา" +
                  " " +
                  caseData?.case_save_time +
                  " " +
                  "น."}
              </Typography>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label={
              <span style={{ fontWeight: "bold" }}>วันและเวลาที่เกิดเหตุ</span>
            }
            style={{
              marginBottom: 0,
            }}
            // required={true}
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
              <Typography>
                {dayjs(caseData?.case_accident_date).format("DD MMM YYYY")}
              </Typography>
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
              <Typography>
                {"\u00A0|" +
                  "\u00A0\u00A0" +
                  "เวลา" +
                  " " +
                  caseData?.case_accident_time +
                  " " +
                  "น."}
              </Typography>
            </Form.Item>
          </Form.Item>
          <Form.Item
            label={
              <span style={{ fontWeight: "bold" }}>สถานที่ที่เกิดเหตุ</span>
            }
            name="case_location"
            rules={[
              {
                // required: true,
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
            <Typography>{caseData?.case_location}</Typography>
          </Form.Item>

          <Divider />
          <Grid sx={{ textAlign: "left", mb: 3, mt: 2 }}>
            <h2>
              วัตถุพยานที่ได้รับมอบหมาย
            </h2>
          </Grid>
          {caseData?.evidence_list?.map((item, index) => {
            const nameTypeEvidence = typeEvidence
              .filter((te) => item?.type_e_id === te?.type_e_id)
              .map((te) => te?.type_e_name);

            const typeEvidenceValue =
              item?.type_e_id !== undefined && item?.type_e_id !== ""
                ? item?.type_e_id
                : item.type_e_id;
            let isLastIndex = index === caseData?.evidence_list?.length - 1;
            if (caseData?.evidence_list?.length === 0) isLastIndex = true;
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
                        nameTypeEvidence ? nameTypeEvidence : ""
                      }`}
                    />

                    {/* <Button
                      shape="circle"
                      icon={
                        item?.expanded ? (
                          <ExpandMore />
                        ) : (
                          <ExpandLess />
                        )
                      }
                      style={{
                        marginLeft: "8px",
                        transition: "transform 0.3s ease",
                        transform: item?.expanded
                          ? "rotate(180deg)"
                          : "rotate(-180deg)",
                      }}
                      onClick={() => {
                        let res = caseData?.evidence_list?.slice();
                        let rs = {
                          ...item,
                          expanded: !res[index]?.expanded,
                        };
                        res[index] = rs;
                        setEvidence(res);
                      }}
                    /> */}
                  </Box>
                </Divider>

                <Form.Item
                  label={
                    <span style={{ fontWeight: "bold" }}>
                      ประเภทของวัตถุพยาน
                    </span>
                  }
                  // style={{
                  //   overflow: "hidden",

                  //   maxHeight: evidence[index].expanded ? "0" : "100%", // Adjust the height value as needed
                  //   marginBottom: 0,
                  //   // display: evidence[index].expanded ? "none" : "flex",
                  //   transition: "max-height 0.3s ease",
                  // }}
                  // required={true}
                >
                  <Form.Item
                    // name={["type_e_id"]}

                    rules={[
                      {
                        // required: true,
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
                    <Box style={{ display: "flex", flexDirection: "row" }}>
                      <Typography>{nameTypeEvidence}</Typography>
                      <span style={{ fontWeight: "bold", marginLeft: "20px" }}>
                        จำนวน:
                      </span>
                      <Typography>{`\u00A0\u00A0${item?.evidence_factor.length}`}</Typography>
                    </Box>
                  </Form.Item>

                  {item?.evidence_factor?.map((itemFactor, i) => {
                    const nameGroupAssign = group
                      .filter((te) => itemFactor?.group_id === te?.group_id)
                      .map((te) => te?.group_name);

                    let colorStatus;
                    let textStatus;
                    switch (itemFactor?.ef_status) {
                      case "0": //รอการมอบหมายงาน
                        colorStatus = "var(--color--blue)";
                        textStatus = "รอการมอบหมายงาน";
                        break;
                      case "1": //รอกลุ่มงานรับการมอบหมาย
                        colorStatus = "var(--color--yellow)";
                        textStatus = "รอกลุ่มงานรับการมอบหมาย";
                        break;
                      case "2": //กลุ่มงานรับการมอบหมายเรียบร้อย
                        colorStatus = "var(--color--orange)";
                        textStatus = "กลุ่มงานรับการมอบหมายเรียบร้อย";
                        break;
                      case "3": //ตรวจสอบเรียบร้อย
                        colorStatus = "var(--color--green)";
                        textStatus = "ตรวจสอบเรียบร้อย";
                        break;
                      default:
                        colorStatus = "";
                        textStatus = "";
                        break;
                    }
                    return (
                      <div key={i}>
                        <Divider orientation="left" orientationMargin="0">
                          <Box sx={{ display: "flex", align: "center" }}>
                            <Chip
                              sx={{ mr: "10px" }}
                              label={`${nameTypeEvidence || "วัตถุที่"} ${
                                i + 1
                              }`}
                            />
                          </Box>
                        </Divider>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            mb: "32px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              marginRight: "8px",
                            }}
                          >
                            <Box
                              sx={{
                                width: "100px",
                                height: "100px",
                              }}
                            >
                              {itemFactor?.ef_photo ? (
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
                                  src={`${process.env.REACT_APP_URL_ASSET}/${itemFactor?.ef_photo}`}
                                />
                              ) : (
                                <Box
                                  style={{
                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                    objectFit: "contain",
                                    margin: "0",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    // width: "100%",
                                    height: "80%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <FileImageOutlined />
                                  <Typography>ไม่มีรูปภาพ</Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <Typography style={{ fontWeight: "bold" }}>
                              รายละเอียดของวัตถุพยาน
                            </Typography>
                            <Typography>
                              {itemFactor?.ef_detail || "-"}
                            </Typography>
                            {/* <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: "10px",
                              }}
                            >
                              <Typography
                                style={{
                                  fontWeight: "bold",
                                }}
                              >
                                กลุ่มงานที่มอบหมายงานตรวจ
                              </Typography>
                              <Tooltip title={textStatus}>
                                <Circle
                                  sx={{
                                    color: colorStatus,
                                    border: "1px solid rgba(0,0,0,0.4)",
                                    borderRadius: "100px",
                                    fontSize: "15px",
                                    marginLeft: "20px",
                                    cursor: "pointer",
                                  }}
                                />
                              </Tooltip>
                            </Box>
                            <Typography>
                              {nameGroupAssign[0] != undefined
                                ? nameGroupAssign
                                : "-"}
                            </Typography> */}
                          </Box>
                        </Box>
                      </div>
                    );
                  })}
                </Form.Item>
              </Box>
            );
          })}

          {/* <Form.Item {...tailLayout}>
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
          </Form.Item> */}
        </Form>
      </Box>
    </div>
  );
};

export default GetCaseAssignById;
