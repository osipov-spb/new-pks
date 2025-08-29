import { Layout, Space } from 'antd';
import React from 'react';
import _Table from "./OrdersTable";
import MainMenu from "./Menu";

const { Content, Footer } = Layout;

const OrdersList = ({ projects }) => {
    return (
        <Layout className="layout" style={{
            background: '#ffffff',
            minHeight: '100vh'
        }}>
            <Content style={{
                padding: '10px',
                paddingTop: '5px',
                background: '#ffffff'
            }}>
                {/* Блок меню - более выделенный */}
                <div style={{
                    marginBottom: '16px',
                    backgroundColor: '#f0f2f5',
                    paddingRight: '20px',
                    paddingLeft: '20px',
                    paddingTop: '10px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #f0f0f0'
                }}>
                    <MainMenu projects={projects} />
                </div>

                {/* Блок таблицы - более плоский */}
                <div style={{
                    backgroundColor: '#f0f2f5',
                    padding: '0', // если таблица сама имеет паддинги
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    paddingBottom: '700px',
                }}>
                    <_Table/>
                </div>
            </Content>
        </Layout>
    );
}

export default OrdersList;