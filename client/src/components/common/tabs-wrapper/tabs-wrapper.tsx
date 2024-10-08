import React, { useState, useRef, useEffect } from "react";
import styles from "./tabs-wrapper.module.scss";

interface TabItem {
  name: string;
  component: React.ReactNode;
  icon?: React.ReactNode; // Optional icon
}

interface TabsWrapperProps {
  tabs: TabItem[];
}

const TabsWrapper: React.FC<TabsWrapperProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setIndicatorStyle({
        left: `${activeTabElement.offsetLeft}px`,
        width: `${activeTabElement.offsetWidth - 20}px`,
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

export default TabsWrapper;
