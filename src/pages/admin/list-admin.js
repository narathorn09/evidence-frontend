import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, IconButton, Grid } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { DeleteForever, PersonAddAlt1, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";

const ListAdmin = () => {
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
      field: "mem_username",
      headerName: "ชื่อผู้ใช้",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "admin_fname",
      headerName: "ชื่อจริง",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "admin_lname",
      headerName: "นามสกุล",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Edit",
      headerName: "แก้ไข",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            navigate(`/user-management/admin/update/${params?.row?.id}`);
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
      width: 150,
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
      await requestPrivate.get(`/admin`).then((response) => {
        setItems(response.data);
      });
    };
    fetchData();
  }, [refetch]);

  const RemoveMember = async (memId, username) => {
    const confirmed = window.confirm(`คุณต้องการลบชื่อผู้ใช้ ${username}?`);
    if (confirmed) {
      try {
        await requestPrivate.delete(`/memberById/${memId}`).then(() => {
          setRefetch(!refetch);
          alert(`ลบชื่อผู้ใช้ ${username} สำเร็จ`);
        });
      } catch (err) {
        alert(`${err?.data?.message}`);
      }
    }
  };

  const csvOptions = {
    fileName: "รายชื่อผู้ดูแลระบบ-FS",
    utf8WithBom: true,
    fields: ["index", "mem_username", "admin_fname", "admin_lname"],
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
        <title>Lists Admin - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[{ title: "จัดการผู้ใช้" }, { title: "รายชื่อผู้ดูแลระบบ" }]}
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
          <h2>รายชื่อผู้ดูแลระบบ</h2>
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "flex-end" ,mb: 1}}>
          <IconButton onClick={() => navigate("/user-management/admin/create")}>
            <PersonAddAlt1 />
          </IconButton>
        </Grid>
        <DataGrid
          rows={
            items
              ? items?.map((e, index) => ({
                  ...e,
                  id: e.mem_id,
                  index: index + 1,
                  username: e.mem_username
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

export default ListAdmin;
