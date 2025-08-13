import {Layout, Space} from 'antd';
import React from 'react';
import _Table from "./OrdersTable";
import MainMenu from "./Menu";

const {Content, Footer} = Layout;

const OrdersList = ({ projects }) => { // Принимаем projects как пропс
    return (
        <Layout className="layout">
            <Content style={{ padding: '20px' }}>
                <Space direction="vertical" size='small'>
                    <MainMenu projects={projects} />
                    <_Table/>
                </Space>
            </Content>
            <Footer style={{ textAlign: 'center' }}></Footer>
        </Layout>
    );
}
export default OrdersList;