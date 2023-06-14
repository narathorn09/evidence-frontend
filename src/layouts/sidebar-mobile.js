import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, theme, Drawer as DrawerAnt } from "antd";
import { getItemsNav } from "./items-navigate/get-item-nav";

const { useToken } = theme;
const items = getItemsNav();

const SidebarMobile = ({ navClose, isNavOpen }) => {
  const { token } = useToken();

  const location = useLocation();

  return (
    <DrawerAnt
      title=" "
      placement="right"
      closable={false}
      onClose={navClose}
      open={isNavOpen}
      key="right"
      style={{
        backgroundColor: token.colorPrimary,
      }}
      width={"70vw"}
    >
      <Menu theme="dark" mode="inline">
        {items.map((item) => (
          <Menu.Item
            onClick={navClose}
            key={item.key}
            icon={item.icon}
            style={
              location?.pathname === item.link
                ? {
                    backgroundColor: "rgba(255,255,255,0.3)",
                    color: "#ffffff",
                  }
                : {}
            }
          >
            <Link to={item.link}>{item.label}</Link>
          </Menu.Item>
        ))}
      </Menu>
    </DrawerAnt>
  );
};

export default SidebarMobile;
