import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Form, Divider, Image, Typography, Select, Button } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import { Box, Grid, Chip } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import "dayjs/locale/th";
dayjs.locale("th");

const SaveResultEvidence = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const [typeEvidence, setTypeEvidence] = useState([]);
  const [form] = Form.useForm();
  const [caseData, setCaseData] = useState({});
  const [expertId, setExpertId] = useState(null);
  const [resultEvidence, setResultEvidence] = useState([]);

  useEffect(() => {
    const data = { id: auth?.user?.id, role: auth?.user?.role };
    const fetchData = async () => {
      try {
        const response = await requestPrivate.post(`/id`, data);
        setExpertId(response?.data[0]?.expert_id);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงไอดี : ${err}`);
      }
    };

    fetchData();
  }, [auth?.user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.post(
          `/caseAssignByExpertIdAndCaseId`,
          {
            expert_id: expertId,
            case_id: params?.caseId,
          }
        );
        setCaseData(response.data[0]);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลกลุ่มงาน : ${err}`);
      }
    };
    fetchData();
  }, [expertId]);

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
    if (caseData) {
      const resultEvidence = caseData.evidence_list?.map((evidence) => {
        const newResult = {
          evidence_id: evidence?.evidence_id,
          evidence_factor: evidence.evidence_factor.map((e) => ({
            assignId: e.assign_id,
            assign_evi_result: e.assign_evi_result,
            assign_exp_status: e.assign_exp_status
          })),
        };

        return newResult;
      });

      setResultEvidence(resultEvidence);
    }
  }, [caseData]);

  const onSubmitResult = async () => {
    console.log("resultEvidence", resultEvidence);
    try {
      const response = await requestPrivate.post(`/saveResultEvidence`, {
        resultEvidence: resultEvidence,
      });
      if (response.status === 200) {
        Swal.fire({
          title: "บันทึกผลการตรวจสำเร็จ!",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        navigate(-1);
      }
    } catch (err) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการบันทึกผลตรวจ",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const handleChangeResult = (value, assignId, evidenceIndex, factorIndex) => {
    const updatedResult = [...resultEvidence];

    const newResultEvidenceFactor = {
      assignId: assignId,
      assign_evi_result: value || null,
      assign_exp_status: value ? "2" : "1"
    };

    updatedResult[evidenceIndex].evidence_factor.splice(
      factorIndex,
      1,
      newResultEvidenceFactor
    );

    setResultEvidence(updatedResult);
  };

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
          {
            title: "รายการคดี",
            path: "/expert/manage-evidence/list-accept/main",
          },
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
          onFinish={onSubmitResult}
        >
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>หมายเลข บก.</span>}
            name="case_numboko"
          >
            <Typography>{caseData?.case_numboko}</Typography>
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>ประเภทของคดี</span>}
            name="case_type"
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
          >
            <Form.Item
              name="case_save_date"
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
          >
            <Form.Item
              name="case_accident_date"
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
          >
            <Typography>{caseData?.case_location}</Typography>
          </Form.Item>

          <Divider />
          <Grid sx={{ textAlign: "left", mb: 3, mt: 2 }}>
            <h2>วัตถุพยานที่ได้รับมอบหมาย</h2>
          </Grid>
          {caseData?.evidence_list?.map((item, index) => {
            const nameTypeEvidence = typeEvidence
              .filter((te) => item?.type_e_id === te?.type_e_id)
              .map((te) => te?.type_e_name);

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
                  </Box>
                </Divider>

                <Form.Item
                  label={
                    <span style={{ fontWeight: "bold" }}>
                      ประเภทของวัตถุพยาน
                    </span>
                  }
                >
                  <Form.Item
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

                            <Form.Item
                              label={
                                <span style={{ fontWeight: "bold" }}>
                                  ผลการตรวจ
                                </span>
                              }
                              style={{
                                marginTop: "0px",
                              }}
                            >
                              <Select
                                allowClear={true}
                                defaultValue={itemFactor.assign_evi_result}
                                placeholder="เลือกผลการตรวจ"
                                style={{
                                  width: 200,
                                }}
                                onChange={(value) =>
                                  handleChangeResult(
                                    value,
                                    itemFactor.assign_id,
                                    index,
                                    i
                                  )
                                }
                                options={[
                                  {
                                    value: "พบ DNA",
                                    label: "พบ DNA",
                                  },
                                  {
                                    value: "ไม่พบ DNA",
                                    label: "ไม่พบ DNA",
                                  },
                                ]}
                              />
                            </Form.Item>
                          </Box>
                        </Box>
                      </div>
                    );
                  })}
                </Form.Item>
              </Box>
            );
          })}
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              ยืนยัน
            </Button>
            <Button onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>
              ยกเลิก
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </div>
  );
};

export default SaveResultEvidence;
