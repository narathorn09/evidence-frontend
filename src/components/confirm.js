import React, { useState, userEffect } from "react";
import {
  Box,
  Stack,
  Grid,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  Divider,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Alert,
} from "@mui/material";

const DialogConfirm = ({ isModalOpen, CloseDialog, RemoveMember }) => {
  return (
    <div>
      <Dialog open={isModalOpen.status}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ display: "flex", justifyContent: "center" }}>
            "Are you sure you want to confirm the reservation?"
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={CloseDialog} sx={{ color: "#10AC8E" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{ bgcolor: "#10AC8E", ":hover": { bgcolor: "#086F5B" } }}
            onClick={() => RemoveMember(isModalOpen.id)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* confirm succes ################################################################ */}
      {/* <Dialog
        open={isReservedDialogOpen}
        // onClose={() => setIsReservedDialogOpen(false)}
      >
        <DialogTitle textAlign={"center"} sx={{ mt: 2 }}>
          {isError ? "Reservation Failed" : "Reservation Success"}
        </DialogTitle>
        <DialogContent>
          <Stack
            direction="column"
            alignItems="center"
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {isError ? (
              <>
                <CancelOutlined
                  sx={{ fontSize: 60, marginBottom: 2, color: "#E41E1E" }}
                />
                <DialogContentText>
                  <p>Your reserve has not been confirmed.</p>
                </DialogContentText>
              </>
            ) : (
              <>
                <CheckCircleOutline
                  sx={{ fontSize: 60, marginBottom: 2, color: "#04CB00" }}
                />
                <DialogContentText>
                  <p>Your reservation has been successfully confirmed.</p>
                </DialogContentText>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, mt: -3 }}>
          <Button
            component={Link}
            to={!isError ? `/herbarium-detail/${params?.id}` : null}
            onClick={() => setIsReservedDialogOpen(false)}
            sx={{ color: "#10AC8E" }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default DialogConfirm;
