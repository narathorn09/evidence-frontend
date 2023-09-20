import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import CountUp from "react-countup";
import { Box, Grid, Card, IconButton } from "@mui/material";
import { Statistic } from "antd";
import useAxiosPrivate from "../../hook/use-axios-private";
import { Groups, Workspaces } from "@mui/icons-material";
import { OpenInNew } from "@mui/icons-material";
import { PieChart, pieArcClasses } from "@mui/x-charts/PieChart";
import { Link } from "react-router-dom";

const HomeAdmin = () => {
  const requestPrivate = useAxiosPrivate();
  const [countMember, setCountMember] = useState([
    { countTotal: 0 },
    { title: "ผู้ดูแลระบบ", count: 5 },
    { title: "ผู้การ", count: 0 },
    { title: "ผู้กำกับ", count: 0 },
    { title: "พนง. ตรวจสนาที่เกิดเหตุ", count: 0 },
    { title: "ผู้ชำนาญการ", count: 0 },
  ]);
  const [countGroup, setCountGroup] = useState(0);

  const formatter = (value) => <CountUp end={value} separator="," />;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalMember = await requestPrivate.get("/countMember");
        const totalGroup = await requestPrivate.get("/countGroup");
        const {
          countMem,
          countAdmin,
          countCom,
          countDirec,
          countInves,
          countExpert,
        } = totalMember.data;

        setCountMember({
          countMem: countMem,
          countAdmin: countAdmin,
          countCom: countCom,
          countDirec: countDirec,
          countInves: countInves,
          countExpert: countExpert,
        });
        setCountGroup(totalGroup.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const colors = ["#3AB0FF", "#FFB562", "#64C2A6", "#E6F69D", "#F87474", "#99F2ED"];

  // const colors = ["#E6F69D", "#64C2A6", "#2D87BB"];

  const data = [
    {
      id: 0,
      value: countMember.countMem,
      label: "จำนวนผู้ใช้ทั้งหมด",
      color: colors[0],
      path: null,
    },
    {
      id: 1,
      value: countMember.countAdmin,
      label: "ผู้ดูแลระบบ",
      color: colors[1],
      path: "/user-management/admin/list",
    },
    {
      id: 2,
      value: countMember?.countCom,
      label: "ผู้การ",
      color: colors[2],
      path: "/user-management/commander/list",
    },
    {
      id: 3,
      value: countMember?.countDirec,
      label: "ผู้กำกับ",
      color: colors[3],
      path: "/user-management/director/list",
    },

    {
      id: 4,
      value: countMember?.countInves,
      label: "พนง. ตรวจสถานที่เกิดเหตุ",
      color: colors[4],
      path: "/user-management/scene-investigator/list",
    },
    {
      id: 5,
      value: countMember?.countExpert,
      label: "ผู้ชำนาญการ",
      color: colors[5],
      path: "/user-management/expert/list",
    },
  ];
  const style = {
    padding: 5,
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "80px",
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
              <Grid item xs={12} sm={12} md={index === 0 ? 12 : 2.4}>
                <Card
                  sx={{
                    ...style,
                    background: item.color,
                  }}
                >
                  <h4 style={{ textAlign: "center" }}>{item.label}</h4>
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
          <Grid item xs={12} sm={12} md={12} sx={{mt: 3}}>
            <Card
              sx={{
                ...style,
                background: "#8EA7E9"
              }}
            >
              <h4 style={{ textAlign: "center" }}>จำนวนกลุ่มงานทั้งหมด</h4>
              <h2 style={{ ...styleText }}>{formatter(countGroup)}</h2>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "right",
                  height: "30px",
                  width: "100%",
                }}
              >
                <IconButton component={Link} to="/group-management/list">
                  <OpenInNew />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default HomeAdmin;
