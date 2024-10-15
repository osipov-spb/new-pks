import {Col, Layout, Row, Space, Input} from 'antd';
import React from 'react';
import _ProductTable from "./products_list";
import _OrderHeader from "./order_header";
import _OrderData from "./order_data";
import _ProductsMenu from "./menu/products/products_menu";
import StatusButtons from "./buttons/status_buttons";
import _PromoMenu from "./menu/promo/promo_menu";


const { Content, Footer} = Layout;
const { TextArea } = Input;

// const Order = () => {
class Order extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.order_str==undefined){ // Это условие для отладки из браузера, из 1С данные передаются всегда
            this.state = {
                order_data: new _OrderData(),
                params: undefined
            }
        }else {
            this.state = {
                order_data: new _OrderData(JSON.parse(this.props.order_str)),
                params: JSON.parse(this.props.params_str)
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
                                    <br/>
                                    <Row align="bottom">
                                        <TextArea className="" id="textZone" placeholder="Введите примечание" defaultValue={this.state.order_data.comment}
                                                  onChange={this.handleChange}></TextArea>
                                    </Row>
                                </Col>
                                <Col style={{padding:'0px 0px 0px 10px'}} span={14}>
                                    <_ProductsMenu items = {this.state.params.menu}/>
                                    {/*<_PromoMenu/>*/}
                                    <StatusButtons/>
                                </Col>

                                {/*<Col span={12}> <_ProductTable/></Col>*/}
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