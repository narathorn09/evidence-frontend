import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Form,
  Divider,
  Image,
  Typography,
  Button,
  Select,
  Tooltip,
} from "antd";
import {
  FileImageOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Box, Grid, Chip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

const AssignEvidence = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const [typeEvidence, setTypeEvidence] = useState([]);
  const [form] = Form.useForm();
  const [caseData, setCaseData] = useState({});
  const [DirectorId, setDirectorId] = useState(null);
  const [expert, setExpert] = useState([]);
  const [expertFilter, setExpertFilter] = useState([]);
  const [groupId, setGroupId] = useState(null);
  const [expertId, setExpertId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(
          `/expertByGroupId/${groupId}`
        );
        setExpert(response?.data);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลผู้ชำนาญการ : ${err}`);
      }
    };

    fetchData();
  }, [groupId]);

  useEffect(() => {
    const fetchData = async () => {
      const newData = await Promise.all(
        expert.map(async (e) => {
          const count = await countAssignEvidence(e?.expert_id);
          return {
            value: e?.expert_id,
            text: e.expert_rank + e.expert_fname + " " + e.expert_lname,
            count: count, // Store the count separately for sorting
            label: (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>
                  {e.expert_rank + e.expert_fname + " " + e.expert_lname}
                </span>
                <span style={{ opacity: 0.5 }}>
                  จำนวนงานที่ตรวจอยู่: {count}
                </span>
              </div>
            ),
          };
        })
      );

      // Sort the newData array by count in ascending order
      newData.sort((a, b) => a.count - b.count);

      setExpertFilter(newData);
    };

    fetchData();
  }, [expert]);

  useEffect(() => {
    const data = { id: auth?.user?.id, role: auth?.user?.role };
    const fetchData = async () => {
      try {
        const response = await requestPrivate.post(`/id`, data);
        if (response.status === 200) {
          setDirectorId(response?.data[0]?.director_id);
          const group = await requestPrivate.get(
            `/groupByDirectorId/${response?.data[0]?.director_id}`
          );
          if (group.status === 200) {
            setGroupId(group.data[0].group_id);
          }
        }
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
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลคดี : ${err}`);
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
    if (caseData) {
      setExpertId(
        caseData?.evidence_list?.[0]?.evidence_factor?.[0]?.expert_id
      );
    }
  }, [caseData]);

  const countAssignEvidence = async (expertId) => {
    try {
      const response = await requestPrivate.get(
        `/countAssignEvidence/${expertId}`
      );
      return response.data.count;
    } catch (err) {
      alert(`เกิดข้อผิดพลาดในการนับจำนวนงานที่ได้รับมอบหมาย : ${err}`);
    }
  };

  const onConfirmAssign = async () => {
    try {
      const data = {
        expert_id: expertId,
        case_id: caseData?.case_id,
        group_id: groupId,
      };
      console.log("data", data);
      const response = await requestPrivate.post("/assignEvidence", {
        dataForAssign: data,
      });
      if (response) {
        Swal.fire({
          title: "มอบหมายงานสำเร็จ!",
          text: "มอบหมายงานตรวจให้ผู้ชำนาญการสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        navigate(-1);
      }
    } catch (err) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "เกิดข้อผิดพลาดในการมอบหมายงาน",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const onChangeSelectExpert = (expertId) => {
    setExpertId(expertId);
  };

  const onClearExpert = () => {};

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
            title: "รายการคดีที่ได้รับมอบหมาย",
            path: "/director/manage-case/list-accept/main",
          },
          {
            title: `มอบหมายงานตรวจ คดีหมายเลข บก. ที่ ${caseData?.case_numboko}`,
          },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Grid sx={{ textAlign: "left", mb: 2 }}>
          <h2>มอบหมายงานตรวจ คดีหมายเลข บก. ที่ {caseData?.case_numboko}</h2>
        </Grid>

        <Form
          form={form}
          size="middle"
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
          onFinish={onConfirmAssign}
          autoComplete="off"
        >
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
                    rules={[
                      {
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
                            mb: "8px",
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
                          </Box>
                        </Box>
                      </div>
                    );
                  })}
                </Form.Item>
              </Box>
            );
          })}
          <Form.Item
            label={<span style={{ fontWeight: "bold" }}>ผู้ชำนาญการ</span>}
          >
            {caseData?.evidence_list?.[0]?.evidence_factor?.[0]
              ?.assign_exp_status === "1" ||
            caseData?.evidence_list?.[0]?.evidence_factor?.[0]
              ?.assign_exp_status === "2" ? (
              <Tooltip
                title={
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Grid sx={{ mr: 1 }}>
                      <ExclamationCircleOutlined />
                    </Grid>
                    <Grid>
                      ไม่สามารถเปลี่ยนผู้ชำนาญการได้ เนื่องจากมีการกดรับงานแล้ว
                    </Grid>
                  </Box>
                }
                color={"#f50"}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                <Select
                  allowClear={true}
                  disabled={true}
                  value={expertId}
                  showSearch
                  placeholder="เลือกผู้ชำนาญการ"
                  optionFilterProp="children"
                  onChange={(expertId) => onChangeSelectExpert(expertId)}
                  onClear={() => onClearExpert()}
                  filterOption={(input, option) =>
                    (option?.text ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={expertFilter}
                />
              </Tooltip>
            ) : (
              <Select
                allowClear={true}
                value={expertId}
                showSearch
                placeholder="เลือกผู้ชำนาญการ"
                optionFilterProp="children"
                onChange={(expertId) => onChangeSelectExpert(expertId)}
                onClear={() => onClearExpert()}
                filterOption={(input, option) =>
                  (option?.text ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={expertFilter}
              />
            )}
          </Form.Item>
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

export default AssignEvidence;
