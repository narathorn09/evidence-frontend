import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button, IconButton, Grid, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
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
import { Button as ButtonAntd, Select } from "antd";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const ReportWorkOfExpertMonth = () => {
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [expertId, setExpertId] = useState(null);
  const [month, setMonth] = useState(null);
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
  }, [expertId, refetch]);

  useEffect(() => {
    const data = items.map((item) => {
      return item.case_save_date;
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
      headerName: "วันที่ลงบันทึกคดี",
      width: 250,
      headerClassName: "super-app-theme--header",
      valueGetter: (params) => {
        return params?.row?.case_save_date
          ? dayjs(params?.row?.case_save_date).format("DD-MM-YYYY")
          : null;
      },
      renderCell: (params) => {
        return params?.value || "";
      }
    },
    {
      field: "case_numboko",
      headerName: "หมายเลข บก.",
      width: 200,
      headerClassName: "super-app-theme--header",
    },
    {
      field: "case_type",
      headerName: "ประเภทของคดี",
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
      const itemMonth = e.case_save_date.split("-")[1];
      const itemYear = e.case_save_date.split("-")[0];

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
    const itemMonth = e.case_save_date.split("-")[1];
    const itemYear = e.case_save_date.split("-")[0];

    return (
      (!month && !year) ||
      (itemMonth === month && itemYear === year) ||
      (itemMonth === month && !year)
    );
  });

  // Add the total evidence row to the filtered items
  const rows = filteredItems
    ? filteredItems
        .map((e, index) => ({
          ...e,
          id: e.case_id,
          index: index + 1,
        }))
        .concat(totalEvidenceRow)
    : [];

  const csvOptions = {
    fileName: "รายงานสรุปผลการตรวจ",
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

  // function CustomFooter({ rows }) {
  //   // Calculate the sum of the "amount" column
  //   // const sum = rows.reduce((total, row) => total + parseFloat(row.amount || 0), 0).toFixed(2);

  //   return (
  //     <div>
  //       {/* You can customize the footer layout as needed */}
  //       <div>Total Amount: 52</div>
  //     </div>
  //   );
  // }
  const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .ant-empty-img-1": {
      fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
    },
    "& .ant-empty-img-2": {
      fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
    },
    "& .ant-empty-img-3": {
      fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
    },
    "& .ant-empty-img-4": {
      fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
    },
    "& .ant-empty-img-5": {
      fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
      fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
    },
  }));

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>ไม่มีข้อมูล</Box>
      </StyledGridOverlay>
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
            // filterSort={(optionA, optionB) =>
            //   (optionA?.label ?? "")
            //     .toLowerCase()
            //     .localeCompare((optionB?.label ?? "").toLowerCase())
            // }
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
          // rows={
          //   items
          //     ? items
          //         ?.map((e) => {
          //           let check = false;
          //           const itemMonth = e.case_save_date.split("-")[1];
          //           const itemYear = e.case_save_date.split("-")[0];

          //           if (
          //             (!month && !year) ||
          //             (itemMonth === month && itemYear === year) ||
          //             (itemMonth === month && !year)
          //             // (itemMonth === month) ||
          //             // (itemYear === year) ||
          //             // (itemYear === year && !month) ||
          //           ) {
          //             const check = e.evidence_list.some((evidence) =>
          //               evidence.evidence_factor.every(
          //                 (factor) =>
          //                   factor.assign_exp_status !== "0" &&
          //                   factor.assign_exp_close_work === "1"
          //               )
          //             );

          //             if (check) {
          //               return {
          //                 ...e,
          //                 id: e.case_id,
          //               };
          //             }
          //           }

          //           return null; // Return null for non-matching months
          //         })
          //         .filter((e) => e !== null) // Filter out null values
          //         .map((e, index) => ({
          //           ...e,
          //           id: e.case_id,
          //           index: index + 1, // Use the filtered index as the sequence
          //         }))
          //     : []
          // }
          rows={rows}
          columns={columns}
          slots={{
            toolbar: CustomToolbar,
            noRowsOverlay: CustomNoRowsOverlay,
            // footer: (props) => <CustomFooter rows={props.rows} />,
          }}
          sx={{ borderRadius: "8px", height: "460px" }}
        />
      </Grid>
    </div>
  );
};

export default ReportWorkOfExpertMonth;
