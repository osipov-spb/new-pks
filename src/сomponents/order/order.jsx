import {Layout, Space} from 'antd';
import React from 'react';
import _ProductTable from "./products_list";


const {Content, Footer} = Layout;

const Order = () => {sessionStorage.clear()
    return (
        <Layout className="layout">
            <Content
                style={{
                    padding: '20px',
                }}
            >
                <Space direction="vertical" size='small'>
                    <_ProductTable/>
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
export default Order