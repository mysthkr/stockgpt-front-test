import Link from 'next/link'
import styled from 'styled-components'
import Button from 'components/atoms/Button'
import Text from 'components/atoms/Text'
import Box from 'components/layout/Box'
import Flex from 'components/layout/Flex'
import BadgeIconButton from 'components/molecules/BadgeIconButton'
import { getCookie } from "lib/getCookie";
import useSWR from 'swr';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router'
import axios from 'axios'
import { useState } from 'react'
import Cookies from 'js-cookie'


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
  && {
    text-decoration: none;
    transition: border-bottom-color 0.1s ease-in-out;
    border-bottom: 2px solid transparent;

    &:hover {
      border-bottom-color: #ffffff;
    }
  }
`;

/**
 * ヘッダー
 */
const GlobalNav = () => {
  const { data: cookieData, error } = useSWR('userCookie', getCookie);
  const userId = cookieData ? cookieData.userId : '';
  const groupId = cookieData ? cookieData.groupId : '';
  /* if (error) return <div>Failed to load</div> */

  const router = useRouter();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSignoutSubmit = (event: any) => {
    event.preventDefault();
    const cookieData = getCookie();
    // const data = new FormData(event.currentTarget);
    const axiosInstance = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_API_ROOT_URL}/api/v1/`,
      headers: {
        "content-type": "application/json",
      },
    });
    (async () => {
      setIsError(false);
      setErrorMessage("");
      return await axiosInstance.delete("auth/sign_out", {
          // credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            "uid": cookieData?.uid || "",
            "client": cookieData?.client || "",
            "access-token": cookieData?.accessToken || "",
          },
        })
        .then(function (response) {
          // Cookieにトークンをセットしています
          console.log(response.headers);
          console.log(response);
          Cookies.set("uid", "");
          Cookies.set("client", "");
          Cookies.set("access-token", "");
          Cookies.set("id", "");
          Cookies.set("group_id", "");
          router.push("/");
        })
        .catch(function (error) {
          // Cookieからトークンを削除しています
          Cookies.remove("uid");
          Cookies.remove("client");
          Cookies.remove("access-token");
          Cookies.remove("id");
          Cookies.remove("group_id");
          setIsError(true);
          setErrorMessage(error.response.data.errors[0]);
        });
    })();
  };

  const SignoutButton = () => {
    return (
      <Link href="/sell" passHref>
        <StyledButton as="a" onClick={handleSignoutSubmit}>
          <CustomTypography variant="body1" >ログアウト</CustomTypography>
        </StyledButton>
      </Link>
    );
  };

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
                  <SignoutButton />
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
