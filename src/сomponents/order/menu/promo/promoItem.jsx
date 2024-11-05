import React from "react";
import {Button, Tag, Row, Col, Divider, Select, Popover, Carousel} from 'antd'
import {InfoCircleOutlined, PercentageOutlined} from "@ant-design/icons";
import { Checkbox } from 'antd';
import {Typography} from "antd";
import MenuBreadcrumb from "../products/menu_breadcrumb";
import ItemSelector from "./itemSelector";

const { Option } = Select;
const {Text } = Typography;

const contentStyle = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

class PromoItem extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.data==undefined){
            this.state = {
                data: {
                    title: 'Акция 1',
                    id: '1',
                    available: 1,
                    info: 'Подробная информация об акции',
                    items:[
                        {
                            id: '1',
                            price: 100,
                            title: 'Позиция 1'
                        },
                        {
                            id: '2',
                            price: 200,
                            title: 'Позиция 2'
                        },
                        {
                            id: '3',
                            price: 300,
                            title: 'Позиция 3'
                        }
                    ]
                }
            }
        }else {
            this.state = {
                data: this.props.data
            }
        }
    }

    FitString = (text) =>{
        const firstPart = text.substring(0,8);
        var secondPart = text.substring(8);
        var  replacedSpace = secondPart.replace( " ",  " \n"); //text1.slice(0, 15) + " \n" + text1.slice(15);
        if (replacedSpace.length > 15){
            const firstPart2 = replacedSpace.substring(0,8);
            var secondPart2 = replacedSpace.substring(8);
            var  replacedSpace2 = secondPart2.replace( " ",  " \n");
            if (replacedSpace2.length > 24){

                return firstPart + firstPart2 + replacedSpace2.substring(0,21) + '...'
            }
            else{
                return firstPart + firstPart2 + replacedSpace2;}
        }else{
            return firstPart + replacedSpace;
        }
    }

    BreakString = ({ text }) => {
        const strArr = this.FitString(text).split("\n");
        return (
            <>
                {strArr.map((str, index) => (
                    <React.Fragment key={index}>
                        {str}
                        {index !== str.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </>
        );
    };

    componentDidMount() {

    }

    render() {
        // let optionsElem = [];
        // for (let i = 1; i <= this.state.data.available; i++) {
        //     optionsElem.push(
        //             <Col span={8}>
        //                 <ItemSelector items={this.state.data.items} count={this.state.data.available}></ItemSelector>
        //             </Col>)
        // }

        return (
            <div
                key={this.state.data.index}
                className={"style-btn-promo"}
                //onClick={() => window.order_product_list_AddItem(this.state.data.title, this.state.data.id, this.state.data.price)}
            >
                <div style={{
                    // position: "absolute",
                    // top: "6%",
                    // left: "6%",
                    // width: "100%",
                    // height: "37%",
                    padding: "5px 10px 10px 10px"
                }}>
                    <Row align='middle' justify='center'>
                        <Col span={2}>
                            <Checkbox style={{ padding: "0px 0px 0px 5px"}}/>
                        </Col>
                        <Col span={1}><Divider style={{
                            height: '60px'
                        }} type="vertical"/></Col>
                        <Col span={5}>
                            <Popover content={this.state.data.info} title={this.state.data.title} trigger="hover">
                                <Text>{this.state.data.title} </Text>
                                <InfoCircleOutlined/>
                            </Popover>
                            <br/>
                        </Col>
                        <Col span={1}><Divider style={{
                            height: '60px'
                        }} type="vertical"/></Col>

                        <Col span={13}>
                            <Row align='middle' justify='center' style={{
                                padding: "0px 0px 0px 15px"
                            }}>
                                <ItemSelector items={this.state.data.items} count={this.state.data.available} />
                            </Row>
                        </Col>

                    </Row>
                </div>
                {/*<div style={{*/}
                {/*    position: "absolute",*/}
                {/*    top: "34%",*/}
                {/*    width: "100%",*/}
                {/*    height: "63%",*/}
                {/*    textAlign: "center",*/}
                {/*    padding: "5px 5px 5px 5px"*/}
                {/*}}>*/}
                {/*    <Row>*/}
                {/*        <Col span={24}>*/}
                {/*            <this.BreakString text={this.state.data.title}/>*/}
                {/*        </Col>*/}
                {/*    </Row>*/}
                {/*</div>*/}

            </div>
        )
    };
}

export default PromoItem