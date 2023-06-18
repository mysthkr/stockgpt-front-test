import { Box, Typography } from '@mui/material';

const CustomErrorPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
      <Typography variant="h2" fontSize="5xl" fontWeight="medium" sx={{ color: '#4B4B4B' }}>
        Internal Server Error
      </Typography>
      <Typography variant="h3" fontSize="2xl" sx={{ color: '#4B4B4B' }}>
        500 サーバーエラーが発生しました
      </Typography>
      <Typography variant="body1" sx={{ mt: 4, color: '#ff7f50', '&:hover': { color: 'blue.400', textDecoration: 'underline' } }}>
        ホームに戻る
      </Typography>
    </Box>
  );
}

export default CustomErrorPage;
