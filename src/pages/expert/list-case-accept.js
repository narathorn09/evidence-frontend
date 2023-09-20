import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, IconButton, Grid } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import { Button as ButtonAntd, Tag } from "antd";
import dayjs from "dayjs";
import exportPdf from "../../libs/export-pdf";
import NoDataUi from "../../components/no-data";

const ListCaseAcceptOfExpert = () => {
  const { auth } = useAuth();
  const [me, setMe] = useState();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [expertId, setExpertId] = useState(null);
  const [typeEvidence, setTypeEvidence] = useState([]);

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
        const response = await requestPrivate.get(
          `/caseByAssignByExpert/${expertId}`
        );
        setItems(response?.data);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงรายการคดี : ${err}`);
      }
    };

    fetchData();
  }, [expertId, refetch]);

  console.log("items", items);

  const columns = [
    {
      field: "index",
      headerName: "#",
      width: 90,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "case_numboko",
      headerName: "หมายเลข บก.",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "case_type",
      headerName: "ประเภทของคดี",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "case_save_date",
      headerName: "วันที่ลงบันทึกคดี",
      width: 150,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => dayjs(params?.value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        dayjs(params?.row?.case_save_date).format("DD-MM-YYYY"),
    },
    {
      field: "case_save_time",
      headerName: "เวลาที่ลงบันทึกคดี",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => `${params?.row?.case_save_time} น.`,
    },
    {
      field: "case_accident_date",
      headerName: "วันที่เกิดเหตุ",
      width: 150,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => dayjs(params?.value).format("DD-MM-YYYY"),
      renderCell: (params) =>
        dayjs(params?.row?.case_accident_date).format("DD-MM-YYYY"),
    },
    {
      field: "case_accident_time",
      headerName: "เวลาที่เกิดเหตุ",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => `${params?.row?.case_accident_time} น.`,
    },
    {
      field: "case_location",
      headerName: "สถานที่ที่เกิดเหตุ",
      width: 400,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "status",
      headerName: "สถานะการอนุมัติ",
      width: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => {
        let textStatus;

        let check = false;
        params?.row.evidence_list.forEach((evidence) => {
          evidence.evidence_factor.forEach((factor) => {
            if (factor.ef_status === "3") {
              check = true;
            }
          });
        });

        if (check) {
          textStatus = "อนุมัติแล้ว";
        } else {
          textStatus = "ยังไม่อนุมัติ";
        }

        return textStatus;
      },
      renderCell: (params) => {
        let textStatus;
        let colorStatus;
        let check = false;
        params?.row.evidence_list.forEach((evidence) => {
          evidence.evidence_factor.forEach((factor) => {
            if (factor.ef_status === "3") {
              check = true;
            }
          });
        });

        if (check) {
          textStatus = "อนุมัติแล้ว";
          colorStatus = "green";
        } else {
          textStatus = "ยังไม่อนุมัติ";
          colorStatus = "orange";
        }

        return (
          <Tag color={colorStatus}>
            <span style={{ fontSize: "13px" }}>{textStatus}</span>
          </Tag>
        );
      },
    },
    {
      field: "Detail",
      headerName: "บันทึกผลตรวจ",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        let check = true; // Initialize check as true

        params.row.evidence_list?.forEach((evidence) => {
          evidence.evidence_factor?.forEach((factor) => {
            if (factor.assign_exp_close_work !== "1") {
              check = false; // If any factor's assign_direc_status is not "1", set check to false
            }
          });
        });

        return (
          <ButtonAntd
            disabled={check}
            onClick={() => {
              navigate(
                `/expert/manage-evidence/list-accept/saveResult/${params?.row?.id}`
              );
            }}
            sx={{ ":hover": { color: "var(--color--main-light9)" } }}
          >
            บันทึกผลตรวจ
          </ButtonAntd>
        );
      },
    },
    {
      field: "confirm",
      headerName: "ปิดงานตรวจ",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        let check = true; // Initialize check as true

        params.row.evidence_list?.forEach((evidence) => {
          evidence.evidence_factor?.forEach((factor) => {
            if (factor.assign_exp_close_work !== "1") {
              check = false; // If any factor's assign_direc_status is not "1", set check to false
            }
          });
        });

        return (
          <ButtonAntd
            disabled={check}
            onClick={() => {
              navigate(
                `/expert/manage-evidence/list-accept/closeWork/${params?.row?.id}`
              );
            }}
            sx={{ ":hover": { color: "var(--color--main-light9)" } }}
          >
            ปิดงานตรวจ
          </ButtonAntd>
        );
      },
    },
    {
      field: "report",
      headerName: "ออกรายงาน",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        let check = true; // Initialize check as true

        params.row.evidence_list?.forEach((evidence) => {
          evidence.evidence_factor?.forEach((factor) => {
            if (factor.assign_exp_close_work === "1") {
              check = false; // If any factor's assign_direc_status is not "1", set check to false
            }
          });
        });

        return (
          <ButtonAntd
            disabled={check}
            onClick={async () => {
              await exportPdf({
                data: {
                  ...params?.row,
                  name: `${me?.rank}${me?.fname} ${me?.lname}`,
                  typeEvidence: typeEvidence,
                },
              });
            }}
            sx={{ ":hover": { color: "var(--color--main-light9)" } }}
          >
            ออกรายงาน
          </ButtonAntd>
        );
      },
    },
  ];

  const csvOptions = {
    fileName: "รายการงานตรวจที่รับมอบหมายแล้ว",
    utf8WithBom: true,
    fields: [
      "index",
      "case_numboko",
      "case_type",
      "case_save_date",
      "case_save_time",
      "case_accident_date",
      "case_accident_time",
      "case_location",
    ],
  };

  function CustomExportButton(props) {
    return (
      <GridToolbarExportContainer
        {...props}
        component={Button}
        sx={{ fontFamily: "Prompt", fontSize: "14px", mb: "4px" }}
      >
        <GridCsvExportMenuItem
          options={csvOptions}
          sx={{
            fontFamily: "Prompt",
            fontSize: "14px",
            width: "100%",
            height: "30px",
          }}
        />
        {/* <JsonExportMenuItem /> */}
      </GridToolbarExportContainer>
    );
  }

  function CustomToolbar(props) {
    return (
      <GridToolbarContainer {...props}>
        <CustomExportButton />
      </GridToolbarContainer>
    );
  }

  return (
    <div>
      <Helmet>
        <title>งานตรวจ - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "งานตรวจ" },
          { title: "รายการงานตรวจที่รับมอบหมายแล้ว" },
        ]}
      />
      <Grid
        sx={{
          height: "100%",
          width: "100%",
          "& .super-app-theme--header": {
            backgroundColor: "var(--color--main-light9)",
            color: "white",
          },
        }}
      >
        <Grid sx={{ textAlign: "left" }}>
          <h2>รายการงานตรวจที่รับมอบหมายแล้ว</h2>
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          {/* <ButtonAntd
            type="primary"
            onClick={() => navigate("/inves/manage-case/create")}
          >
            เพิ่ม
          </ButtonAntd> */}
        </Grid>
        <DataGrid
          rows={
            items
              ? items
                  ?.map((e) => {
                    let check = false;

                    e.evidence_list.forEach((evidence) => {
                      evidence.evidence_factor.forEach((factor) => {
                        if (factor.assign_exp_status !== "0") {
                          check = true;
                          // if (factor.assign_exp_close_work === "1") {
                          //   check = false;
                          // }
                        }
                      });
                    });

                    return check
                      ? e // Keep the object as is
                      : null;
                  })
                  .filter((e) => e !== null) // Filter out null values
                  .map((e, index) => ({
                    ...e,
                    id: e.case_id,
                    index: index + 1, // Use the filtered index as the sequence
                  }))
              : []
          }
          columns={columns}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: NoDataUi,
          }}
          sx={{ borderRadius: "8px", height: "460px" }}
        />
      </Grid>
    </div>
  );
};

export default ListCaseAcceptOfExpert;
