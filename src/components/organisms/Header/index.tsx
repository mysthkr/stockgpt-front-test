import Link from 'next/link'
import styled from 'styled-components'
import AppLogo from 'components/atoms/AppLogo';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ShapeImage from 'components/atoms/ShapeImage'
import Spinner from 'components/atoms/Spinner'
import Text from 'components/atoms/Text'
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import BadgeIconButton from 'components/molecules/BadgeIconButton'
import { withAuthServerSideProps } from "lib/auth";
import { getCookie } from "lib/getCookie";
import ArchiveIcon from '@mui/icons-material/Archive';
import { Badge, Skeleton } from '@mui/material';
import useSWR from 'swr';
import { Inventory, Person, ShoppingCart } from '@mui/icons-material';



// ヘッダーのルート
const HeaderRoot = styled.header`
  height: 60px;
  background-color: #ffe5b4
`

// ナビゲーション
const Nav = styled(Flex)`
  & > span:not(:first-child) {
    margin-left: 15px;
  }
`

// ナビゲーションのリンク
const NavLink = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: #4B4B4B;
  transform: scale(1);
  transition: all 0.3s;
  &:hover {
    transform: translateY(5px);
  }
`

const NavLinkContent = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 100%;
`

// アンカー
const Anchor = styled(Text)`
  cursor: pointer;
  color: #4B4B4B;
  margin-left: 8px;
  &:hover {
    text-decoration: underline;
  }
`
const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #4B4B4B;
  margin-left: 8px;
  transition: all 0.3s;
  &:hover {
    transform: translateY(5px);
  }
`

const fetcher = (url: string) => {
  const cookieData = getCookie();
  return fetch(url, {
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      "uid": cookieData?.uid || "",
      "client": cookieData?.client || "",
      "access-token": cookieData?.accessToken || "",
    },
  }).then((res) => res.json())
};


/**
 * ヘッダー
 */
const Header = () => {
  const cookieData = getCookie();
  const userId = cookieData ? cookieData.userId : '';
  const groupId = cookieData ? cookieData.groupId : '';
  console.log("userId, groupId");
  console.log(userId, groupId);
  const { data, error } = useSWR(
    `http://localhost:3010/api/v1/stock_items/alarms`,
    fetcher
  );
  if (error) return <div>An error has occurred.</div>;
  if (!data) return <Skeleton>Loading...</Skeleton>;

  return (
    <HeaderRoot>
      <Flex paddingLeft={3} paddingRight={3} justifyContent="space-between">
        <Nav as="nav" height="56px" alignItems="center">
          <NavLink>
            <NavLinkContent>
              <Link href="/" passHref>
                <Anchor as="a">
                  <AppLogo />
                </Anchor>
              </Link>
            </NavLinkContent>
          </NavLink>
        {userId && groupId && (
          <>
            <NavLink>
            <NavLinkContent>
              <Link href="/grocery" passHref>
                <Button as="a">食料品</Button>
              </Link>
              </NavLinkContent>
            </NavLink>
            <NavLink>
            <NavLinkContent>
              <Link href="/product" passHref>
                <Button as="a">日用品</Button>
              </Link>
              </NavLinkContent>
            </NavLink>
            <NavLink>
            <NavLinkContent>
              <Box display={{ base: 'none', md: 'block' }}>
                <Text>
                  カテゴリ
                </Text>
              </Box>
              </NavLinkContent>
            </NavLink>
          </>
        )}
        </Nav>
        
        <Nav as="nav" height="56px" alignItems="center">
        {(() => {
        // 認証していたらアイコンを表示
        if (userId && groupId) {
          return (
          <>
            <NavLink>
              <NavLinkContent>
                <Link href="/cart" passHref>
                  <Anchor as="a">
                    <BadgeIconButton
                      icon={<ShoppingCart style={{ color: '#4B4B4B', fontSize: 24 }} />}
                      size="24px"
                      badgeBackgroundColor="textColor"
                    />
                  </Anchor>
                </Link>
              </NavLinkContent>
            </NavLink>
                  
            <NavLink>
              <NavLinkContent>
                <Link href={`/profile/${userId}`}  passHref>
                <Anchor as="a">
                  <Person style={{ color: '#4B4B4B', fontSize: 24 }} />
                  </Anchor>
                </Link>
              </NavLinkContent>
            </NavLink>

            <NavLink>
              <NavLinkContent>
                <Link href="/stock_item" passHref>
                  <Badge badgeContent={data.data.length} style={{ color: '#ff7f50', fontSize: 24 }}>
                    <Inventory style={{ color: '#4B4B4B', fontSize: 24 }}/>
                  </Badge>
                </Link>
              </NavLinkContent>
            </NavLink>
            <NavLink>
              <NavLinkContent>
                <Link href="/to_buy_list" passHref>
                  <Button as="a">
                    <EditNoteIcon style={{ color: '#4B4B4B', fontSize: 24 }} />
                  </Button>
                </Link>
              </NavLinkContent>
            </NavLink>
          </>
          )
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
                  新規登録
                </Anchor>
              </Link>
            </>
          )
        }
        })()}
      </Nav>
    </Flex>
  </HeaderRoot>
  )
}

export default Header