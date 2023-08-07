import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, IconButton, Grid, Box } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { DeleteForever, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import { Button as ButtonAntd } from "antd";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const ListCaseAssign = () => {
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [refetch, setRefetch] = useState(false);
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
        const response = await requestPrivate.get(
          `/caseByAssign/${DirectorId}`
        );
        setItems(response?.data);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงรายการคดี : ${err}`);
      }
    };

    fetchData();
  }, [DirectorId, refetch]);

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
      field: "case_status",
      headerName: "สถานะของคดี",
      width: 100,
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
            navigate(`/director/manage-case/casebyid/${params?.row?.id}`);
          }}
          sx={{ ":hover": { color: "var(--color--main-light9)" } }}
        >
          <Visibility />
        </IconButton>
      ),
    },
    {
      field: "accept",
      headerName: "การรับคดี",
      width: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        let check = false;
        params.row.evidence_list.forEach((evidence) => {
          evidence.evidence_factor.forEach((factor) => {
            if (factor.assign_direc_status === "1") {
              check = true;
            }
          });
        });
        return !check ? (
          <ButtonAntd
            styles={{ color: "red" }}
            onClick={() => {
              acceptCase(
                params?.row?.id,
                DirectorId,
                params?.row?.case_numboko
              );
            }}
            sx={{ ":hover": { color: "var(--color--main-light9)" } }}
          >
            กดรับคดี
          </ButtonAntd>
        ) : (
          <Box sx={{color: "green"}}>รับคดีแล้ว</Box>
        );
      },
    },
    {
      field: "Delete",
      headerName: "ยกเลิกคดี",
      headerClassName: "super-app-theme--header",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        let check = false;
        params.row.evidence_list.forEach((evidence) => {
          evidence.evidence_factor.forEach((factor) => {
            if (factor.assign_direc_status === "1") {
              check = true;
            }
          });
        });
        return (
          <ButtonAntd
            disabled={check}
            danger={true}
            onClick={() => {
              CancelCase(params?.row?.id, params?.row?.case_numboko);
            }}
            sx={{ ":hover": { color: "var(--color--main-light9)" } }}
          >
            ยกเลิกคดี
          </ButtonAntd>
        )
      },
    },
  ];

  const acceptCase = (case_id, director_id, caseNumboko) => {
    const data = { case_id, director_id };
    Swal.fire({
      title: "คุณกำลังกดรับคดี!",
      text: `คุณต้องการรับคดีหมายเลข บก. ${caseNumboko}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await requestPrivate.put(`/acceptCase`, data).then(() => {
            Swal.fire({
              title: "รับคดีสำเร็จ!",
              text: `รับคดีหมายเลข บก. ${caseNumboko} สำเร็จ`,
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            setRefetch(!refetch);
          });
        } catch (err) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "เกิดข้อผิดพลาดในการรับคดี",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      }
    });
  };

  const CancelCase = async (caseId, caseNumboko) => {
    Swal.fire({
      title: "แจ้งเตือน!",
      text: `คุณต้องการยกเลิกคดีหมายเลข บก. ${caseNumboko}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // await requestPrivate.delete(`/caseByCaseId/${caseId}`).then(() => {
          //   Swal.fire({
          //     title: "ลบสำเร็จ!",
          //     text: `ลบคดีหมายเลข บก. ${caseNumboko} สำเร็จ`,
          //     icon: "success",
          //     confirmButtonText: "ตกลง",
          //   });
          //   setRefetch(!refetch);
          // });
        } catch (err) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "เกิดข้อผิดพลาดในการลบคดี",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      }
    });
  };

  const csvOptions = {
    fileName: "รายการคดี",
    utf8WithBom: true,
    fields: ["index", "type_e_name"],
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
        <title>Lists Case - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[{ title: "จัดการคดี" }, { title: "รายการคดี" }]}
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
          <h2>รายการคดีที่ได้รับมอบหมาย</h2>
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <ButtonAntd
            type="primary"
            onClick={() => navigate("/inves/manage-case/create")}
          >
            เพิ่ม
          </ButtonAntd>
        </Grid>
        <DataGrid
          rows={
            items
              ? items?.map((e, index) => ({
                  ...e,
                  id: e.case_id,
                  index: index + 1,
                }))
              : []
          }
          columns={columns}
          slots={{
            toolbar: CustomToolbar,
          }}
          sx={{ borderRadius: "8px", height: "400px" }}
        />
      </Grid>
    </div>
  );
};

export default ListCaseAssign;