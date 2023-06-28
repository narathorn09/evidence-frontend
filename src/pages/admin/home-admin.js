import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Box, Grid, Card } from "@mui/material";
import { Statistic } from "antd";
import useAxiosPrivate from "../../hook/use-axios-private";
import { Groups, Workspaces } from "@mui/icons-material";

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

        setCountMember([
          { countTotal: countMem },
          { title: "ผู้ดูแลระบบ", count: countAdmin },
          { title: "ผู้การ", count: countCom },
          { title: "ผู้กำกับ", count: countDirec },
          { title: "พนง. ตรวจสนาที่เกิดเหตุ", count: countInves },
          { title: "ผู้ชำนาญการ", count: countExpert },
        ]);
        setCountGroup(totalGroup.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Grid container direction={"row"} columnGap={4} rowGap={4}>
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={5.6}
          component={Card}
          sx={{
            padding: 10,
            borderRadius: "8px",
            // boxShadow: "5px 5px 5px #f0f0f0, -5px -5px 5px #fbfbfb",
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "300px",
            }}
          >
            <Groups sx={{ fontSize: "100px", color: "var(--color--main)" }} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Statistic
              title="จำนวนผู้ใช้งานทั้งหมดในระบบ"
              value={countMember[0]?.countTotal}
              precision={2}
              formatter={formatter}
              valueStyle={{ textAlign: "center", color: "var(--color--main)" }}
            />
          </Grid>
          <Grid
            item
            // container
            direction={"column"}
            xs={12}
            sm={12}
            md={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: { xs: "center", sx: "center", md: "center" },
            }}
          >
            {countMember.map((item, index) => {
              if (index === 0) return;
              return (
                <Statistic
                  key={index}
                  title={<Box sx={{ fontSize: "12px" }}>{item.title}</Box>}
                  value={item.count}
                  precision={2}
                  formatter={formatter}
                  valueStyle={{ fontSize: "14px", color: "var(--color--main)" }}
                  style={{ width: "100%", marginTop: "10px" }}
                />
              );
            })}
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs={12}
          sm={12}
          md={5.6}
          component={Card}
          //   columnGap={5}
          //   direction={"column"}
          sx={{
            padding: 10,
            borderRadius: "8px",
            // boxShadow: "5px 5px 5px #f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "300px",
            }}
          >
            <Workspaces
              sx={{ fontSize: "100px", color: "var(--color--main)" }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Statistic
              title="จำนวนกลุ่มงานทั้งหมดในระบบ"
              value={countGroup}
              precision={2}
              formatter={formatter}
              valueStyle={{ textAlign: "center", color: "var(--color--main)" }}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomeAdmin;
