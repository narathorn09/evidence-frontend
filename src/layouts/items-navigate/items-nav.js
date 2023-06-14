import Icon, {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  TeamOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

// import { LuUserCog } from "react-icons/lu";

// const LuUserCogIcon = (props) => (
//   <Icon
//     component={LuUserCog}
//     {...props}
//     // type="message"
//     style={{ fontSize: "26px"}}
//     theme="outlined"
//   />
// );

export const itemAdmin = [
  {
    key: "G1",
    title: "จัดการผู้ใช้",
    icon: <TeamOutlined />,
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
    ],
  },
  {
    key: "G2",
    icon: <ApartmentOutlined />,
    label: "จัดการกลุ่มงาน",
    link: "/user-manage/456",
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
