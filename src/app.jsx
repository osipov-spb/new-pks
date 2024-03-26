import {Layout} from 'antd';
import React from 'react';
import Table from "./сomponents/list-items_ant/list-items_ant";

import Menu from "./сomponents/menu/menu";
import Divider from "./сomponents/divider";
import Header from "./сomponents/header";

const {Content, Footer} = Layout;

const App = () => {
    return (
        <Layout className="layout">
            <Content
                style={{
                    padding: ' 10px 50px 50px',
                }}
            >
                <Menu/>
                <Divider/>
                <Table/>
            </Content>
            <Footer
                style={{
                    textAlign: 'center',
                }}
            >
            </Footer>
        </Layout>
    );
}
export default App