import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout as LayoutAnt, Button as ButtonAnt } from "antd";

const { Header: HeaderAnt } = LayoutAnt;

const Header = ({ isCollapsed, navopenDesktop, navopenMobile }) => {
  const navigate = useNavigate();
  return (
    <HeaderAnt
      className="pl-0 pr-6 w-full flex items-center flex-row fixed z-2"
      style={{ height: 85, zIndex: 1 }}
    >
      <div className="flex flex-row flex-1 items-center">
        <img
          className="w-20 h-20 mt-3"
          src="/assets/micro-icon.png"
          alt="logo"
        />
        <h4 className="text-white xs:hidden md:flex">Forensic Science</h4>
        <div className="xs:hidden md:flex">
          <ButtonAnt
            className="w-8 h-8 text-white bg-main ml-8 hover:bg-white"
            icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={navopenDesktop}
          />
        </div>
      </div>
      <ButtonAnt icon={<LogoutOutlined />} onClick={() => navigate("/login")}>
        Logout
      </ButtonAnt>
      <div className="xs:flex md:hidden">
        <ButtonAnt
          className="w-8 h-8 text-white bg-main ml-7 hover:bg-white"
          icon={isCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          onClick={navopenMobile}
        />
      </div>
    </HeaderAnt>
  );
};

export default Header;
