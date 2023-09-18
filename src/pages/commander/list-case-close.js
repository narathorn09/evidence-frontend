import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Grid } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import { Button as ButtonAntd, Input } from "antd";
import dayjs from "dayjs";
import NoDataUi from "../../components/no-data";

const ListCaseAllClose = () => {
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/caseAll`);
        if (response?.status === 200) {
          setItems(response?.data);
        }
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงข้อมูล : ${err}`);
      }
    };

    fetchData();
  }, []);

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
      field: "case_save_date",
      headerName: "วันที่ลงบันทึกคดี",
      width: 300,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => dayjs(params?.value).format("DD-MMMM-YYYY"),
      renderCell: (params) =>
        dayjs(params?.row?.case_save_date).format("DD-MMMM-YYYY"),
    },
    {
      field: "case_numboko",
      headerName: "หมายเลข บก.",
      width: 250,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "case_type",
      headerName: "ประเภทของคดี",
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
            navigate(
              `/commander/manage-case/list-case-close/detail/${params?.row?.id}`
            );
          }}
          sx={{ ":hover": { color: "var(--color--main-light9)" } }}
        >
          ดูรายละเอียด
        </ButtonAntd>
      ),
    },
  ];

  const csvOptions = {
    fileName: "รายการคดีที่ปิดแล้ว",
    utf8WithBom: true,
    fields: ["index", "case_numboko", "case_type", "case_save_date"],
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
        <title>คดี - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[{ title: "คดี" }, { title: "รายการคดีที่ปิดแล้ว" }]}
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
          <h2>รายการคดีที่ปิดแล้ว</h2>
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Input
            placeholder="ค้นหาหมายเลข บก."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <DataGrid
          rows={
            items
              ? items
                  ?.filter(
                    (e, index) =>
                      e.case_status === "2" &&
                      e.case_numboko.includes(searchQuery)
                  )
                  .map((e, index) => ({
                    ...e,
                    id: e.case_id,
                    index: index + 1,
                  }))
                  .sort(
                    (a, b) =>
                      new Date(a.case_save_date) - new Date(b.case_save_date)
                  )
              : []
          }
          columns={columns}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: NoDataUi,
          }}
          sx={{ borderRadius: "8px", height: "450px" }}
        />
      </Grid>
    </div>
  );
};

export default ListCaseAllClose;
