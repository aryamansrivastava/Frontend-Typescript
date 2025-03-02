import React, { useState, useEffect } from "react";
import { exportToPDF } from "../utils/exportToPDF";
import { exportToExcel } from "../utils/exportToExcel";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

interface ExportUserDataButtonProps {
  fetchPromise: () => Promise<any[]>;
}

const ExportUserDataButton: React.FC<ExportUserDataButtonProps> = ({ fetchPromise }) => {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await fetchPromise();
        setAllUsers(users);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchData();
  }, [fetchPromise]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExportPDF = () => {
    exportToPDF(allUsers);
    handleClose();
  };

  const handleExportExcel = () => {
    exportToExcel(allUsers);
    handleClose();
  };

  return (
    <>
      <div className="flex gap-4 my-4">
        <button
          onClick={handleOpen}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Export User Data
        </button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Download User Information</DialogTitle>
        <DialogActions>
          <Button onClick={handleExportPDF} color="primary">
            Download PDF
          </Button>
          <Button onClick={handleExportExcel} color="primary">
            Download Excel
          </Button>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportUserDataButton;
