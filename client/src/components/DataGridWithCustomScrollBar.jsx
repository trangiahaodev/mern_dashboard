import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

const DataGridWithCustomScrollBar = (props) => {
  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    "& ::-webkit-scrollbar": {
      width: "6px",
    },
    "& ::-webkit-scrollbar-track": {
      backgroundColor: theme.palette.background.alt,
    },
    "& ::-webkit-scrollbar-thumb": {
      borderRadius: "10px",
      boxShadow: "inset 0 0 6px rgba(0,0,0,.3)",
      backgroundColor: theme.palette.secondary[200],
    },
  }));

  // Ensure all props are passed to StyledDataGrid
  return <StyledDataGrid {...props} />;
};

export default DataGridWithCustomScrollBar;
