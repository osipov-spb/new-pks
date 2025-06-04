import {Card, Col, Layout, Row, Typography, Input, Button} from 'antd';
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
const { TextArea } = Input;

class Order extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.order_str==undefined) {
            this.state = {
                order_data: new _OrderData(
                    {
                        scheduled: false,
                        scheduledTime: null
                    }
                ),
                additionalParams: new OrderAdditionalInfo(),
                menuType: 'products',
                menuSearchQuery: '',
                menuCollapsed: false // Добавлено новое состояние
            }
        } else {
            this.state = {
                order_data: new _OrderData(JSON.parse(this.props.order_str)),
                additionalParams: new OrderAdditionalInfo(JSON.parse(this.props.additionalParams)),
                menuType: 'products',
                menuSearchQuery: '',
                menuCollapsed: false // Добавлено новое состояние
            }
        }
    }

    handleMenuSearch = (value) => {
        this.setState({ menuSearchQuery: value });
    };

    handleCommentChange = (e) => {
        this.state.order_data.comment = e.target.value;
        console.log(this.state.order_data.comment)
    }

    setItemsList = (itemsList) => {
        console.log("Updating items list:", itemsList);

        const newOrderData = { ...this.state.order_data };
        newOrderData.items = itemsList;

        let summary = 0;
        itemsList.forEach((productItem) => {
            summary += productItem.total;
        });

        newOrderData.summary = summary;
        newOrderData.total = summary + (newOrderData.deliveryPrice || 0);

        this.setState({ order_data: newOrderData }, () => {
            console.log("State after update:", this.state.order_data);
        });
    }

    updatePackageType = (packageType) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.package = packageType;
        this.setState({ order_data: newOrderData });
    }

    updateScheduledStatus = (isScheduled) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.scheduled = isScheduled;
        this.setState({ order_data: newOrderData });
    }

    updateScheduledTime = (time) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.scheduledTime = time ? time.format() : null;
        if (time) {
            newOrderData.scheduled = true;
        }
        this.setState({ order_data: newOrderData });
    }

    updateClient = (clientData) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.client = clientData;
        this.setState({ order_data: newOrderData });
    };

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

        window.set_client_phone = (phone) => {
            if (window.clientSelectorSetPhone) {
                window.clientSelectorSetPhone(phone);
            }
            const newOrderData = { ...this.state.order_data };
            newOrderData.client = { ...newOrderData.client, phone: phone };
            this.setState({ order_data: newOrderData });
        };
    }

    render() {
        let menuComponent;
        if (this.state.menuType == 'products') {
            menuComponent = (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        padding: '3px 12px',
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        // marginBottom: 'px',
                        alignItems: 'center',
                        overflow: 'hidden'
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
                    />
                </div>
            );
        } else if(this.state.menuType == 'promo') {
            menuComponent = (
                <div style={{
                    flex: 1,
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
                padding: '0',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Content style={{
                    padding: '0',
                    margin: 0,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <_OrderHeader
                        order_data={this.state.order_data}
                        updatePackage={this.updatePackageType}
                        updateScheduledStatus={this.updateScheduledStatus}
                        updateScheduledTime={this.updateScheduledTime}
                    />

                    <Row gutter={[12, 12]} style={{
                        margin: '0',
                        padding: '6px',
                        flex: 1,
                        display: 'flex'
                    }}>
                        <Col xs={24} md={10} style={{ display: 'flex', flexDirection: 'column' }}>
                            <Card
                                bordered={false}
                                style={{
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                bodyStyle={{
                                    padding: 0,
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
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
                                    flex: 1,
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
                                            borderColor: '#d9d9d9',
                                            marginBottom: '12px'
                                        }}
                                    />

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px',
                                        padding: '12px',
                                        background: '#fafafa',
                                        borderRadius: '4px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text strong>Итого:</Text>
                                            <Text>{this.state.order_data.summary || 0} ₽</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text strong>Доставка:</Text>
                                            <Text>{this.state.order_data.deliveryPrice || 0} ₽</Text>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Text strong>К оплате:</Text>
                                            <Text strong>{this.state.order_data.total || 0} ₽</Text>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} md={14} style={{ display: 'flex', flexDirection: 'column' }}>
                            <Card
                                bordered={false}
                                style={{
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden'
                                }}
                                bodyStyle={{
                                    padding: 0,
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{
                                    flex: 1,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {this.state.menuCollapsed ? (
                                        <div style={{
                                            padding: '12px',
                                            textAlign: 'center',
                                            borderBottom: '1px solid #f0f0f0'
                                        }}>
                                            <Button
                                                type="primary"
                                                onClick={() => this.setState({ menuCollapsed: false })}
                                            >
                                                Развернуть меню
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{
                                                padding: '8px',
                                                background: '#fafafa',
                                                borderBottom: '1px solid #f0f0f0',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <Text strong>Меню товаров</Text>
                                                <Button
                                                    type="primary"
                                                    onClick={() => this.setState({ menuCollapsed: true })}
                                                >
                                                    Завершить выбор
                                                </Button>
                                            </div>
                                            {menuComponent}
                                        </>
                                    )}
                                </div>

                                <div style={{
                                    padding: '8px',
                                    borderTop: '1px solid #f0f0f0',
                                    textAlign: 'right',
                                    flexShrink: 0
                                }}>
                                    <StatusButtons order_data={this.state.order_data} />
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