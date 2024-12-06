import React from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';

const Home = () => {
    return (
        <>
            <Header hideSigninButton={false}/>
            <Layout ></Layout>
        </>
    );
};

export default Home;
