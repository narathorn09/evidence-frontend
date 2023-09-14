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

const ListCaseAcceptOfExpert = () => {
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
      headerName: "บันทึกผลตรวจ",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <ButtonAntd
          onClick={() => {
            navigate(
              `/expert/manage-evidence/list-accept/saveResult/${params?.row?.id}`
            );
          }}
          sx={{ ":hover": { color: "var(--color--main-light9)" } }}
        >
          บันทึกผลตรวจ
        </ButtonAntd>
      ),
    },
    {
      field: "confirm",
      headerName: "ปิดงานตรวจ",
      width: 150,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <ButtonAntd
          onClick={() => {
            navigate(
              `/expert/manage-evidence/list-accept/closeWork/${params?.row?.id}`
            );
          }}
          sx={{ ":hover": { color: "var(--color--main-light9)" } }}
        >
          ปิดงานตรวจ
        </ButtonAntd>
      ),
    },
    
  ];

  const csvOptions = {
    fileName: "รายการคดีที่ได้รับมอบหมาย",
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
      "case_accept_status",
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
        <title>Lists Case - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "คดีที่ได้รับ" },
          { title: "รายการคดีที่ได้รับมอบหมาย" },
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
          <h2>งานตรวจที่รับมอบหมายแล้ว</h2>
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
                          if (factor.assign_exp_close_work === "1") {
                            check = false;
                          }
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
          }}
          sx={{ borderRadius: "8px", height: "460px" }}
        />
      </Grid>
    </div>
  );
};

export default ListCaseAcceptOfExpert;
