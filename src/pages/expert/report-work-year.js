import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, Grid } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { useAuth } from "../../contexts/auth-context";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import { Select } from "antd";
import dayjs from "dayjs";
import NoDataUi from "../../components/no-data";

const ReportWorkOfExpertYear = () => {
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const [items, setItems] = useState([]);
  const [expertId, setExpertId] = useState(null);
  const [year, setYear] = useState(null);
  const [labelYear, setLabelYear] = useState([]);

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
  }, [expertId]);

  useEffect(() => {
    const data = items.map((item) => {
      return  dayjs(item.case_save_date).format("DD-MM-YYYY").split("-")[2];
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
      headerName: "เดือน",
      width: 380,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => {
        return params?.row?.case_save_date
          ? dayjs(params?.row?.case_save_date).format("MMMM")
          : null;
      },
      renderCell: (params) => {
        return params?.value || "";
      },
    },
    {
      field: "count_case",
      headerName: "จำนวนคดีทั้งหมด",
      width: 325,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
    {
      field: "count_evidence",
      headerName: "จำนวนวัตถุพยานทั้งหมด",
      width: 325,
      align: "center",
      headerAlign: "center",
      headerClassName: "super-app-theme--header",
    },
  ];

  const handleYearChange = (i, obj) => {
    setYear(obj?.value || null);
    console.log(obj?.value);
  };

  let totalEvidenceCount = 0;
  let totalCaseCount = 0;
  const monthCounts = {};
  const eCounts = {};

  if (items) {
    items.forEach((e) => {
      let check = false;
      const itemMonth = dayjs(e.case_save_date).format("DD-MM-YYYY").split("-")[1];
      const itemYear = dayjs(e.case_save_date).format("DD-MM-YYYY").split("-")[2];
      const checkClosedCase = e.case_status === "2";

      if (checkClosedCase) {
        if (!year || itemYear === year) {
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
            console.log("evidenceCount", evidenceCount);
  
            if (itemMonth in monthCounts) {
              monthCounts[itemMonth] += 1;
              eCounts[itemMonth] += evidenceCount;
              // console.log("evidenceCount", itemMonth,evidenceCount);
            } else {
              monthCounts[itemMonth] = 1;
              eCounts[itemMonth] = 1;
            }
          }
        }
      }
    });
  }

  const totalEvidenceRow = {
    id: "totalEvidenceRow",
    count_evidence: totalEvidenceCount,
    index: "รวม",
    case_save_date: null,
    count_case: totalCaseCount,
  };

  const filteredItems = items.filter((e) => {
    const itemYear = dayjs(e.case_save_date).format("DD-MM-YYYY").split("-")[2];
    const checkClosedCase = e.case_status === "2";

    if(checkClosedCase){
      return !year || itemYear === year;
    }else{
      return (null);
    }
    
  });

  const rows = filteredItems
    ? filteredItems
        .map((e, index, array) => ({
          ...e,
          id: e.case_id,
          index: index + 1,
        }))
        .filter(
          (e, index, array) =>
            index ===
            array.findIndex(
              (item) =>
              dayjs(item.case_save_date).format("DD-MM-YYYY").split("-")[1] ===
              dayjs(e.case_save_date).format("DD-MM-YYYY").split("-")[1]
            )
        )
        .map((e, newIndex) => ({
          ...e,
          index: newIndex + 1,
          count_case: monthCounts[dayjs(e.case_save_date).format("DD-MM-YYYY").split("-")[1]],
          count_evidence: eCounts[dayjs(e.case_save_date).format("DD-MM-YYYY").split("-")[1]],
        }))
        .concat(totalEvidenceRow)
    : [];

  const csvOptions = {
    fileName: "รายงานสรุปผลในรอบปี",
    utf8WithBom: true,
    fields: [
      "index",
      "case_save_date",
      "count_case",
      "count_evidence",
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
        <title>รายงานสรุปผล - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "รายงานสรุปผล" },
          { title: "รายงานสรุปผลในรอบปี" },
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
          <h2>รายงานสรุปผลในรอบปี</h2>
        </Grid>
        <Grid sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
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
            // defaultValue={"ทุกปี"}
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

export default ReportWorkOfExpertYear;
