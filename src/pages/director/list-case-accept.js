import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, IconButton, Grid } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import { Button as ButtonAntd } from "antd";
import dayjs from "dayjs";
import NoDataUi from "../../components/no-data";

const ListCaseAccept = () => {
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
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
  }, [DirectorId]);

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
              `/director/manage-case/list-accept/casebyid/${params?.row?.id}`
            );
          }}
          sx={{ ":hover": { color: "var(--color--main-light9)" } }}
        >
          <Visibility />
        </IconButton>
      ),
    },
    {
      field: "assign_evidence",
      headerName: "มอบหมายงานตรวจ",
      width: 150,
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
          <ButtonAntd disabled={true}>มอบหมายงาน</ButtonAntd>
        ) : (
          <ButtonAntd
            onClick={() => {
              navigate(
                `/director/manage-case/list-accept/assign-evidence/${params?.row?.id}`
              );
            }}
          >
            มอบหมายงาน
          </ButtonAntd>
        );
      },
    },
  ];

  const csvOptions = {
    fileName: "รายการคดีที่รับมอบหมายแล้ว",
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
        <title>คดี - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[{ title: "คดี" }, { title: "รายการคดีที่รับมอบหมายแล้ว" }]}
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
          <h2>รายการคดีที่รับมอบหมายแล้ว</h2>
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
                        if (factor.assign_direc_status === "1" && factor.assign_exp_close_work === "0") {
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

export default ListCaseAccept;
