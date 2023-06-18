import Image from 'next/image'
import styled from 'styled-components';

const LogoWrapper = styled.div`
  padding-left: 10px;
`;

const AppLogo = () => {
  return (
    <LogoWrapper>
      <Image src="/logo_transparent.png" alt="logo" width="150" height="45" />
    </LogoWrapper>
  );
}

export default AppLogo