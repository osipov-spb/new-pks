import {Layout} from 'antd';
import React from 'react';
import NewTable from "./сomponents/list-items_ant/list-items_ant";
import Header from "./сomponents/Header";


import Menu from "./сomponents/menu/Menu";
import Divider from "./сomponents/Divider";

const {Content, Footer} = Layout;

const App = () => {
    return (
        <Layout className="layout">
            <Header/>
            <Content
                style={{
                    padding: ' 10px 50px 50px',
                }}
            >
                <Menu/>
                <Divider/>
                <NewTable/>
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