import React from "react";
import { Grid, GridSize, List, ListItem } from "@mui/material";
import styles from "./display-cards.module.scss";

interface DisplayCards<T> {
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  viewMode: "grid" | "list";
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
}

function DisplayCards<T>({
  items,
  renderCard,
  viewMode,
  xs = 12,
  sm = 6,
  md = 4,
  lg = 3,
  xl = 3,
}: DisplayCards<T>) {
  if (viewMode === "list") {
    return (
      <List className={styles.rtlList}>
        {items.map((item, index) => (
          <ListItem key={index} disablePadding>
            {renderCard(item, index)}
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <Grid className={styles.rtlGrid} container spacing={3}>
      {items.map((item, index) => (
        <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={index}>
          {renderCard(item, index)}
        </Grid>
      ))}
    </Grid>
  );
}

export default DisplayCards;
