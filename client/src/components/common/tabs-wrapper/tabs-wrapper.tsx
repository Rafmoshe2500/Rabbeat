import React, { useState, useRef, useEffect } from "react";
import styles from "./tabs-wrapper.module.scss";

interface TabItem {
  name: string;
  component: React.ReactNode;
  icon?: React.ReactNode; // Optional icon
}

interface TabComponentProps {
  tabs: TabItem[];
}

const TabComponent: React.FC<TabComponentProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setIndicatorStyle({
        left: `${activeTabElement.offsetLeft}px`,
        width: `${activeTabElement.offsetWidth}px`,
      });
    }
  }, [activeTab]);

  return (
    <div className={styles["tab-container"]}>
      <div className={styles["tab-header"]}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`${styles["tab-button"]} ${
              index === activeTab ? styles["active"] : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.icon && <span className={styles["tab-icon"]}>{tab.icon}</span>}
            <span className={styles["tab-name"]}>{tab.name}</span>
          </button>
        ))}
        <div className={styles["tab-indicator"]} style={indicatorStyle} />
      </div>
      <div className={styles["tab-content"]}>{tabs[activeTab].component}</div>
    </div>
  );
};

export default TabComponent;