import Icon, {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
    label: "จัดการคดี",
    icon: <Work sx={{ fontSize: "20px" }} />,
    link: "/inves/manage-case/list",
    linkP: "/inves/manage-case",
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
    label: "คดีที่ได้รับ",
    icon: <Work sx={{ fontSize: "20px" }} />,
    link: "/director/manage-case/list",
    linkP: "/director/manage-case",
  },
  {
    key: "G2",
    label: "รายงานสรุปผล",
    icon: <Description sx={{ fontSize: "20px" }} />,
    link: "/director/manage-report",
    linkP: "/director/manage-report",
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
];
