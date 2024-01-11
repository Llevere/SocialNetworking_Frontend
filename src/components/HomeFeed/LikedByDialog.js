// LikedByDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';

function LikedByDialog({ open, onClose, likes }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Liked by</DialogTitle>
      <DialogContent>
        <List>
          {likes.map((like, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${like.firstName} ${like.lastName}`} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default LikedByDialog;