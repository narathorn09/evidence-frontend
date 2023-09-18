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

const ListTypeEvidence = () => {
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
      field: "type_e_name",
      headerName: "ประเภทของวัตถุพยาน",
      width: 400,
      flex: 1,
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
            navigate(`/inves/manage-type-evidence/update/${params?.row?.id}`);
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
            RemoveTypeEvidence(
              params?.row?.type_e_id,
              params?.row?.type_e_name
            );
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
      await requestPrivate.get(`/typeEvidence`).then((response) => {
        setItems(response.data);
      });
    };
    fetchData();
  }, [refetch]);

  const RemoveTypeEvidence = async (typeId, typeName) => {
    Swal.fire({
      title: "แจ้งเตือน!",
      text: `คุณต้องการลบ ${typeName} ซึ่งเป็นประเภทของวัตถุพยาน?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await requestPrivate
            .delete(`/typeEvidenceById/${typeId}`)
            .then(() => {
              Swal.fire({
                title: "ลบสำเร็จ!",
                text: `ลบ ${typeName} สำเร็จ`,
                icon: "success",
                confirmButtonText: "ตกลง",
              });
              setRefetch(!refetch);
            });
        } catch (err) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: "เกิดข้อผิดพลาดในการลบประเภทของวัตถุพยาน",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        }
      }
    });
  };

  const csvOptions = {
    fileName: "รายการประเภทของวัตถุพยาน",
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
        <title>Lists Type Evidence - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการประเภทของวัตถุพยาน" },
          { title: "รายการประเภทของวัตถุพยาน" },
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
          <h2>รายการประเภทของวัตถุพยาน</h2>
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <ButtonAntd
            type="primary"
            onClick={() => navigate("/inves/manage-type-evidence/create")}
          >
            เพิ่ม
          </ButtonAntd>
        </Grid>
        <DataGrid
          rows={
            items
              ? items?.map((e, index) => ({
                  ...e,
                  id: e.type_e_id,
                  index: index + 1,
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
    </div>
  );
};

export default ListTypeEvidence;
