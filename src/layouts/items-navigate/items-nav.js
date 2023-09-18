// import Icon, {
//   UserOutlined,
//   VideoCameraOutlined,
//   UploadOutlined,
// } from "@ant-design/icons";
import {
  PeopleAlt,
  Workspaces,
  Home,
  Description,
  Work,
} from "@mui/icons-material";

export const itemAdmin = [
  {
    key: "G0",
    label: "หน้าแรก",
    icon: <Home sx={{ fontSize: "20px" }} />,
    link: "/home",
    linkP: "/home",
  },
  {
    key: "G1",
    label: "จัดการผู้ใช้",
    icon: <PeopleAlt sx={{ fontSize: "20px" }} />,
    childItems: [
      {
        key: "G1-child1",
        label: "ผู้ดูแลระบบ",
        link: "/user-management/admin/list",
        linkP: "/user-management/admin/",
      },
      {
        key: "G1-child2",
        label: "ผู้การ",
        link: "/user-management/commander/list",
        linkP: "/user-management/commander/",
      },
      {
        key: "G1-child3",
        label: "ผู้กำกับ",
        link: "/user-management/director/list",
        linkP: "/user-management/director/",
      },
      {
        key: "G1-child4",
        label: "พนง. ตรวจสถานที่เกิดเหตุ",
        link: "/user-management/scene-investigator/list",
        linkP: "/user-management/scene-investigator/",
      },
      {
        key: "G1-child5",
        label: "ผู้ชำนาญการ",
        link: "/user-management/expert/list",
        linkP: "/user-management/expert/",
      },
    ],
  },
  {
    key: "G2",
    label: "จัดการกลุ่มงาน",
    icon: <Workspaces sx={{ fontSize: "20px" }} />,
    childItems: [
      {
        key: "G2-child1",
        label: "กลุ่มงาน",
        link: "/group-management/list",
        linkP: "/group-management/",
      },
    ],
  },
];

export const itemCommander = [
  {
    key: "G0",
    label: "หน้าแรก",
    icon: <Home sx={{ fontSize: "20px" }} />,
    link: "/home",
    linkP: "/home",
  },
];

export const itemSceneInvestigator = [
  {
    key: "G0",
    label: "หน้าแรก",
    icon: <Home sx={{ fontSize: "20px" }} />,
    link: "/home",
    linkP: "/home",
  },
  {
    key: "G1",
    label: "คดี",
    icon: <Work sx={{ fontSize: "20px" }} />,
    childItems: [
      {
        key: "G1-child1",
        label: "รายการคดี",
        link: "/inves/manage-case/list",
        linkP: "/inves/manage-case",
      },
    ],
  },
  {
    key: "G2",
    label: "จัดการประเภทวัตถุพยาน",
    icon: <Workspaces sx={{ fontSize: "20px" }} />,
    link: "/inves/manage-type-evidence/list",
    linkP: "/inves/manage-type-evidence",
  },
  {
    key: "G3",
    label: "รายงานสรุปผล",
    icon: <Description sx={{ fontSize: "20px" }} />,
    link: "/inves/manage-report",
    linkP: "/inves/manage-report",
  },
];

export const itemDirector = [
  {
    key: "G0",
    label: "หน้าแรก",
    icon: <Home sx={{ fontSize: "20px" }} />,
    link: "/home",
    linkP: "/home",
  },
  {
    key: "G1",
    label: "คดี",
    icon: <Work sx={{ fontSize: "20px" }} />,
    childItems: [
      {
        key: "G1-child1",
        label: "คดีที่ได้รับ",
        link: "/director/manage-case/list-assign/main",
        linkP: "/director/manage-case/list-assign",
      },
      {
        key: "G1-child2",
        label: "มอบหมายงานตรวจ",
        link: "/director/manage-case/list-accept/main",
        linkP: "/director/manage-case/list-accept",
      },
      {
        key: "G1-child3",
        label: "อนุมัติงานตรวจ",
        link: "/director/manage-case/confirm",
        linkP: "/director/manage-case/confirm",
      },
    ],
  },
  {
    key: "G2",
    label: "ผู้ชำนาญการ",
    icon: <PeopleAlt sx={{ fontSize: "20px" }} />,
    link: "/director/manage-expert",
    linkP: "/director/manage-expert",
  },
  {
    key: "G3",
    label: "รายงานสรุปผล",
    icon: <Description sx={{ fontSize: "20px" }} />,
    childItems: [
      {
        key: "G3-child1",
        label: "รายงานสรุปผลในรอบเดือน",
        link: "/director/manage-report/month",
        linkP: "/director/manage-report/month",
      },
      {
        key: "G3-child2",
        label: "รายงานสรุปผลในรอบปี",
        link: "/director/manage-report/year",
        linkP: "/director/manage-report/year",
      },
    ],
  },
];

export const itemExpert = [
  {
    key: "G0",
    label: "หน้าแรก",
    icon: <Home sx={{ fontSize: "20px" }} />,
    link: "/home",
    linkP: "/home",
  },
  {
    key: "G1",
    label: "งานตรวจ",
    icon: <Work sx={{ fontSize: "20px" }} />,
    childItems: [
      {
        key: "G1-child1",
        label: "งานตรวจที่ได้รับ",
        link: "/expert/manage-evidence/list-assign/main",
        linkP: "/expert/manage-evidence/list-assign",
      },
      {
        key: "G1-child2",
        label: "จัดการงานตรวจ",
        link: "/expert/manage-evidence/list-accept/main",
        linkP: "/expert/manage-evidence/list-accept",
      },
    ],
  },
  {
    key: "G2",
    label: "รายงานสรุปผล",
    icon: <Description sx={{ fontSize: "20px" }} />,
    childItems: [
      {
        key: "G2-child1",
        label: "รายงานสรุปผลในรอบเดือน",
        link: "/expert/manage-report/month",
        linkP: "/expert/manage-report/month",
      },
      {
        key: "G2-child2",
        label: "รายงานสรุปผลในรอบปี",
        link: "/expert/manage-report/year",
        linkP: "/expert/manage-report/year",
      },
    ],
  },
];
