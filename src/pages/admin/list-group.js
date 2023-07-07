import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, IconButton, Grid } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { DeleteForever, AddCircle, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";

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
      width: 360,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) =>
        params.row?.director_rank
          ? `${params.row?.director_rank || ""} ${
              params.row?.director_fname || ""
            } ${params.row?.director_lname || ""}`
          : "-",
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
      width: 150,
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
    const confirmed = window.confirm(`คุณต้องการลบ ${groupName}?`);
    if (confirmed) {
      try {
        await requestPrivate.delete(`/groupById/${groupId}`).then(() => {
          setRefetch(!refetch);
          alert(`ลบ ${groupName} สำเร็จ`);
        });
      } catch (err) {
        alert(`${err?.data?.message}`);
      }
    }
  };

  const csvOptions = {
    fileName: "รายชื่อกลุ่มงาน",
    utf8WithBom: true,
    fields: ["index", "group_name", "director"],
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
          <IconButton onClick={() => navigate("/group-management/create")}>
            <AddCircle />
          </IconButton>
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
