import Icon, {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { PeopleAlt, Workspaces,Home } from "@mui/icons-material";

export const itemAdmin = [
  {
    key: "G0",
    label: "หน้าแรก",
    icon: <Home sx={{ fontSize: "20px" }} />,
    link: "/",
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
    icon: <Workspaces sx={{ fontSize: "20px" }} />,
    label: "จัดการกลุ่มงาน",
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
    key: "1",
    icon: <UserOutlined />,
    label: "user",
    link: "/",
  },
  {
    key: "2",
    icon: <VideoCameraOutlined />,
    label: "nav 2asd",
    link: "/2",
  },
  {
    key: "3",
    icon: <UploadOutlined />,
    label: "nav 3asd",
    link: "/3",
  },
];

export const itemSceneInvestigator = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: "teest",
    link: "/",
  },
];

export const itemDirector = [];
export const itemExpert = [];
