import React from "react";
import styles from "./panel.module.css";

interface PanelProps {
  header?: string;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ header, children }) => {
  return (
    <div className={styles.panel}>
      <p className={styles.header}>{header}:</p>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Panel;
