import Link from 'next/link'
import styled from 'styled-components'
import Button from 'components/atoms/Button'
import ShapeImage from 'components/atoms/ShapeImage'
import Text from 'components/atoms/Text'
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import BadgeIconButton from 'components/molecules/BadgeIconButton'
import { getCookie } from "lib/getCookie";
import useSWR from 'swr'

// ヘッダーのルート
const GlobalNavRoot = styled.header`
  height: 50px;
  background-color: #ff7f50
`

// ナビゲーション
const Nav = styled(Flex)`
  & > span:not(:first-child) {
  }
`

// ナビゲーションのリンク
const NavLink = styled.span`
  display: inline;
`

// アンカー
const Anchor = styled(Text)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

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
      <Flex paddingLeft={3} paddingRight={3} justifyContent="space-between">
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
                            <Text>
                              レシピ
                            </Text>
                          </Anchor>
                        </Link>
                      </Box>
                    </NavLink>
                    <NavLink>
                      <Box display={{ base: 'none', md: 'block' }}>
                        <Link href="/favorite" passHref>
                          <Anchor as="a">
                            <Text>
                              お気に入り
                            </Text>
                          </Anchor>
                        </Link>
                      </Box>
                    </NavLink>
                    <NavLink>
                      <Box display={{ base: 'none', md: 'block' }}>
                        <Link href="/criteria_day" passHref>
                          <Anchor as="a">
                            <Text>
                              カスタマイズ
                            </Text>
                          </Anchor>
                        </Link>
                      </Box>
                    </NavLink>
                  </>
                )}
            })()}
        </Nav>
        <Nav as="nav" height="56px" alignItems="center">
          <NavLink>
            {(() => {
              // 認証していたらアイコンを表示
              if (userId && groupId) {
                return (
                  <NavLink>
                    <Link href="/sell" passHref>
                      <Button as="a">ログアウト</Button>
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
