import React, { useState } from "react";
import { Grid, GridSize, List, ListItem, Pagination, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === "list" ? 10 : 16;
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(event)
    setCurrentPage(value);
  };

  const displayedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderContent = () => {
    if (viewMode === "list") {
      return (
        <List className={styles.rtlList}>
          {displayedItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              {renderCard(item, index)}
            </ListItem>
          ))}
        </List>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <Grid className={styles.rtlGrid} container spacing={3}>
            {displayedItems.map((item, index) => (
              <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={index}>
                {renderCard(item, index)}
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Box>
      {renderContent()}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          dir="rtl"
          sx={{
            '& .MuiPaginationItem-root': {
              fontFamily: 'inherit',
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default DisplayCards;