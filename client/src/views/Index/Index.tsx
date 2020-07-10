import React, { useEffect } from 'react';
import Layout from 'components/Layout/Layout';
import Jumbotron from 'sections/Jumbotron/Jumbotron';
import Api from 'services/Api';

const Index: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await Api.get('/api/v1/info');
      console.log(response);
    };
    fetchData();
  }, []);
  return (
    <Layout>
      <Jumbotron />
    </Layout>
  );
};

export default Index;
