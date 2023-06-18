import Link from 'next/link'
import styled from 'styled-components'
import Button from 'components/atoms/Button'
import ShapeImage from 'components/atoms/ShapeImage'
import Text from 'components/atoms/Text'
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import BadgeIconButton from 'components/molecules/BadgeIconButton'
import { getCookie } from "lib/getCookie";
import useSWR from 'swr';
import Typography from '@mui/material/Typography';


const CustomTypography = styled(Typography)({
  color: '#FFFFFF',
  // fontFamily: 'Noto Sans JP, M PLUS Rounded 1c, sans-serif',
  fontFamily: '"M PLUS Rounded 1c", sans-serif',
});

// ヘッダーのルート
const GlobalNavRoot = styled.header`
  height: 55px;
  background-color: #ff7f50;
  padding: 0px 10px;
`

// ナビゲーション
const Nav = styled(Flex)`
  & > span:not(:first-child) {
    margin-left: 10px;
  }
`

// ナビゲーションのリンク
const NavLink = styled.span`
  display: inline;
`

// アンカー
const Anchor = styled(Text)`
  cursor: pointer;
  color: #ffffff; 
  &:hover {
    text-decoration: underline;
  }
`

const StyledButton = styled(Button)`
  color: #ffffff; 
`;

/**
 * ヘッダー
 */
const GlobalNav = () => {
  const { data: cookieData, error } = useSWR('userCookie', getCookie);
  const userId = cookieData ? cookieData.userId : '';
  const groupId = cookieData ? cookieData.groupId : '';
  /* if (error) return <div>Failed to load</div> */

  return (
    <GlobalNavRoot>
      <Flex paddingLeft={3} paddingRight={3} justifyContent="space-between" alignItems="center">
        <Nav as="nav" height="56px" alignItems="center">
        {(() => {
          // 認証していたらアイコンを表示
          if (userId  && groupId) {
                return (
                  <>
                    <NavLink>
                      <Box display={{ base: 'none', md: 'block' }}>
                        <Link href="/recipe" passHref>
                          <Anchor as="a">
                            <CustomTypography variant="body1">
                              レシピ
                            </CustomTypography>
                          </Anchor>
                        </Link>
                      </Box>
                    </NavLink>
                    <NavLink>
                      <Box display={{ base: 'none', md: 'block' }}>
                        <Link href="/favorite" passHref>
                          <Anchor as="a">
                            <CustomTypography variant="body1">
                              お気に入り
                            </CustomTypography>
                          </Anchor>
                        </Link>
                      </Box>
                    </NavLink>
                    <NavLink>
                      <Box display={{ base: 'none', md: 'block' }}>
                        <Link href="/criteria_day" passHref>
                          <Anchor as="a">
                            <CustomTypography variant="body1">
                              カスタマイズ
                            </CustomTypography>
                          </Anchor>
                        </Link>
                      </Box>
                    </NavLink>
                  </>
                )}
            })()}
        </Nav>
        <Nav as="nav" alignItems="center">
          <NavLink>
            {(() => {
              // 認証していたらアイコンを表示
              if (userId && groupId) {
                return (
                  <NavLink>
                    <Link href="/sell" passHref>
                      <StyledButton as="a">ログアウト</StyledButton>
                    </Link>
                  </NavLink>
                )
              } 
            })()}
          </NavLink>
        </Nav>
      </Flex>
    </GlobalNavRoot>
  )
}

export default GlobalNav
