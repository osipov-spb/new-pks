import {Layout, Space} from 'antd';
import React from 'react';
import Table from "./сomponents/list-items_ant/list-items";
import Menu from "./сomponents/menu/menu";


const {Content, Footer} = Layout;

const App = () => {
    return (
        <Layout className="layout">
            <Content
                style={{
                    padding: '10px',
                }}
            >
                <Space direction="vertical" size='small'>
                <Menu/>
                <Table/>
                    </Space>
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