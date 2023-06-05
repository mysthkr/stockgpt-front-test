// --- ここから追加 ---
import React from 'react';
import { DialogContent, Dialog, DialogTitle, DialogActions } from '@mui/material';
import styled from 'styled-components';

// // components
// import { SubText } from './StyledText';

// // images
// import OrderHeaderImage from '../images/order-header.png';

const OrderHeader = styled.img`
  width: 100%;
  height: 350px;
`;

const DescriptionWrapper = styled.div`
  padding: 0 8px 8px 8px;
  height: 50px;
`;

export const ItemDialog = ({
  item,
  isOpen,
  onClose,
}: {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
    >
      <DialogTitle>
        {item.name}
      </DialogTitle>
      <DialogContent>
        <DescriptionWrapper>
          {item.description}
        </DescriptionWrapper>
      </DialogContent>
      <DialogActions>
       // 数量を操作するアクションを入れる予定
      </DialogActions>
    </Dialog>
  )
}
// --- ここまで追加 ---
