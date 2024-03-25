import {PageHeader} from 'antd';
import React from "react";

import {Menu} from "antd";
import {Header} from "antd/es/layout/layout";
import MyDivider from "./Divider";
import {Col, Divider, Row} from 'antd';

const _Header = () => {
    return (
        <>
            <PageHeader
                className="site-page-header"
                //onBack={() => null}
                title="Заказы"
                subTitle="Т55, Гостинный"
            />
        </>
    )
}

export default _Header