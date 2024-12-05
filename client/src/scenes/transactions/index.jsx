import React, { useState, useCallback } from "react";
import { Box, useTheme } from "@mui/material";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Transactions = () => {
  const theme = useTheme();

  // Values to be sent to the backend
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 20,
    page: 0,
  });

  const [sortModel, setSortModel] = useState([{ field: "_id", sort: "asc" }]);
  const handleSortModelChange = useCallback((newSortModel) => {
    setSortModel(newSortModel);
  }, []);

  const [filterModel, setFilterModel] = useState({});
  const handleFilterModelChange = useCallback((newFilterModel) => {
    setFilterModel(newFilterModel);
  }, []);

  const { data, isLoading } = useGetTransactionsQuery({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    sort: JSON.stringify(sortModel[0] || {}),
    search: filterModel.quickFilterValues?.[0] || "",
  });

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  // Custom MUI Scroll Bar
  const customScrollBar = {
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
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
      <Box
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}>
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data.transactions) || []}
          columns={columns}
          rowCount={(data && data.total) || 0}
          sx={customScrollBar}
          // Page size
          pagination
          page={paginationModel.page}
          pageSize={paginationModel.pageSize}
          paginationMode="server"
          pageSizeOptions={[20, 50, 100]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          // Sort
          sortingMode="server"
          sortingOrder={["asc", "desc"]}
          onSortModelChange={handleSortModelChange}
          // Filter
          filterMode="server"
          onFilterModelChange={handleFilterModelChange}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
