import Separator from 'components/atoms/Separator'
import Box from 'components/layout/Box'
import Footer from 'components/organisms/Footer'
import Header from 'components/organisms/Header'
import GlobalNav from 'components/organisms/GlobalNav'
import styled from 'styled-components';

interface LayoutProps {
  children: React.ReactNode
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
`;

const Layout = ({ children }: LayoutProps) => {
  return (
    <LayoutContainer>
      <Header />
      <GlobalNav />
      <MainContent>
        {children}
      </MainContent>
      <Separator />
      <Box padding={3}>
        <Footer />
      </Box>
    </LayoutContainer>
  )
}

export default Layout
