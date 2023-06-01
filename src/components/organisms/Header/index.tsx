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

// ヘッダーのルート
const HeaderRoot = styled.header`
  height: 88px;
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
  const { authUser, isLoading } = useAuthContext()

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
            <Box display={{ base: 'none', md: 'block' }}>
              <Link href="/search" passHref>
                <Anchor as="a">すべて</Anchor>
              </Link>
            </Box>
          </NavLink>
          <NavLink>
            <Box display={{ base: 'none', md: 'block' }}>
              <Link href="/search/clothes" passHref>
                <Anchor as="a">トップス</Anchor>
              </Link>
            </Box>
          </NavLink>
          <NavLink>
            <Box display={{ base: 'none', md: 'block' }}>
              <Link href="/search/book" passHref>
                <Anchor as="a">本</Anchor>
              </Link>
            </Box>
          </NavLink>
          <NavLink>
            <Box display={{ base: 'none', md: 'block' }}>
              <Link href="/search/shoes" passHref>
                <Anchor as="a">シューズ</Anchor>
              </Link>
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
                  
                  badgeBackgroundColor="primary"
                />
              </Anchor>
            </Link>
          </NavLink>
          <NavLink>
            {(() => {
              // 認証していたらアイコンを表示
              if (authUser) {
                return (
                  <Link href={`/users/${authUser.id}`} passHref>
                    <Anchor as="a">
                      
                    </Anchor>
                  </Link>
                )
              } else if (isLoading) {
                // ロード中はスピナーを表示
                return <Spinner size={20} strokeWidth={2} />
              } else {
                // サインインしてない場合はアイコンを表示
                return (
                  <Link href="/signin" passHref>
                    <Anchor as="a">
                      <PersonIcon size={24} />
                    </Anchor>
                  </Link>
                )
              }
            })()}
          </NavLink>
          <NavLink>
            <Link href="/sell" passHref>
              <Button as="a">出品</Button>
            </Link>
          </NavLink>
        </Nav>
      </Flex>
    </HeaderRoot>
  )
}

export default Header
