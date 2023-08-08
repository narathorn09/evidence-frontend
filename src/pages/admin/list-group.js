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

const ListGroup = () => {
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
      field: "group_name",
      headerName: "ชื่อกลุ่มงาน",
      width: 400,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "director",
      headerName: "ผู้กำกับ",
      width: 300,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        params.row?.director_rank
          ? `${params.row?.director_rank || ""} ${
              params.row?.director_fname || ""
            } ${params.row?.director_lname || ""}`
          : "-",
    },
    {
      field: "group_status",
      headerName: "สถานะของกลุ่มงาน",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => (params.value === "0" ? "เปิด" : "ปิด"),
      renderCell: (params) => {
        let status = ""; // Default value is an empty string

        if (params.row?.group_status === "0") {
          status = "เปิด"; // "เปิด" for group_status = "0"
        } else if (params.row?.group_status === "1") {
          status = "ปิด"; // "ปิด" for group_status = "1"
        } else {
          status = "-"; // Default value for other cases
        }
        return (
          <div
            style={{
              color: params.row?.group_status === "0" ? "green" : "red",
            }}
          >
            {status}
          </div>
        );
      },
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
            navigate(`/group-management/update/${params?.row?.id}`);
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
            RemoveMember(params?.row?.group_id, params?.row?.group_name);
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
      await requestPrivate.get(`/group`).then((response) => {
        setItems(response.data);
      });
    };
    fetchData();
  }, [refetch]);

  const RemoveMember = async (groupId, groupName) => {
    Swal.fire({
      title: "แจ้งเตือน!",
      text: `คุณต้องการลบ ${groupName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await requestPrivate.delete(`/groupById/${groupId}`).then(() => {
            Swal.fire({
              title: "ลบสำเร็จ!",
              text: `ลบ ${groupName} สำเร็จ`,
              icon: "success",
              confirmButtonText: "ตกลง",
            });
            setRefetch(!refetch);
          });
        } catch (err) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "เกิดข้อผิดพลาดในการลบกลุ่มงาน",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      }
    });
  };

  const csvOptions = {
    fileName: "รายชื่อกลุ่มงาน",
    utf8WithBom: true,
    fields: ["index", "group_name", "director", "group_status"],
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
        <title>Lists Group - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[{ title: "จัดการกลุ่มงาน" }, { title: "รายชื่อกลุ่มงาน" }]}
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
          <h2>รายชื่อกลุ่มงาน</h2>
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <ButtonAntd
            type="primary"
            onClick={() => navigate("/group-management/create")}
          >
            เพิ่ม
          </ButtonAntd>
        </Grid>
        <DataGrid
          rows={
            items
              ? items?.map((e, index) => ({
                  ...e,
                  id: e.group_id,
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

export default ListGroup;
