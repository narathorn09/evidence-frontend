import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, IconButton, Grid } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import {  Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import { Button as ButtonAntd } from "antd";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import NoDataUi from "../../components/no-data";

const ListCaseAssignByExpertId = () => {
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [expertId, setExpertId] = useState(null);

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

  console.log("items", items) 

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
      field: "Detail",
      headerName: "ดูเพิ่มเติม",
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            navigate(
              `/expert/manage-evidence/list-assign/casebyid/${params?.row?.id}`
            );
          }}
          sx={{ ":hover": { color: "var(--color--main-light9)" } }}
        >
          <Visibility />
        </IconButton>
      ),
    },
    {
      field: "accept",
      headerName: "รับงาน",
      width: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        let check = false;
        params.row.evidence_list.forEach((evidence) => {
          evidence.evidence_factor.forEach((factor) => {
            if (factor.assign_exp_status !== "0") {
              check = true;
            }
          });
        });
        return (
          <ButtonAntd
            disabled={check}
            onClick={() => {
              acceptCase(
                params?.row?.id,
                expertId,
                params?.row?.case_numboko
              );
            }}
            sx={{ ":hover": { color: "var(--color--main-light9)" } }}
          >
            กดรับงาน
          </ButtonAntd>
        );
      },
    },
    // {
    //   field: "Delete",
    //   headerName: "ยกเลิกงาน",
    //   headerClassName: "super-app-theme--header",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => {
    //     let check = false;
    //     params.row.evidence_list.forEach((evidence) => {
    //       evidence.evidence_factor.forEach((factor) => {
    //         if (factor.assign_exp_status !== "0") {
    //           check = true;
    //         }
    //       });
    //     });
    //     return (
    //       <ButtonAntd
    //         disabled={check}
    //         danger={true}
    //         onClick={() => {
    //           CancelCase(
    //             params?.row?.id,
    //             // DirectorId,
    //             params?.row?.case_numboko
    //           );
    //         }}
    //         sx={{ ":hover": { color: "var(--color--main-light9)" } }}
    //       >
    //         ยกเลิกงาน
    //       </ButtonAntd>
    //     );
    //   },
    // },
  ];

  const acceptCase = (case_id, expert_id, caseNumboko) => {
    const data = { case_id, expert_id };
    Swal.fire({
      title: "คุณกำลังกดรับงานตรวจ!",
      text: `คุณต้องการรับงานตรวจ หมายเลข บก. ${caseNumboko}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await requestPrivate.put(`/acceptWork`, data).then(() => {
            Swal.fire({
              title: "รับงานตรวจสำเร็จ!",
              text: `รับงานตรวจ หมายเลข บก. ${caseNumboko} สำเร็จ`,
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            setRefetch(!refetch);
          });
        } catch (err) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "เกิดข้อผิดพลาดในการรับงานตรวจ",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      }
    });
  };

  // const CancelCase = async (case_id, director_id, caseNumboko) => {
  //   const data = { case_id, director_id };
  //   Swal.fire({
  //     title: "แจ้งเตือน!",
  //     text: `คุณต้องการยกเลิกคดีหมายเลข บก. ${caseNumboko}?`,
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "ตกลง",
  //     cancelButtonText: "ยกเลิก",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         await requestPrivate.put(`/cancelCase`, data).then(() => {
  //           Swal.fire({
  //             title: "ยกเลิกสำเร็จ!",
  //             text: `ยกเลิกคดีหมายเลข บก. ${caseNumboko} สำเร็จ`,
  //             icon: "success",
  //             confirmButtonText: "ตกลง",
  //           });
  //           setRefetch(!refetch);
  //         });
  //       } catch (err) {
  //         Swal.fire({
  //           title: "เกิดข้อผิดพลาด!",
  //           text: "เกิดข้อผิดพลาดในการยกเลิกคดี",
  //           icon: "error",
  //           confirmButtonText: "ตกลง",
  //         });
  //       }
  //     }
  //   });
  // };

  const csvOptions = {
    fileName: "รายการงานตรวจที่ได้รับมอบหมาย",
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
          { title: "รายการงานตรวจที่ได้รับมอบหมาย" },
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
          <h2>รายการงานตรวจที่ได้รับมอบหมาย</h2>
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
                        if (factor.assign_exp_status === "0") {
                          check = true;
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

export default ListCaseAssignByExpertId;
