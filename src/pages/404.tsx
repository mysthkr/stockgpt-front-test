// import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Typography } from '@mui/material';
import { Link } from '@mui/material';

const CustomErrorPage = () => {
  const router = useRouter()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
      <Typography variant="h2" fontSize="5xl" fontWeight="medium" sx={{ color: '#4B4B4B' }}>
        Page not found
      </Typography>
      <Typography variant="h3" fontSize="2xl" sx={{ color: '#4B4B4B' }}>
        {router.asPath} ページは存在しません
      </Typography>
      <Link href="/" underline="none">
        <Typography variant="body1" sx={{ mt: 4, color: '#ff7f50', '&:hover': { color: 'blue.400' } }}>
          ホームに戻る
        </Typography>
      </Link>
    </Box>
  );
}

export default CustomErrorPage