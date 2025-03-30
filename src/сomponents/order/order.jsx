import {Col, Layout, Row, Space, Input} from 'antd';
import React from 'react';
import _ProductTable from "./products_list";
import _OrderHeader from "./order_header";
import _OrderData from "./order_data";
import _ProductsMenu from "./menu/products/products_menu";
import StatusButtons from "./buttons/status_buttons";
import _PromoMenu from "./menu/promo/promo_menu";
import OrderAdditionalInfo from "./orderAdditionalInfo";


const { Content, Footer} = Layout;
const { TextArea } = Input;

// const Order = () => {
class Order extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.order_str==undefined){ // Это условие для отладки из браузера, из 1С данные передаются всегда
            this.state = {
                order_data: new _OrderData(),
                additionalParams: new OrderAdditionalInfo(),
                menuType: 'products'
            }
        }else {
            this.state = {
                order_data: new _OrderData(JSON.parse(this.props.order_str)),
                additionalParams: new OrderAdditionalInfo(JSON.parse(this.props.additionalParams)),
                menuType: 'products'
            }
        }
    }

    handleCommentChange = (e) => {
        this.state.order_data.comment = e.target.value;
        console.log(this.state.order_data.comment)
    }

    setItemsList = (itemsList) => {
        console.log(JSON.stringify(itemsList))
        console.log('eto ono ' + JSON.stringify(itemsList))
        this.state.order_data.items = itemsList
    }

    componentDidMount() {
        window.get_order_data = () => {
            return JSON.stringify(this.state.order_data)
        }

        window.setPromoList = (promoList) => {
            this.state.additionalParams.promoList = JSON.parse(promoList)
        }

        window.changeMenuType = (menuType) =>{
            this.setState({
                menuType: menuType
            })
        }

        window.updateAdditionalInfo = (key, value) => {
            this.state.additionalParams[key] = JSON.parse(value);
        }
    }
    render() {
        let menuComponent;
        if (this.state.menuType == 'products'){
            menuComponent = <_ProductsMenu items={this.state.additionalParams.menu}/>
        }else if(this.state.menuType == 'promo'){
            menuComponent = <_PromoMenu items={this.state.additionalParams.promoList} />
        }
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
                                    <div style={{width: '400px'}}><_ProductTable setItemsList={this.setItemsList}/></div>
                                    <br/>
                                    <Row align="bottom">
                                        <TextArea className="" id="textZone" placeholder="Введите примечание" defaultValue={this.state.order_data.comment}
                                                  onChange={this.handleCommentChange}></TextArea>
                                    </Row>
                                </Col>
                                <Col style={{padding:'0px 0px 0px 10px'}} span={14}>
                                    {menuComponent}
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