import React from "react";
import {Button, Tag, Row, Col, Space} from 'antd'
import {PercentageOutlined} from "@ant-design/icons";
import PaymentForm from "../payment/paymentForm";
import ClientSelectForm from "../clientSelector/clientSelector";

class StatusButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    componentDidMoёёunt() {

    }

    render() {
        return (
            <div>
                <Space direction={"horizontal"} size={"small"}>
                    <Button
                        key='close-order-button'
                        // className={"close-order-button"}
                        onClick={() => {
                            window.show_page('list')
                        }}
                        type="primary"
                        danger
                        style={{
                            minWidth: '120px',
                            minHeight: '40px'

                        }}
                    >
                        Закрыть
                    </Button>
                    <PaymentForm/>
                    <Button
                        key='save-order-button'
                        // className={"close-order-button"}
                        href="#"
                        data-button-id="save-order"
                        style={{
                            minWidth: '120px',
                            minHeight: '40px'

                        }}
                    >Далее
                    </Button>

                    {/*<ClientSelectForm/>*/}
                </Space>
            </div>
        )
    };
}

export default StatusButtons