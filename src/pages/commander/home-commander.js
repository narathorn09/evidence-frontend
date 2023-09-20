import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CountUp from "react-countup";
import { Box, Grid, Card, IconButton } from "@mui/material";
import useAxiosPrivate from "../../hook/use-axios-private";
import { OpenInNew } from "@mui/icons-material";
import { PieChart, pieArcClasses } from "@mui/x-charts/PieChart";
import { Link } from "react-router-dom";

const HomeCommander = () => {
  const requestPrivate = useAxiosPrivate();
  const [count, setCount] = useState({});
  const formatter = (value) => <CountUp end={value} separator="," />;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(`/countCaseCommander`);
        if (response?.status === 200) {
          setCount(response?.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const colors = ["#E6F69D", "#64C2A6", "#2D87BB"];

  const data = [
    {
      id: 0,
      value: count?.countCaseAll,
      label: "จำนวนคดีทั้งหมด",
      color: colors[0],
      path: null,
    },
    {
      id: 1,
      value: count?.countCaseClose,
      label: "จำนวนคดีที่ปิดแล้ว",
      color: colors[1],
      path: "/commander/manage-case/list-case-close/main",
    },
    {
      id: 2,
      value: count?.countCaseWork,
      label: "จำนวนคดีที่ดำเนินการอยู่",
      color: colors[2],
      path: "/commander/manage-case/list-case-work/main",
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
          {data.map((item) => {
            return (
              <Grid item xs={12} sm={12} md={4}>
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

export default HomeCommander;
