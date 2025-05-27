import {Layout, Space} from 'antd';
import React from 'react';
import _Table from "./list-items_ant/list-items_ant";
import _Menu from "./menu";

const {Content, Footer} = Layout;

const OrdersList = ({ projects }) => { // Принимаем projects как пропс
    return (
        <Layout className="layout">
            <Content style={{ padding: '20px' }}>
                <Space direction="vertical" size='small'>
                    <_Menu projects={projects} /> {/* Передаем projects в _Menu */}
                    <_Table/>
                </Space>
            </Content>
            <Footer style={{ textAlign: 'center' }}></Footer>
        </Layout>
    );
}
export default OrdersList;