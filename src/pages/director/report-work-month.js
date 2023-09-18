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
import { useAuth } from "../../contexts/auth-context";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import {  Select } from "antd";
import dayjs from "dayjs";
import NoDataUi from "../../components/no-data";

const ReportWorkOfDirectorMonth = () => {
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const [items, setItems] = useState([]);
  const [DirectorId, setDirectorId] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [labelYear, setLabelYear] = useState([]);

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

  useEffect(() => {
    const data = items.map((item) => {
      return dayjs(item.case_save_date).format("DD-MM-YYYY").split("-")[2];
    });

    const years = data.map((dateString) => {
      return dateString.substring(0, 4);
    });

    const uniqueYears = [...new Set(years)];

    const labelYear = uniqueYears.map((year) => ({
      value: year,
      label: year,
    }));

    setLabelYear(labelYear);
  }, [items]);

  console.log("labelYear", labelYear);

  const columns = [
    {
      field: "index",
      headerName: "#",
      width: 120,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "case_save_date",
      headerName: "วันที่ลงบันทึกคดี",
      width: 250,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => {
        return params?.row?.case_save_date
          ? dayjs(params?.row?.case_save_date).format("DD-MMMM-YYYY")
          : null;
      },
      renderCell: (params) => {
        return params?.value || "";
      }
    },
    {
      field: "case_type",
      headerName: "ประเภทของคดี",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "case_numboko",
      headerName: "หมายเลข บก.",
      width: 200,
      headerClassName: "super-app-theme--header",
    },

    {
      field: "countEvidence",
      headerName: "จำนวนวัตถุพยานทั้งหมด",
      width: 200,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
      renderCell: (params) => {
        const countEvidenceAll = params.row?.evidence_list
          ?.map((row) =>
            row.evidence_factor?.filter((itemFactor) => itemFactor)
          )
          .flat().length;
        return countEvidenceAll;
      },
    },
  ];

  const handleMonthChange = (i, obj) => {
    setMonth(obj?.value || null);
    console.log(obj?.value);
  };

  const handleYearChange = (i, obj) => {
    setYear(obj?.value || null);
    console.log(obj?.value);
  };

  let totalEvidenceCount = 0;
  let totalCaseCount = 0;

  if (items) {
    items.forEach((e) => {
      let check = false;
      
      const itemMonth = dayjs(e.case_save_date).format("DD-MM-YYYY").split("-")[1];
      const itemYear = dayjs(e.case_save_date).format("DD-MM-YYYY").split("-")[2];
      const checkClosedCase = e.case_status === "2";
      
      if (checkClosedCase) {
        if (
          (!month && !year) ||
          (itemMonth === month && itemYear === year) ||
          (itemMonth === month && !year)
        ) {
          check = e.evidence_list.some((evidence) =>
            evidence.evidence_factor.every(
              (factor) =>
                factor.assign_exp_status !== "0" &&
                factor.assign_exp_close_work === "1"
            )
          );

          if (check) {
            const evidenceCount = e.evidence_list
              .map((row) =>
                row.evidence_factor?.filter((itemFactor) => itemFactor)
              )
              .flat().length;
            totalEvidenceCount += evidenceCount;
            totalCaseCount += 1;
          }
        }
      }
    });
  }

  const totalEvidenceRow = {
    id: "totalEvidenceRow",
    countEvidence: totalEvidenceCount,
    index: "รวม",
    case_save_date: null,
    case_numboko: totalCaseCount,
  };

  // Filter items based on month and year
  const filteredItems = items.filter((e) => {

    const itemMonth = dayjs(e.case_save_date).format("DD-MM-YYYY").split("-")[1];
    const itemYear = dayjs(e.case_save_date).format("DD-MM-YYYY").split("-")[2];
    const checkClosedCase = e.case_status === "2"

    if(checkClosedCase ){
      return (
        (!month && !year) ||
        (itemMonth === month && itemYear === year) ||
        (itemMonth === month && !year)
      ) 
    }else{
      return(null);
    }

  });

  // Add the total evidence row to the filtered items
  const rows = filteredItems
    ? filteredItems
    // .sort((a, b) => {
    //   // Sort by case_type in ascending order (modify as needed)
    //   return a.case_type.localeCompare(b.case_type);
    // })
        .map((e, index) => ({
          ...e,
          id: e.case_id,
          index: index + 1,
        }))
        .concat(totalEvidenceRow)
    : [];

  const csvOptions = {
    fileName: "รายงานสรุปผลในรอบเดือน",
    utf8WithBom: true,
    fields: [
      "index",
      "case_save_date",
      "case_numboko",
      "case_type",
      "countEvidence",
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
          <h2>รายงานสรุปผลในรอบเดือน</h2>
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
          <Select
            allowClear
            showSearch
            style={{
              width: 200,
              marginRight: "20px",
            }}
            placeholder="เลือกเดือน"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            onChange={handleMonthChange}
            value={month}
            options={[
              {
                value: "01",
                label: "มกราคม",
              },
              {
                value: "02",
                label: "กุมภาพันธ์",
              },
              {
                value: "03",
                label: "มีนาคม",
              },
              {
                value: "04",
                label: "เมษายน",
              },
              {
                value: "05",
                label: "พฤษภาคม",
              },
              {
                value: "06",
                label: "มิถุนายน",
              },
              {
                value: "07",
                label: "กรกฎาคม",
              },
              {
                value: "08",
                label: "สิงหาคม",
              },
              {
                value: "09",
                label: "กันยายน",
              },
              {
                value: "10",
                label: "ตุลาคม",
              },
              {
                value: "11",
                label: "พฤศจิกายน",
              },
              {
                value: "12",
                label: "ธันวาคม",
              },
            ]}
          />

          <Select
            allowClear
            showSearch
            style={{
              width: 200,
            }}
            placeholder="เลือกปี"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={handleYearChange}
            value={year}
            options={labelYear}
          />
        </Grid>
        <DataGrid
          disableColumnMenu={true}
          rows={rows}
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

export default ReportWorkOfDirectorMonth;
