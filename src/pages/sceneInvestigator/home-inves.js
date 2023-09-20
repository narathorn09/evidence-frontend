import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CountUp from "react-countup";
import { Box, Grid, Card, IconButton } from "@mui/material";
import { useAuth } from "../../contexts/auth-context";
import useAxiosPrivate from "../../hook/use-axios-private";
import { OpenInNew } from "@mui/icons-material";
import { PieChart, pieArcClasses } from "@mui/x-charts/PieChart";
import { Link } from "react-router-dom";

const HomeInves = () => {
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const [count, setCount] = useState({});
  const [invesId, setInvesId] = useState(null);
  const [refetch, setRefetch] = useState(false);

  const formatter = (value) => <CountUp end={value} separator="," />;

  useEffect(() => {
    const data = { id: auth?.user?.id, role: auth?.user?.role };
    const fetchData = async () => {
      try {
        const response = await requestPrivate.post(`/id`, data);
        setInvesId(() => response?.data[0]?.inves_id);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงไอดี : ${err}`);
      }
    };

    fetchData();
  }, [auth?.user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/countCaseInves/${invesId}`);
        if (response?.status === 200) {
          setCount(response?.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [refetch]);

  useEffect(() => {
    const fetchData = async () => {
      await requestPrivate.get(`/caseByInvesId/${invesId}`).then((response) => {
        response?.data?.forEach(async (item) => {
          if (item.case_status !== "2") {
            let check = false;
            check = item.evidence_list.every((evidence) =>
              evidence.evidence_factor.every(
                (factor) => factor.ef_status === "3"
              )
            );
            if (check) {
              await requestPrivate.put(`/caseStatusByCaseId`, {
                case_id: item?.case_id,
                case_status: "1",
              });
              setRefetch(!refetch)
            }
          }
        });
      });
    };
    fetchData();
  }, [invesId]);

  const colors = ["#E6F69D", "#64C2A6", "#2D87BB", "#AADEA7"];

  const data = [
    {
      id: 0,
      value: count?.countCaseAll,
      label: "จำนวนคดีทั้งหมดที่รับผิดชอบ",
      color: colors[0],
      path: "/inves/manage-case/list",
    },
    {
      id: 1,
      value: count?.countCaseClose,
      label: "จำนวนคดีที่ปิดแล้ว",
      color: colors[1],
      path: "/inves/manage-case/list",
    },
    {
      id: 2,
      value: count?.countCaseFinish,
      label: "จำนวนคดีที่ดำเนินเสร็จสิ้น",
      color: colors[3],
      path: "/inves/manage-case/list",
    },
    {
      id: 3,
      value: count?.countCaseWork,
      label: "จำนวนคดีที่อยู่ระหว่างดำเนินการ",
      color: colors[2],
      path: "/inves/manage-case/list",
    },
  ];

  const style = {
    padding: 5,
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const styleText = {
    margin: 0,
  };

  return (
    <div>
      <Helmet>
        <title>หน้าแรก - Forensic Science</title>
      </Helmet>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          spacing={1}
        >
          {data.map((item, index) => {
            return (
              <Grid item xs={12} sm={12} md={index === 0 ? 12 : 4}>
                <Card
                  sx={{
                    ...style,
                    background: item.color,
                  }}
                >
                  <h4>{item.label}</h4>
                  <h2 style={{ ...styleText }}>{formatter(item.value)}</h2>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "right",
                      alignItems: "right",
                      height: "30px",
                      width: "100%",
                    }}
                  >
                    {item.path && (
                      <IconButton component={Link} to={item.path}>
                        <OpenInNew />
                      </IconButton>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}

          <Grid item xs={12} sm={12} md={12} sx={{ height: "70px" }}></Grid>

          <PieChart
            series={[
              {
                data: data.slice(1),
                highlightScope: { faded: "global", highlighted: "item" },
                faded: { innerRadius: 30, additionalRadius: -30 },
              },
            ]}
            sx={{
              [`& .${pieArcClasses.faded}`]: {
                fill: "gray",
              },

              ".MuiChartsLegend-label.css-zeh0io-MuiChartsLegend-label": {
                fontFamily: "Prompt",
              },

              marginLeft: -20,
            }}
            height={300}
            width={500}
            colors={colors}
          />
        </Grid>
      </Box>
    </div>
  );
};

export default HomeInves;
