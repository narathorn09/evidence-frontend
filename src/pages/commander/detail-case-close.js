import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Form, Divider, Button, Typography, Tag } from "antd";
import {
  Box,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
} from "@mui/material";
import { useParams } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

const CaseDetailClose = () => {
  const params = useParams();
  const requestPrivate = useAxiosPrivate();
  const [typeEvidence, setTypeEvidence] = useState([]);
  const [form] = Form.useForm();
  const [caseData, setCaseData] = useState({});
  const [summaryText, setSummaryText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(
          `/caseByCaseId/${params?.caseId}`
        );
        setCaseData(response.data[0]);
        setSummaryText(response.data[0]?.case_summary_text);
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
  }, []);

  const countEvidenceAll = caseData?.evidence_list
    ?.map((row) => row.evidence_factor?.filter((itemFactor) => itemFactor))
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
        <title>รายละเอียดคดี - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "คดี" },
          {
            title: "รายการคดีที่ปิดแล้ว",
            path: "/commander/manage-case/list-case-close/main",
          },
          {
            title: `คดีหมายเลข บก. ที่ ${caseData?.case_numboko}`,
          },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left", mb: 2 }}>
          <h2
            style={{ color: "var(--color--main)" }}
          >{`คดีหมายเลข บก. ที่ ${caseData?.case_numboko}`}</h2>
        </Grid>
        <Card
          sx={{
            p: 1,
            pl: 3,
            pr: 3,
            mt: 2,
            borderRadius: "8px",
          }}
        >
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
                <span style={{ fontWeight: "bold" }}>
                  วันและเวลาที่เกิดเหตุ
                </span>
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
          </Form>
        </Card>
        <Divider />
        <Card
          sx={{
            p: 1,
            pl: 3,
            pr: 3,
            mt: 2,
            borderRadius: "8px",
          }}
        >
          <Grid sx={{ textAlign: "left", mb: 3, mt: 2 }}>
            <h2>วัตถุพยาน</h2>
          </Grid>

          <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Card
              sx={{
                p: 1,
                pl: 2,
                pr: 2,
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                color: "var(--color--main)",
                fontSize: "14px",
              }}
            >
              <spna>{`วัตถุพยานทั้งหมด: ${countEvidenceAll} \u00A0`} </spna>
            </Card>
          </Grid>

          <TableContainer
            sx={{
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              width: "100%",
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
            <span>{summaryText || "-"}</span>
          </Form.Item>
        </Card>
      </Box>
    </div>
  );
};

export default CaseDetailClose;
