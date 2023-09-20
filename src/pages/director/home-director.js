import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CountUp from "react-countup";
import { Box, Grid, Card, IconButton } from "@mui/material";
import { useAuth } from "../../contexts/auth-context";
import useAxiosPrivate from "../../hook/use-axios-private";
import { OpenInNew } from "@mui/icons-material";
import { PieChart, pieArcClasses } from "@mui/x-charts/PieChart";
import { Link } from "react-router-dom";

const HomeDirector = () => {
  const { auth } = useAuth();
  const requestPrivate = useAxiosPrivate();
  const [count, setCount] = useState({});
  const [DirectorId, setDirectorId] = useState(null);

  const formatter = (value) => <CountUp end={value} separator="," />;

  useEffect(() => {
    const data = { id: auth?.user?.id, role: auth?.user?.role };
    const fetchData = async () => {
      try {
        const response = await requestPrivate.post(`/id`, data);
        setDirectorId(() => response?.data[0]?.director_id);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงไอดี : ${err}`);
      }
    };

    fetchData();
  }, [auth?.user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/countCaseDirector/${DirectorId}`);
        if (response?.status === 200) {
          setCount(response?.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [DirectorId]);

  const colors = ["#E6F69D", "#64C2A6", "#2D87BB", "#AADEA7"];

  const data = [
    {
      id: 0,
      value: count?.countCaseAll,
      label: "จำนวนคดีทั้งหมดที่รับผิดชอบ",
      color: colors[0],
      path: null,
    },
    {
      id: 1,
      value: count?.countCaseAssign,
      label: "จำนวนคดีที่ได้รับมอบหมาย",
      color: colors[0],
      path: "/director/manage-case/list-assign/main",
    },
    {
      id: 2,
      value: count?.countCaseAccept,
      label: "จำนวนคดีที่รับมอบหมายแล้ว",
      color: colors[1],
      path: "/director/manage-case/list-accept/main",
    },
    {
      id: 3,
      value: count?.countCaseConfirm,
      label: "จำนวนคดีที่รออนุมัติงานตรวจ",
      color: colors[3],
      path: "/director/manage-case/confirm",
    },
    {
      id: 4,
      value: count?.countCaseConfirmed,
      label: "จำนวนคดีที่อนุมัติแล้ว",
      color: colors[2],
      path: "/director/manage-case/confirm",
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
              <Grid item xs={12} sm={12} md={index === 0 ? 12 : 3}>
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

export default HomeDirector;
