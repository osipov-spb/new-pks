import React from "react";
import {Button, Tag, Row, Col} from 'antd'
import {PercentageOutlined} from "@ant-design/icons";

class StatusButtons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    componentDidMoёёunt() {

    }
    render() {
        return (
            <div>
            <Button
                key='close-order-button'
                // className={"close-order-button"}
                onClick={() => {}}
            >
                <div style={{
                    // position: "absolute",
                    // top: "6%",
                    // left: "6%",
                    // width: "100%",
                    // height: "37%",
                }}>
                    {/*<Row align="top">*/}
                    {/*    <Col span={24}>*/}
                    {/*        <Tag color="#ffa940" ><div >{this.state.data.price} Р</div></Tag><Tag color="red"><PercentageOutlined /></Tag>*/}
                    {/*    </Col>*/}

                    {/*</Row>*/}
                </div>

            Закрыть
            </Button>
        <Button
            key='close-order-button'
            // className={"close-order-button"}
            onClick={() => {}}
        >
            <div style={{
                // position: "absolute",
                // top: "6%",
                // left: "6%",
                // width: "100%",
                // height: "37%",
            }}>
                {/*<Row align="top">*/}
                {/*    <Col span={24}>*/}
                {/*        <Tag color="#ffa940" ><div >{this.state.data.price} Р</div></Tag><Tag color="red"><PercentageOutlined /></Tag>*/}
                {/*    </Col>*/}

                {/*</Row>*/}
            </div>

            Оплатить
            </Button>
            </div>
        )
    };
}

export default StatusButtons