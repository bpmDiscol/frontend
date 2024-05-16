import React from "react";
import "./menu_contextual.css";
import InnerMenu, { MenuData } from "./innerMenu";

type MenuT = {
  children: React.ReactElement;
  menuData: MenuData[];
  itemId: number;
};
type AncholEl = {
  mouseX: number;
  mouseY: number;
};

export default function MenuContextual({ children, menuData, itemId }: MenuT) {
  const [anchorEl, setAnchorEl] = React.useState<AncholEl | null>(null);

  // React.useEffect(() => {
  //   document.addEventListener("click", () => setAnchorEl(null));
  //   return document.removeEventListener("click", () => setAnchorEl(null));
  // }, []);

  React.useEffect(() => {
    const menu = document.getElementById("context-menu-" + itemId);
    if (anchorEl) {
      menu?.style.setProperty("display", "block");
      menu?.style.setProperty("left", anchorEl.mouseX - 10 + "px");
      menu?.style.setProperty("top", anchorEl.mouseY - 10 + "px");
    } else {
      menu?.style.setProperty("display", "none");
    }
  }, [anchorEl]);

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    setAnchorEl(
      anchorEl === null
        ? {
            mouseX: e.clientX + 2,
            mouseY: e.clientY - 6,
          }
        : null
    );
  }

  return (
    <React.Fragment>
      <div onClick={(e) => handleClick(e)}>{children}</div>
      <div
        id={"context-menu-" + itemId}
        className="context-menu"
        onMouseLeave={() => setAnchorEl(null)}
      >
        {menuData && <InnerMenu menuData={menuData} />}
      </div>
    </React.Fragment>
  );
}
