import Icon, {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { PeopleAlt, Workspaces } from "@mui/icons-material";

export const itemAdmin = [
  {
    key: "G1",
    title: "จัดการผู้ใช้",
    icon: <PeopleAlt style={{ fontSize: 20 }} />,
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
        link: "/user-management/commmander/list",
        linkP: "/user-management/commmander/",
      },
      {
        key: "G1-child3",
        label: "ผู้กำกับ",
        link: "/user-management/directer/list",
        linkP: "/user-management/directer/",
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
      // {
      //   key: "G1-child6",
      //   label: "ผู้ดูแลระบบ",
      //   link: "/user-management/admin/list",
      //   linkP: "/user-management/admin/",
      // },
      // {
      //   key: "G1-child7",
      //   label: "ผู้การ",
      //   link: "/user-management/commmander/list",
      //   linkP: "/user-management/commmander/",
      // },
      // {
      //   key: "G1-child8",
      //   label: "ผู้กำกับ",
      //   link: "/user-management/directer/list",
      //   linkP: "/user-management/directer/",
      // },
      // {
      //   key: "G1-child9",
      //   label: "พนง. ตรวจสถานที่เกิดเหตุ",
      //   link: "/user-management/scene-investigator/list",
      //   linkP: "/user-management/scene-investigator/",
      // },
      // {
      //   key: "G1-child10",
      //   label: "ผู้ชำนาญการ",
      //   link: "/user-management/expert/list",
      //   linkP: "/user-management/expert/",
      // },

      // {
      //   key: "G1-child11",
      //   label: "ผู้ดูแลระบบ",
      //   link: "/user-management/admin/list",
      //   linkP: "/user-management/admin/",
      // },
      // {
      //   key: "G1-child12",
      //   label: "ผู้การ",
      //   link: "/user-management/commmander/list",
      //   linkP: "/user-management/commmander/",
      // },
      // {
      //   key: "G1-child13",
      //   label: "ผู้กำกับ",
      //   link: "/user-management/directer/list",
      //   linkP: "/user-management/directer/",
      // },
      // {
      //   key: "G1-child14",
      //   label: "พนง. ตรวจสถานที่เกิดเหตุ",
      //   link: "/user-management/scene-investigator/list",
      //   linkP: "/user-management/scene-investigator/",
      // },
      // {
      //   key: "G1-child15",
      //   label: "ผู้ชำนาญการ",
      //   link: "/user-management/expert/list",
      //   linkP: "/user-management/expert/",
      // },
      // {
      //   key: "G1-child16",
      //   label: "ผู้ชำนาญการ",
      //   link: "/user-management/expert/list",
      //   linkP: "/user-management/expert/",
      // },

      // {
      //   key: "G1-child17",
      //   label: "ผู้ดูแลระบบ",
      //   link: "/user-management/admin/list",
      //   linkP: "/user-management/admin/",
      // },
      // {
      //   key: "G1-child18",
      //   label: "ผู้การ",
      //   link: "/user-management/commmander/list",
      //   linkP: "/user-management/commmander/",
      // },
      // {
      //   key: "G1-child19",
      //   label: "ผู้กำกับ",
      //   link: "/user-management/directer/list",
      //   linkP: "/user-management/directer/",
      // },
      // {
      //   key: "G1-child20",
      //   label: "พนง. ตรวจสถานที่เกิดเหตุ",
      //   link: "/user-management/scene-investigator/list",
      //   linkP: "/user-management/scene-investigator/",
      // },
      // {
      //   key: "G1-child21",
      //   label: "ผู้ชำนาญการ",
      //   link: "/user-management/expert/list",
      //   linkP: "/user-management/expert/",
      // },
    ],
  },
  {
    key: "G2",
    icon: <Workspaces style={{ fontSize: 20 }} />,
    title: "จัดการกลุ่มงาน",
    childItems: [
      {
        key: "G1-child1",
        label: "กลุ่มงาน",
        link: "/admin/ist",
        linkP: "/admin/",
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
