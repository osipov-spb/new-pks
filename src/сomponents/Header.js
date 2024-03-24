import { PageHeader } from 'antd';
import React from "react";

import {Menu} from "antd";
import {Header} from "antd/es/layout/layout";
import MyDivider from "./Divider";
import { Col, Divider, Row } from 'antd';

const row_style = {
    background: '#0092ff',
    padding: '12px 0',
    margin: '12px 0',

};
const _Header = () => {
    return (
        <>
        <PageHeader
        className="site-page-header"
        //onBack={() => null}
        title="Заказы"
        //subTitle="This is a subtitle"

        />
        {/*<MyDivider />*/}
            {/*<Divider orientation="left">Заказы</Divider>*/}
            {/*<Row gutter={12}>*/}

            {/*    <Col className="gutter-row" span={6}>*/}
            {/*        <div style={row_style}>col-6</div>*/}
            {/*    </Col>*/}
            {/*    <Col className="gutter-row" span={6}>*/}
            {/*        <div style={row_style}>col-6</div>*/}
            {/*    </Col>*/}
            {/*    <Col className="gutter-row" span={6}>*/}
            {/*        <div style={row_style}>col-6</div>*/}
            {/*    </Col>*/}
            {/*    <Col className="gutter-row" span={6}>*/}
            {/*        <div style={row_style}>col-6</div>*/}
            {/*    </Col>*/}
            {/*</Row>*/}

        </>
    )
}

export default _Header