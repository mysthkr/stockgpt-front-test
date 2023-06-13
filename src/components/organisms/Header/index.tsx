import Link from 'next/link'
import styled from 'styled-components'
import AppLogo from 'components/atoms/AppLogo'
import Button from 'components/atoms/Button'
import {
  SearchIcon,
  PersonIcon,
  ShoppingCartIcon,
} from 'components/atoms/IconButton'
import ShapeImage from 'components/atoms/ShapeImage'
import Spinner from 'components/atoms/Spinner'
import Text from 'components/atoms/Text'
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import BadgeIconButton from 'components/molecules/BadgeIconButton'
import { useAuthContext } from 'contexts/AuthContext'
import { withAuthServerSideProps } from "lib/auth";
import { getCookie } from "lib/getCookie";



// ヘッダーのルート
const HeaderRoot = styled.header`
  height: 60px;
  background-color: #ffe5b4
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
const Header = () => {
  const { isLoading } = useAuthContext()
  const cookieData = getCookie();
  const userId = cookieData ? cookieData.userId : '';
  const groupId = cookieData ? cookieData.groupId : '';
  console.log("userId, groupId");
  console.log(userId, groupId);

  return (
    <HeaderRoot>
      <Flex paddingLeft={3} paddingRight={3} justifyContent="space-between">
        <Nav as="nav" height="56px" alignItems="center">
          <NavLink>
            <Link href="/" passHref>
              <Anchor as="a">
                <AppLogo />
              </Anchor>
            </Link>
          </NavLink>
          <NavLink>
            <Link href="/grocery" passHref>
              <Button as="a">食料品</Button>
            </Link>
          </NavLink>
          <NavLink>
            <Link href="/product" passHref>
              <Button as="a">日用品</Button>
            </Link>
          </NavLink>
          <NavLink>
            <Box display={{ base: 'none', md: 'block' }}>
              <Text>
                カテゴリ
              </Text>
            </Box>
          </NavLink>
        </Nav>
        <Nav as="nav" height="56px" alignItems="center">
          <NavLink>
            <Box display={{ base: 'block', md: 'none' }}>
              <Link href="/search" passHref>
                <Anchor as="a">
                  <SearchIcon />
                </Anchor>
              </Link>
            </Box>
          </NavLink>
          <NavLink>
            <Link href="/cart" passHref>
              <Anchor as="a">
                <BadgeIconButton
                  icon={<ShoppingCartIcon size={24} />}
                  size="24px"
                  
                  badgeBackgroundColor="textColor"
                />
              </Anchor>
            </Link>
          </NavLink>
          <NavLink>
            {(() => {
              // 認証していたらアイコンを表示
              if (userId) {
                return (
                  <>
                    <Link href={`/users/${userId}`} passHref>
                      <Anchor as="a">
                        
                      </Anchor>
                    </Link>
                    <Link href={`/profile/${userId}`}  passHref>
                    <Anchor as="a">
                      <PersonIcon size={24} />
                      </Anchor>
                    </Link>
                  </>
                )
              } else if (isLoading) {
                // ロード中はスピナーを表示
                return <Spinner size={20} strokeWidth={2} />
              } else {
                // サインインしてない場合はアイコンを表示
                return (
                  <>
                    <Link href="/login" passHref>
                      <Anchor as="a">
                        ログイン
                      </Anchor>
                    </Link>
                    <Link href="/signup" passHref>
                      <Anchor as="a">
                        サインアップ
                      </Anchor>
                    </Link>
                  </>
                )
              }
            })()}
          </NavLink>
          <NavLink>
            <Link href="/stock_item" passHref>
              <Button as="a">ストック</Button>
            </Link>
          </NavLink>
          <NavLink>
            <Link href="/to_buy_list" passHref>
              <Button as="a">買い物リスト</Button>
            </Link>
          </NavLink>
        </Nav>
      </Flex>
    </HeaderRoot>
  )
}

export default Header
