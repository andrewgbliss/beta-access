import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';

interface Props {
  children: React.ReactElement;
}

const Layout: React.FC<Props> = (props) => {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
};

export default Layout;
