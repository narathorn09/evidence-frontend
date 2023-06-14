import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout as LayoutAnt, Menu } from "antd";
import { getItemsNav } from "./items-navigate/get-item-nav";
import { CaretRightOutlined } from "@ant-design/icons";

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
      <Menu
        className="p-3"
        theme="dark"
        mode="inline"
        // onOpenChange={() => "G1-child2"}
        forceSubMenuRender
        defaultOpenKeys={["G1"]}
        defaultSelectedKeys={["G1-child1"] || ["G1"]}
      >
        {items.map((item) =>
          item.childItems ? (
            <Menu.SubMenu key={item.key} title={item.title} icon={item.icon}>
              {item.childItems.map((subItem) => {
                let pathNav = new RegExp("^" + subItem.linkP, "i");
                let result = location?.pathname.match(pathNav);

                console.log("result", result?.[0]);
                return (
                  <Menu.Item
                    key={subItem.key} // Unique key for each subItem
                    // icon={<CaretRightOutlined />}/
                    onClick={() => navigate(subItem.link)}
                    style={
                      result
                        ? {
                            backgroundColor: "rgba(255,255,255,0.3)",
                            color: "#ffffff",

                            // zIndex: 1,
                          }
                        : {}
                    }
                  >
                    {subItem.label}
                  </Menu.Item>
                );
              })}
            </Menu.SubMenu>
          ) : (
            <Menu.Item
              key={item.key} // Unique key for each item
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
          )
        )}
        <Menu.Divider />
      </Menu>
    </Sider>
  );
};

export default SidebarDesktop;

// <Menu mode="inline">
//   <SubMenu title="Group 1">
// <Menu.ItemGroup title="Item Group 1">
//       <Menu.Item key="1">Item 1</Menu.Item>
//       <Menu.Item key="2">Item 2</Menu.Item>
//     </Menu.ItemGroup>
//     <Menu.ItemGroup title="Item Group 2">
//       <Menu.Item key="3">Item 3</Menu.Item>
//       <Menu.Item key="4">Item 4</Menu.Item>
//     </Menu.ItemGroup>
//   </SubMenu>
// </Menu>;
