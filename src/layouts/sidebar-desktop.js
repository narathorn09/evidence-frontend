import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout as LayoutAnt, Menu } from "antd";
import { getItemsNav } from "./items-navigate/get-item-nav";

const { Sider } = LayoutAnt;
const items = getItemsNav();

const SidebarDesktop = ({ isNavOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sider
      className="fixed min-h-screen bg-main transition-all duration-300 ease"
      trigger={null}
      theme="dark"
      collapsible
      collapsed={isNavOpen}
      width={250}
      style={{
        left: 0,
        top: 85,
        zIndex: 1,
      }}
    >
      <Menu className="p-3" theme="dark" mode="inline">
        {items.map((item) => (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            style={
              location?.pathname === item.link
                ? {
                    backgroundColor: "rgba(255,255,255,0.3)",
                    color: "#ffffff",
                    zIndex: 1,
                  }
                : {}
            }
            onClick={() => navigate(item.link)}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default SidebarDesktop;
