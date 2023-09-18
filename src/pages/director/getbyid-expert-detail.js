import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Form, Divider, Image, Typography } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import { Edit, AccountCircle, Key } from "@mui/icons-material";
import { Box, Grid, Card } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import BreadcrumbLayout from "../../components/breadcrumbs";
import useAxiosPrivate from "../../hook/use-axios-private";
import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");

const GetDetailExpertById = () => {
  const params = useParams();
  const requestPrivate = useAxiosPrivate();
  const [item, setItem] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestPrivate.get(
          `/detailExpertById/${params?.expertId}`
        );
        setItem(response?.data);
      } catch (err) {
        alert(`เกิดข้อผิดพลาดในการดึงรายการคดี : ${err}`);
      }
    };

    fetchData();
  }, [params?.expertId]);

  const tailLayout = {
    wrapperCol: {
      offset: 4,
      span: 20,
    },
  };

  return (
    <div>
      <Helmet>
        <title>Get Case - Forensic Science</title>
      </Helmet>
      <BreadcrumbLayout
        pages={[
          { title: "จัดการคดี" },
          {
            title: "รายชื่อผู้ชำนาญการ",
            path: "/director/manage-expert",
          },
          { title: `${item?.name}` },
        ]}
      />
      <Box sx={{ width: "100%", height: "100%" }}>
        <Card sx={{ padding: 4, pt: 2, pb: 2, mt: 4, borderRadius: "8px" }}>
          <Grid
            sx={{
              textAlign: "left",
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <AccountCircle
              sx={{ fontSize: "40px", color: "var(--color--main)", mr: 2 }}
            />
            <h2 style={{ color: "var(--color--main)" }}>{item?.name}</h2>
          </Grid>
          <Form
            form={form}
            size="middle "
            name="basic"
            labelCol={{
              span: 5,
            }}
            labelAlign="left"
            wrapperCol={{
              span: 19,
            }}
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            autoComplete="off"
          >
            <Form.Item
              label={
                <span style={{ fontWeight: "bold" }}>จำนวนคดีที่รับผิดชอบ</span>
              }
              name="case_numboko"
            >
              <Typography>{item?.count?.numCase}</Typography>
            </Form.Item>
            <Form.Item
              label={
                <span style={{ fontWeight: "bold" }}>
                  จำนวนวัตถุพยานที่ตรวจแล้ว
                </span>
              }
              name="case_numboko"
            >
              <Typography>{item?.count?.numEvidenceHaveResult}</Typography>
            </Form.Item>
            <Form.Item
              label={
                <span style={{ fontWeight: "bold" }}>
                  จำนวนวัตถุพยานที่ยังไม่ตรวจ
                </span>
              }
              name="case_numboko"
            >
              <Typography>{item?.count?.numEvidenceNoResult}</Typography>
            </Form.Item>
          </Form>
        </Card>
      </Box>
    </div>
  );
};

export default GetDetailExpertById;
