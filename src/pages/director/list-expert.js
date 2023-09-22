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
import { Button as ButtonAntd , Input} from "antd";
import { useAuth } from "../../contexts/auth-context";
import NoDataUi from "../../components/no-data";

const ListExpertByGroup = () => {
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const { auth } = useAuth();
  const [groupId, setGroupId] = useState(null);
  const [DirectorId, setDirectorId] = useState(null);
  const [searchFname, setSearchFname] = useState("")
  const [searchLname, setSearchLname] = useState("")

  const columns = [
    {
      field: "index",
      headerName: "#",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "nametitle",
      headerName: "คำนำหน้าชื่อ",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "rank",
      headerName: "ยศ",
      width: 150,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "fname",
      headerName: "ชื่อจริง",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "lname",
      headerName: "นามสกุล",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "detail",
      headerName: "ดูรายละเอียด",
      width: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <ButtonAntd
          onClick={() => {
            navigate(`/director/manage-expert/detail/${params?.row?.id}`);
          }}
          sx={{ ":hover": { color: "var(--color--main-light9)" } }}
        >
          ดูรายละเอียด
        </ButtonAntd>
      ),
    },
  ];

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
        const response = await requestPrivate.get(
          `/expertByGroupId/${groupId}`
        );
        setItems(response?.data);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูลผู้ชำนาญการ : ${err}`);
      }
    };

    fetchData();
  }, [groupId]);


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

  const filteredArray = items.filter((e) => {
    const Fname =
      !searchFname ||
      e.expert_fname.toLowerCase().includes(searchFname.toLowerCase());
    const Lname =
      !searchLname ||
      e.expert_lname.toLowerCase().includes(searchLname.toLowerCase());
    

    return Fname && Lname;
  });

  return (
    <>
      <Helmet>
        <title>ผู้ชำนาญการ - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[{ title: "ผู้ชำนาญการ" }, { title: "รายชื่อผู้ชำนาญการ" }]}
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
        <Grid container  spacing={2} sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <Grid item xs={12} sm={4} md={3}>
            <Input
              placeholder="ค้นหาชื่อจริง"
              value={searchFname}
              onChange={(e) => setSearchFname(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Input
              placeholder="ค้นหานามสกุล"
              value={searchLname}
              onChange={(e) => setSearchLname(e.target.value)}
            />
          </Grid>
        
        </Grid>
        <DataGrid
          rows={
            items
              ? filteredArray?.map((e, index) => ({
                  ...e,
                  id: e.expert_id,
                  index: index + 1,
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

export default ListExpertByGroup;
