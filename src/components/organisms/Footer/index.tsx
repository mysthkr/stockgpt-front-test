// import Link from 'next/link'
import styled from 'styled-components'
import { GitHubIcon } from 'components/atoms/IconButton'
import Text from 'components/atoms/Text'
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import { Link, Typography } from '@mui/material'

const Anchor = styled(Text)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`
const StyledFooter = styled.footer`
  background-color: #f5f5f5;
  padding: 20px;
  text-align: center;
  color: #4B4B4B;
`;


/**
 * フッター
 */
const Footer = () => {
  return (
    <footer>
      <StyledFooter>
      <Typography variant="body1" component="nav">
        <Link href="/" passHref>
          <Typography variant="body1" component="a" sx={{ color: '#4B4B4B', textDecoration: 'underline' }}>
            ホーム
          </Typography>
        </Link>{'   '}
        <Link href="/" passHref>
          <Typography variant="body1" component="a" sx={{ color: '#4B4B4B', textDecoration: 'underline' }}>
            お知らせ
          </Typography>
        </Link>
      </Typography>

      <Typography variant="body1" component="nav">
        <Link href="/" passHref>
          <Typography variant="body1" component="a" sx={{ color: '#4B4B4B', textDecoration: 'underline' }}>
            利用規約
          </Typography>
        </Link>{'   '}
        <Link href="/" passHref>
          <Typography variant="body1" component="a" sx={{ color: '#4B4B4B', textDecoration: 'underline' }}>
            プライバシーポリシー
          </Typography>
        </Link>
      </Typography>

      <Typography variant="body1" component="nav">
        <Typography variant="body1" component="a" href="" target="_blank" sx={{ color: '#4B4B4B', textDecoration: 'underline' }}>
          GitHub
        </Typography>
      </Typography>

      <Typography variant="body1" sx={{ color: '#4B4B4B' }}>
        © 2023 StockGPT by Miyashita. All rights reserved.
      </Typography>
    </StyledFooter>
    </footer>
  )
}

export default Footer
