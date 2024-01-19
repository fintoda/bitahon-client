import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

interface ModalProps extends DialogProps {
  title?: string;
  onClose: () => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

function Modal({title = '', onClose, children, footer, ...rest}: ModalProps) {
  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="modal"
      {...rest}
    >
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>{children}</DialogContent>
      {footer ? <DialogActions>{footer}</DialogActions> : null}
    </Dialog>
  );
}

export default Modal;
