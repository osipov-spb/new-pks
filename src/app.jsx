import {Layout, Space} from 'antd';
import React from 'react';
import Table from "./сomponents/list-items_ant/list-items_ant";
import Menu from "./сomponents/menu/menu";
import Divider from "./сomponents/divider";


const {Content, Footer} = Layout;

const App = () => {
    return (
        <Layout className="layout">
            <Content
                style={{
                    padding: '20px',
                }}
            >
                <Space direction="vertical" size='small'>
                <Menu/>
                {/*<Divider/>*/}
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