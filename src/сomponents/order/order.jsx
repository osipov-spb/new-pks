import { Card, Col, Layout, Row, Typography, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import _ProductTable from "./products_list";
import _OrderHeader from "./order_header";
import _OrderData from "./order_data";
import _ProductsMenu from "./menu/products/products_menu";
import StatusButtons from "./buttons/status_buttons";
import _PromoMenu from "./menu/promo/promo_menu";
import OrderAdditionalInfo from "./orderAdditionalInfo";

const { Search } = Input;
const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input; // Правильный импорт TextArea

class Order extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.order_str==undefined) {
            this.state = {
                order_data: new _OrderData(),
                additionalParams: new OrderAdditionalInfo(),
                menuType: 'products',
                menuSearchQuery: '' // Добавляем состояние для поиска
            }
        } else {
            this.state = {
                order_data: new _OrderData(JSON.parse(this.props.order_str)),
                additionalParams: new OrderAdditionalInfo(JSON.parse(this.props.additionalParams)),
                menuType: 'products',
                menuSearchQuery: ''
            }
        }
    }

    // Добавляем обработчик поиска
    handleMenuSearch = (value) => {
        this.setState({ menuSearchQuery: value });
    };

    handleCommentChange = (e) => {
        this.state.order_data.comment = e.target.value;
        console.log(this.state.order_data.comment)
    }

    setItemsList = (itemsList) => {
        console.log(JSON.stringify(itemsList))
        this.state.order_data.items = itemsList;
        let summary = 0;
        this.state.order_data.items.forEach((productItem) => {
            summary = summary + productItem.total;
        })
        this.state.order_data.summary = summary;
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
        if (this.state.menuType == 'products') {
            menuComponent = (
                <div style={{
                    width: '570px', // Фиксированная ширина
                    height: '610px', // Фиксированная высота
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        padding: '3px 12px',
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0',
                        marginBottom: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text strong style={{ color: '#595959' }}>МЕНЮ ТОВАРОВ</Text>
                        <Search
                            placeholder="Поиск по меню"
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="middle"
                            onSearch={this.handleMenuSearch}
                            onChange={(e) => this.handleMenuSearch(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </div>
                    <_ProductsMenu
                        items={this.state.additionalParams.menu}
                        searchQuery={this.state.menuSearchQuery}
                        style={{ width: '100%' }} // Занимает всю ширину родителя
                    />
                </div>
            );
        } else if(this.state.menuType == 'promo') {
            menuComponent = (
                <div style={{
                    width: '570px', // Фиксированная ширина для промо тоже
                    height: '610px', // Фиксированная высота
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        padding: '8px 12px',
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0',
                        marginBottom: 8,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Text strong style={{ color: '#595959' }}>АКЦИИ И ПРОМО</Text>
                        <Search
                            placeholder="Поиск по акциям"
                            allowClear
                            enterButton={<SearchOutlined />}
                            size="middle"
                            onSearch={this.handlePromoSearch}
                            onChange={(e) => this.handlePromoSearch(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </div>
                    <_PromoMenu
                        items={this.state.additionalParams.promoList}
                        searchQuery={this.state.promoSearchQuery}
                        style={{ width: '100%' }}
                    />
                </div>
            );
        }

        return (
            <Layout style={{
                minHeight: '100vh',
                background: '#fff',
                padding: '0'
            }}>
                <Content style={{ padding: '0', margin: 0 }}>
                    <_OrderHeader order_data={this.state.order_data} />

                    <Row gutter={[12, 12]} style={{ margin: '0', padding: '12px' }}>
                        {/* Левая колонка - товары */}
                        <Col xs={24} md={10}>
                            <Card
                                bordered={false}
                                style={{
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    height: '100%'
                                }}
                                bodyStyle={{ padding: 0 }}
                            >
                                <div style={{
                                    padding: '8px 16px',
                                    background: '#f5f5f5',
                                    borderBottom: '1px solid #e8e8e8'
                                }}>
                                    <Text strong style={{ color: '#595959' }}>СПИСОК ТОВАРОВ</Text>
                                </div>
                                <div style={{
                                    padding: '8px',
                                    height: 'calc(100vh - 220px)',
                                    overflowY: 'auto'
                                }}>
                                    <_ProductTable setItemsList={this.setItemsList} />
                                </div>

                                <div style={{
                                    padding: '12px',
                                    borderTop: '1px solid #f0f0f0'
                                }}>
                                    <TextArea
                                        rows={2}
                                        placeholder="Введите примечание к заказу"
                                        defaultValue={this.state.order_data.comment}
                                        onChange={this.handleCommentChange}
                                        style={{
                                            width: '100%',
                                            borderColor: '#d9d9d9'
                                        }}
                                    />
                                </div>
                            </Card>
                        </Col>

                        {/* Правая колонка - меню */}
                        <Col xs={24} md={14}>
                            <Card
                                bordered={false}
                                style={{
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    height: '100%'
                                }}
                                bodyStyle={{ padding: 0 }}
                            >
                                {menuComponent}

                                <div style={{
                                    padding: '12px',
                                    borderTop: '1px solid #f0f0f0',
                                    textAlign: 'right'
                                }}>
                                    <StatusButtons />
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}

export default Order;