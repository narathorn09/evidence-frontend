import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, IconButton, Grid } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { DeleteForever, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import Swal from "sweetalert2";
import { Button as ButtonAntd } from "antd";
import NoDataUi from "../../components/no-data";

const ListExpert = () => {
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [refetch, setRefetch] = useState(false);

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
      field: "username",
      headerName: "ชื่อผู้ใช้",
      width: 100,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "nametitle",
      headerName: "คำนำหน้าชื่อ",
      width: 100,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "rank",
      headerName: "ยศ",
      width: 100,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "fname",
      headerName: "ชื่อจริง",
      width: 180,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "lname",
      headerName: "นามสกุล",
      width: 180,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "group",
      headerName: "กลุ่มงาน",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Edit",
      headerName: "แก้ไข",
      width: 100,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            navigate(`/user-management/expert/update/${params?.row?.id}`);
          }}
          sx={{ ":hover": { color: "var(--color--main-light9)" } }}
        >
          <Edit />
        </IconButton>
      ),
    },
    {
      field: "Delete",
      headerName: "ลบ",
      headerClassName: "super-app-theme--header",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            RemoveMember(params?.row?.id, params?.row?.username);
          }}
          sx={{ ":hover": { color: "var(--color--main-light9)" } }}
        >
          <DeleteForever />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await requestPrivate.get(`/expert`).then((response) => {
        setItems(response.data);
      });
    };
    fetchData();
  }, [refetch]);

  const RemoveMember = async (memId, username) => {
    Swal.fire({
      title: "แจ้งเตือน!",
      text: `คุณต้องการลบชื่อผู้ใช้ ${username}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await requestPrivate.delete(`/memberById/${memId}`).then(() => {
            Swal.fire({
              title: "ลบสำเร็จ!",
              text: `ลบ ${username} สำเร็จ`,
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            setRefetch(!refetch);
          });
        } catch (err) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "เกิดข้อผิดพลาดในการลบผู้ใช้ระบบ",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      }
    });
  };

  const csvOptions = {
    fileName: "รายชื่อผู้ชำนาญการ",
    utf8WithBom: true,
    fields: ["index", "username", "nametitle", "rank", "fname", "lname", "group"],
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
    <>
      <Helmet>
        <title>รายชื่อผู้ชำนาญการ - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[{ title: "จัดการผู้ใช้" }, { title: "รายชื่อผู้ชำนาญการ" }]}
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
          <h2>รายชื่อผู้ชำนาญการ</h2>
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <ButtonAntd
            type="primary"
            onClick={() => navigate("/user-management/expert/create")}
          >
            เพิ่ม
          </ButtonAntd>
        </Grid>
        <DataGrid
          rows={
            items
              ? items?.map((e, index) => ({
                  ...e,
                  id: e.mem_id,
                  index: index + 1,
                  username: e.mem_username,
                  nametitle: e.expert_nametitle,
                  rank: e.expert_rank,
                  fname: e.expert_fname,
                  lname: e.expert_lname,
                  group: e.group_name || "-",
                }))
              : []
          }
          columns={columns}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: NoDataUi,
          }}
          sx={{ borderRadius: "8px", height: "400px" }}
        />
      </Grid>
    </>
  );
};

export default ListExpert;
