import {Col, Layout, Row, Space, Input} from 'antd';
import React from 'react';
import _ProductTable from "./products_list";
import _OrderHeader from "./order_header";
import _OrderData from "./order_data";
import order_data from "./order_data";
import _ProductsMenu from "./menu/products_menu";


const { Content, Footer} = Layout;
const { TextArea } = Input;

// const Order = () => {
class Order extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.order_str==undefined){
            this.state = {
                order_data: new _OrderData()
            }
        }else {
            this.state = {
                order_data: new _OrderData(JSON.parse(this.props.order_str))
            }
        }
    }

    handleChange = (e) => {
        this.state.order_data.comment = e.target.value;
        console.log(this.state.order_data.comment)
    }

    componentDidMount() {
        window.get_order_data = () => {
            return JSON.stringify(this.state.order_data)
        }
    }
    render() {
        return (
            <form id="form" >
                <Layout className="layout">
                    <Content
                        style={{
                            padding: '20px',
                        }}
                    >
                        <_OrderHeader order_data={this.state.order_data}/>
                        <Space direction="vertical"  size='large'>
                            <Row align="top">

                                <Col style={{padding:'2px 0px 0px 0px'}}  span={10}>
                                    <div style={{width: '400px'}}><_ProductTable /></div>
                                </Col>
                                <Col style={{padding:'0px 0px 0px 10px'}} span={14}>
                                    <_ProductsMenu items = {this.state.order_data.items}/>
                                </Col>

                                {/*<Col span={12}> <_ProductTable/></Col>*/}
                            </Row>
                            <Row align="bottom">
                                <TextArea className="" id="textZone" placeholder="Введите примечание" defaultValue={this.state.order_data.comment}
                                          onChange={this.handleChange}></TextArea>
                            </Row>
                            <Row>

                            </Row>
                        </Space>
                    </Content>
                </Layout>
            </form>)
    };
}
export default Order