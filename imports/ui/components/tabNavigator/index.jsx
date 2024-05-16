import React, { Children } from "react";
import "./tabNavigator.css";

export default function TabNavigator({ children }) {
  const [tabStyles, setTabsStyles] = React.useState("");
  React.useEffect(() => {
    const childrenCount = Children.count(children);
    document.documentElement.style.setProperty(
      `--tabs-width-multiplier`,
      `${childrenCount}`
    );
    let tabsStyles = "";
    Children.forEach(children, (_, index) => {
      tabsStyles += `#tab${index+1} > a {
        --tabs-position: ${index};
      }`;
    });
    setTabsStyles(tabsStyles);
  }, []);
  return (
    <div className="tabs">
      <style>{tabStyles}</style>
      <div className="tab-container">
        {Children.map(children, (child, index) => {
          return (
            <div id={`tab${index + 1}`} className="tab">
              <a href={`#tab${index + 1}`}>{child.props.title}</a>
              <div className="tab-content">{child}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
