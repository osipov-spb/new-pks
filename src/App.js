import {Button, Col, Layout, Row, Space} from 'antd';
import React, {useState} from 'react';
import NewTable from "./сomponents/list-items_ant/list-items_ant";
import Header from "./сomponents/Header";


import Menu from "./сomponents/Menu";
import Divider from "./сomponents/Divider";

const { Content, Footer } = Layout;

const row_style = {
    // background: '#0092ff',
    padding: '12px 0',
    //margin: '10px 0',

};

const App = () => {
    return (
        <Layout className="layout">
            <Header/>
            <Divider/>

            <Content
                style={{
                    padding: ' 50px',
                }}
            >
                <Menu/>
                <Divider/>
                <NewTable/>
            </Content>

            {/*<Footer
            style={{
                textAlign: 'center',
            }}
        >
            Ant Design ©2018 Created by Ant UED
        </Footer>*/}
        </Layout>
    );
}
export default App