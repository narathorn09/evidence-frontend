import React, { useEffect, useState } from "react";
import { request, requestPrivate } from "../../axios-config";
import { Box, Button, IconButton, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DeleteForever, PersonAddAlt1 } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminList = () => {
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
      headerName: "Username",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "admin_fname",
      headerName: "First Name",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "admin_lname",
      headerName: "Last Name",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "Edit",
      headerName: "Edit",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => {
            // history.push(`/edit-archive/${params?.row?._id}`);
          }}
        >
          Edit
        </Button>
      ),
    },
    {
      field: "Delete",
      headerName: "Delete",
      headerClassName: "super-app-theme--header",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            RemoveMember(params?.row?.mem_id, params?.row?.mem_username);
          }}
        >
          <DeleteForever />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await request.get(`/admin`).then((response) => {
        setItems(response.data);
        console.log(response.data);
      });
    };
    fetchData();
  }, [refetch]);

  const RemoveMember = async (memId, username) => {
    const confirmed = window.confirm(`คุณต้องการลบชื่อผู้ใช้ ${username}?`);
    if (confirmed) {
      try {
        await request.delete(`/memberById/${memId}`).then(() => {
          setRefetch(true);
          alert(`ลบชื่อผู้ใช้ ${username} สำเร็จ`);
        });
      } catch (error) {
        alert(`${error?.data?.message}`);
      }
    }
  };

  return (
    <Box
      sx={{
        height: "auto",
        width: { xs: "100%", sm: "fit-content", md: "fit-content" },
        "& .super-app-theme--header": {
          backgroundColor: "primary.main",
          color: "white",
        },
      }}
    >
      <Grid sx={{ textAlign: "center" }}>
        <h2>Admin Lists</h2>
      </Grid>
      <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
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
              }))
            : []
        }
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        // checkboxSelection
        // disableRowSelectionOnClick
        // slots={{ toolbar: GridToolbar }}
      />
    </Box>
  );
};

export default AdminList;
