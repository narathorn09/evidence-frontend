import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Form, Divider, Button, Typography, Tag, Input } from "antd";
import {
  Box,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Swal from "sweetalert2";

dayjs.locale("th");

const CloseWork = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const [typeEvidence, setTypeEvidence] = useState([]);
  const [form] = Form.useForm();
  const [caseData, setCaseData] = useState({});
  const [expertId, setExpertId] = useState(null);
  const [summaryText, setSummaryText] = useState("");

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
        setSummaryText(response.data[0]?.case_summary_text);
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

  const handleCloseWork = async () => {
    Swal.fire({
      title: "คุณต้องการปิดงานตรวจ?",
      // text: `คุณต้องการปิดงานตรวจ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedListClose = [];

          caseData?.evidence_list?.forEach((row) => {
            row.evidence_factor?.forEach((itemFactor) => {
              updatedListClose.push({
                assign_id: itemFactor?.assign_id,
                assign_exp_close_work: "1",
              });
            });
          });

          await requestPrivate
            .post(`/expertCloseWork`, {
              listClose: updatedListClose,
              case_id: caseData?.case_id,
              case_summary_text: summaryText,
            })
            .then(() => {
              Swal.fire({
                title: "ปิดงานตรวจสำเร็จ!",
                text: `ปิดงานตรวจคดีเลข บก. ${caseData?.case_numboko} สำเร็จ`,
                icon: "success",
                confirmButtonText: "ตกลง",
              });
              navigate(-1);
            });
        } catch (err) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "เกิดข้อผิดพลาดในการปิดงานตรวจ",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      }
    });
  };

  const countEvidenceAll = caseData?.evidence_list
    ?.map((row) => row.evidence_factor?.filter((itemFactor) => itemFactor))
    .flat().length;

  const countEvidenceHaveResults = caseData?.evidence_list
    ?.map((row) =>
      row.evidence_factor?.filter(
        (itemFactor) =>
          itemFactor.assign_exp_status === "2" &&
          itemFactor.assign_evi_result !== null
      )
    )
    .flat().length;

  const countEvidenceDontHaveResults = caseData?.evidence_list
    ?.map((row) =>
      row.evidence_factor?.filter(
        (itemFactor) =>
          itemFactor.assign_exp_status === "1" &&
          itemFactor.assign_evi_result === null
      )
    )
    .flat().length;

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
        <title>ปิดงานตรวจ - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "งานตรวจ" },
          {
            title: "รายการงานตรวจที่รับมอบหมายแล้ว",
            path: "/expert/manage-evidence/list-accept/main",
          },
          { title: "ปิดงานตรวจ" },
          { title: `คดีหมายเลข บก. ที่ ${caseData?.case_numboko}` },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left", mb: 2 }}>
          <h2 style={{ color: "var(--color--main)" }}>ปิดงานตรวจ</h2>
        </Grid>
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
            style={{ textAlign: "start" }}
          >
            <Typography>{caseData?.case_location}</Typography>
          </Form.Item>

          <Divider />
          <Grid sx={{ textAlign: "left", mb: 3, mt: 2 }}>
            <h2>วัตถุพยานที่ได้รับมอบหมาย</h2>
          </Grid>

          <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <spna>{`วัตถุพยานทั้งหมด: ${countEvidenceAll} \u00A0`} </spna>

            <spna>{`ตรวจแล้ว: ${countEvidenceHaveResults} \u00A0`} </spna>

            <spna>{`ยังไม่ตรวจ: ${countEvidenceDontHaveResults} \u00A0`} </spna>
          </Grid>

          <TableContainer
            sx={{
              borderRadius: "8px",
              // boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.1)", // Define your shadow here
              border: "1px solid rgba(0, 0, 0, 0.1)",
              width: "100%",
              // height: "500px",
              // overflowY: "auto",
            }}
          >
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
              <TableHead
                sx={{
                  position: "sticky",
                  top: 0,
                  backgroundColor: "var(--color--main)",
                  Zindex: 1,
                }}
              >
                <TableRow>
                  <TableCell>
                    <span style={{ color: "#fff", fontSize: "16px" }}>
                      ประเภทของวัตถุพยาน
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <span style={{ color: "#fff", fontSize: "16px" }}>
                      ผลการตรวจ
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {caseData?.evidence_list?.map((row, index) => {
                  const nameTypeEvidence = typeEvidence
                    .filter((te) => row?.type_e_id === te?.type_e_id)
                    .map((te) => te?.type_e_name);

                  return (
                    <>
                      <TableRow
                        key={index}
                        sx={{ backgroundColor: "var(--color--main-light1)" }}
                      >
                        <TableCell>
                          <span>
                            {`วัตถุพยานประเภทที่ ${index + 1} ${
                              nameTypeEvidence ? nameTypeEvidence : ""
                            }`}
                          </span>
                        </TableCell>
                        <TableCell />
                      </TableRow>

                      {row.evidence_factor?.map((itemFactor, i) => {
                        let colorStatus;
                        let textStatus;
                        switch (itemFactor?.assign_evi_result) {
                          case null:
                            colorStatus = "processing";
                            textStatus = "รอผลการตรวจสอบ";
                            break;
                          case "พบ DNA":
                            colorStatus = "success";
                            textStatus = "พบ DNA";
                            break;
                          case "ไม่พบ DNA":
                            colorStatus = "error";
                            textStatus = "ไม่พบ DNA";
                            break;
                          default:
                            colorStatus = "";
                            textStatus = "";
                            break;
                        }
                        return (
                          (itemFactor?.assign_exp_status === "1" ||
                            itemFactor?.assign_exp_status === "2") && (
                            <TableRow>
                              <TableCell>
                                <span style={{ marginLeft: "50px" }}>{`${
                                  nameTypeEvidence || "วัตถุที่"
                                } ${i + 1}`}</span>
                              </TableCell>

                              <TableCell align="right">
                                <Tag
                                  style={{
                                    width: "fit-content",
                                    height: "fit-content",
                                    fontSize: "14px",
                                  }}
                                  color={colorStatus}
                                >
                                  {textStatus}
                                </Tag>
                              </TableCell>
                            </TableRow>
                          )
                        );
                      })}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Form.Item
            label={
              <span style={{ fontWeight: "bold" }}>สรุปรายละเอียดการตรวจ</span>
            }
            labelCol={{
              span: 24,
            }}
            wrapperCol={{
              span: 24,
            }}
            style={{ marginTop: "18px" }}
          >
            <Input.TextArea
              style={{ height: "100px" }}
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: "40px",
            }}
          >
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => navigate(-1)}
            >
              ย้อนกลับ
            </Button>
            <Button
              disabled={!(countEvidenceAll === countEvidenceHaveResults)}
              type="primary"
              onClick={handleCloseWork}
            >
              ปิดงานตรวจ
            </Button>
          </div>
        </Form>
      </Box>
    </div>
  );
};

export default CloseWork;
