import React, { useState, useEffect } from "react";
import { Grid, GridSize, List, ListItem, Pagination, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

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

type Direction = 'forward' | 'backward' | null;

const variants = {
  enter: (direction: Direction) => ({
    x: direction === 'forward' ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: Direction) => ({
    x: direction === 'forward' ? '-100%' : '100%',
    opacity: 0
  })
};

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
  const [isPageTransition, setIsPageTransition] = useState(false);
  const [pageChangeDirection, setPageChangeDirection] = useState<Direction>(null);

  const itemsPerPage = viewMode === "list" ? 10 : 16;
  const pageCount = Math.ceil(items.length / itemsPerPage);
  const needsPagination = items.length > itemsPerPage;

  useEffect(() => {
    setCurrentPage(1);
    setIsPageTransition(false);
    setPageChangeDirection(null);
  }, [viewMode]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    console.log(event)
    setIsPageTransition(true);
    setPageChangeDirection(value > currentPage ? 'forward' : 'backward');
    setCurrentPage(value);
  };

  const displayedItems = needsPagination 
    ? items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : items;

  const renderContent = () => {
    if (viewMode === "list") {
      return (
        <List>
          {displayedItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              {renderCard(item, index)}
            </ListItem>
          ))}
        </List>
      );
    }

    return (
      <Grid container spacing={3}>
        {displayedItems.map((item, index) => (
          <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl} key={index}>
            {renderCard(item, index)}
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box dir='rtl'>
      {needsPagination && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                fontFamily: 'inherit',
              },
            }}
          />
        </Box>
      )}
      <Box sx={{ position: 'relative', overflow: 'visible' }}>
        <AnimatePresence initial={false} custom={pageChangeDirection}>
          <motion.div
            key={currentPage}
            custom={pageChangeDirection}
            variants={variants}
            initial={isPageTransition ? "enter" : "center"}
            animate="center"
            exit="exit"
            transition={{ type: "tween", duration: 0.3 }}
            onAnimationComplete={() => setIsPageTransition(false)}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default DisplayCards;