import React from 'react';
import { Card, Col, Layout, Row, Typography, Input, Button, Space, Result } from 'antd';
import { ArrowRightOutlined, SearchOutlined, CheckCircleFilled, CheckOutlined, SmileOutlined, EditOutlined, FormOutlined } from '@ant-design/icons';
import _ProductTable from "./products_list";
import _OrderHeader from "./order_header";
import _OrderData from "./order_data";
import _ProductsMenu from "./menu/products/products_menu";
import StatusButtons from "./buttons/status_buttons";
import _PromoMenu from "./menu/promo/promo_menu";
import OrderAdditionalInfo from "./orderAdditionalInfo";
import { componentRules } from './componentRules';
import OrderAddressBlock from "./orderAddressBlock";
import PromoMenu from "./menu/promo/promo_menu";

const { Search } = Input;
const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

class Order extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.order_str == undefined) {
            this.state = {
                order_data: new _OrderData({
                    scheduled: false,
                    scheduledTime: null,
                    items: [],
                    summary: 0,
                    total: 0,
                    deliveryPrice: 0,
                    client: {}
                }),
                additionalParams: new OrderAdditionalInfo(),
                menuType: 'products',
                menuSearchQuery: '',
                productsCollapsed: false,
                promoCollapsed: true,
                productsFilled: false,
                promosFilled: false,
                existingOrder: false,
                selectedPromoItems: []
            };
        } else {
            const parsedData = JSON.parse(this.props.order_str);
            const existingOrder = parsedData.id != null && parsedData.id !== "";

            this.state = {
                order_data: new _OrderData({
                    ...parsedData,
                    items: parsedData.items || [],
                    client: parsedData.client || {}
                }),
                additionalParams: new OrderAdditionalInfo(JSON.parse(this.props.additionalParams)),
                menuType: 'products',
                menuSearchQuery: '',
                productsCollapsed: existingOrder,
                promoCollapsed: existingOrder,
                productsFilled: false,
                promosFilled: false,
                existingOrder: existingOrder,
                selectedPromoItems: []
            };
        }
    }

    isComponentDisabled = (componentName) => {
        const rules = componentRules[componentName];
        if (!rules || !rules.disabled) return false;
        return rules.disabled(this.state.order_data);
    };

    isComponentHidden = (componentName) => {
        const rules = componentRules[componentName];
        if (!rules || !rules.hidden) return false;
        return rules.hidden(this.state.order_data);
    };

    handleMenuSearch = (value) => {
        this.setState({ menuSearchQuery: value });
    };

    handleCommentChange = (e) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.comment = e.target.value;
        this.setState({ order_data: newOrderData });
    };

    updatePackageType = (packageType) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.package = packageType;
        this.setState({ order_data: newOrderData });
    };

    updateScheduledStatus = (isScheduled) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.scheduled = isScheduled;
        this.setState({ order_data: newOrderData });
    };

    updateScheduledTime = (time) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.scheduledTime = time ? time.format() : null;
        if (time) {
            newOrderData.scheduled = true;
        }
        this.setState({ order_data: newOrderData });
    };

    updateClient = async (clientData) => {
        return new Promise(resolve => {
            this.setState(prevState => ({
                order_data: {
                    ...prevState.order_data,
                    client: {
                        ...(prevState.order_data.client || {}),
                        ...clientData
                    }
                }
            }), () => {
                console.log('Client data updated:', this.state.order_data.client);
                resolve();
            });
        });
    };

    addOrUpdateItem = (product_title, product_id, price) => {
        this.setState(prevState => {
            const items = [...prevState.order_data.items];
            const existingIndex = items.findIndex(
                item => item.product_id === product_id && item.price === price
            );

            if (existingIndex >= 0) {
                items[existingIndex] = {
                    ...items[existingIndex],
                    count: items[existingIndex].count + 1,
                    total: (items[existingIndex].count + 1) * price,
                    total_with_discount: (items[existingIndex].count + 1) * price
                };
            } else {
                items.push({
                    lineNumber: (items.length + 1).toString(),
                    product_title,
                    count: 1,
                    price,
                    total: price,
                    total_with_discount: price,
                    product_id,
                    promo_id: null
                });
            }

            return {
                order_data: {
                    ...prevState.order_data,
                    items
                }
            };
        }, this.updateSummary);
    };

    removeItem = (lineNumber) => {
        this.setState(prevState => {
            const items = prevState.order_data.items
                .filter(item => item.lineNumber !== lineNumber)
                .map((item, index) => ({
                    ...item,
                    lineNumber: (index + 1).toString()
                }));

            return {
                order_data: {
                    ...prevState.order_data,
                    items
                }
            };
        }, this.updateSummary);
    };

    editItem = (lineNumber, field, value) => {
        this.setState(prevState => {
            const items = prevState.order_data.items.map(item => {
                if (item.lineNumber === lineNumber) {
                    const updated = { ...item, [field]: value };
                    if (field === 'count' || field === 'price') {
                        updated.total = updated.count * updated.price;
                    }
                    return updated;
                }
                return item;
            });

            return {
                order_data: {
                    ...prevState.order_data,
                    items
                }
            };
        }, this.updateSummary);
    };

    updateSummary = () => {
        const { items = [], deliveryPrice = 0 } = this.state.order_data;
        const summary = items.reduce((sum, item) => sum + (item.total || 0), 0);

        this.setState(prevState => ({
            order_data: {
                ...prevState.order_data,
                summary,
                total: summary + deliveryPrice
            }
        }));
    };

    updateCourier = (courier) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.courier = courier;
        this.setState({ order_data: newOrderData });
    };

    handlePromoItemsChange = (selectedPromoItems) => {
        this.setState({ selectedPromoItems });
    };

    componentDidMount() {
        window.get_order_data = () => {
            return JSON.stringify(this.state.order_data);
        };

        window.orderAddItem = this.addOrUpdateItem;
        window.orderRemoveItem = this.removeItem;
        window.orderEditItem = this.editItem;
        window.orderLoadItems = (items) => {
            this.setState(prevState => ({
                order_data: {
                    ...prevState.order_data,
                    items
                }
            }), this.updateSummary);
        };

        window.updateOrderData = (orderDataStr) => {
            try {
                const data = JSON.parse(orderDataStr);
                this.setState({
                    order_data: new _OrderData({
                        ...this.state.order_data,
                        ...data,
                        items: data.items || this.state.order_data.items
                    })
                });
            } catch (e) {
                console.error('Update error:', e);
            }
        };

        window.setPromoList = (promoList) => {
            const newAdditionalParams = { ...this.state.additionalParams };
            newAdditionalParams.promoList = JSON.parse(promoList);
            this.setState({ additionalParams: newAdditionalParams });
        };

        window.changeMenuType = (menuType) => {
            this.setState({ menuType });
        };

        window.updateAdditionalInfo = (key, value) => {
            const newAdditionalParams = { ...this.state.additionalParams };
            newAdditionalParams[key] = JSON.parse(value);
            this.setState({ additionalParams: newAdditionalParams });
        };

        window.updateAdditionalParams = (paramsData) => {
            try {
                const parsedParams = JSON.parse(paramsData);
                const newAdditionalParams = new OrderAdditionalInfo(parsedParams);

                this.setState({
                    additionalParams: newAdditionalParams
                });
            } catch (e) {
                console.error('Failed to parse additional params:', e);
            }
        };

        window.set_client_phone = (phone) => {
            if (window.clientSelectorSetPhone) {
                window.clientSelectorSetPhone(phone);
            }
            const newOrderData = { ...this.state.order_data };
            newOrderData.client = { ...newOrderData.client, phone };
            this.setState({ order_data: newOrderData });
        };

        window.setSelectedCourier = (courierStr) => {
            try {
                const courier = JSON.parse(courierStr);
                this.updateCourier(courier);
            } catch (e) {
                console.error('Failed to parse courier data:', e);
            }
        };

        window.getSelectedPromoItems = () => {
            return JSON.stringify(this.state.selectedPromoItems);
        };

        window.cleanupOrderFunctions = () => {
            delete window.getSelectedPromoItems;
        };
    }

    componentWillUnmount() {
        delete window.updateAdditionalParams;
        if (window.cleanupOrderFunctions) {
            window.cleanupOrderFunctions();
        }
    }

    render() {
        let menuComponent;
        if (this.state.menuType === 'products') {
            menuComponent = (
                <div>
                    <div style={{
                        padding: '3px 12px',
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text strong style={{ color: '#595959' }}>ТОВАРЫ</Text>
                            {this.state.productsFilled && (
                                <CheckCircleFilled style={{ color: '#52c41a', marginLeft: 8 }} />
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Search
                                placeholder="Поиск по меню"
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="middle"
                                onSearch={this.handleMenuSearch}
                                onChange={(e) => this.handleMenuSearch(e.target.value)}
                                style={{ width: 200 }}
                            />
                            <Button
                                type="primary"
                                href="#"
                                data-button-id="products-confirm"
                                style={{
                                    marginLeft: 8,
                                    fontWeight: 500,
                                    boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)'
                                }}
                                icon={<ArrowRightOutlined />}
                                onClick={() => this.setState({
                                    productsCollapsed: true,
                                    promoCollapsed: false,
                                    menuType: 'promo',
                                    productsFilled: true
                                })}
                            >
                                Перейти к акциям
                            </Button>
                        </div>
                    </div>
                    <_ProductsMenu
                        items={this.state.additionalParams.menu}
                        searchQuery={this.state.menuSearchQuery}
                        disabled={this.isComponentDisabled('productsMenu')}
                    />
                </div>
            );
        } else if (this.state.menuType === 'promo') {
            menuComponent = (
                <div>
                    <div style={{
                        padding: '3px 12px',
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text strong style={{ color: '#595959' }}>АКЦИИ</Text>
                            {this.state.promosFilled && (
                                <CheckCircleFilled style={{ color: '#52c41a', marginLeft: 8 }} />
                            )}
                        </div>
                        <Button
                            type="primary"
                            href="#"
                            data-button-id="promo-confirm"
                            style={{
                                fontWeight: 500,
                                boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)'
                            }}
                            icon={<CheckOutlined />}
                            onClick={() => this.setState({
                                promoCollapsed: true,
                                productsCollapsed: true,
                                promosFilled: true
                            })}
                        >
                            Подтвердить выбор
                        </Button>
                    </div>
                    <PromoMenu
                        promotions={this.state.additionalParams.promoList}
                        onGiftsChange={this.handlePromoItemsChange}
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
                        updateClient={this.updateClient}
                        disabled={this.isComponentDisabled('orderHeader')}
                        hidden={this.isComponentHidden('orderHeader')}
                    />

                    {/*/!* Отладочная информация *!/*/}
                    {/*<div style={{ padding: '10px', background: '#f0f0f0', margin: '10px' }}>*/}
                    {/*    <Text strong>Текущие данные клиента:</Text>*/}
                    {/*    <pre>{JSON.stringify(this.state.order_data.client, null, 2)}</pre>*/}
                    {/*</div>*/}

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
                                    padding: '0px',
                                    flex: 1,
                                    overflow: "hidden"
                                }}>
                                    <_ProductTable
                                        dataSource={this.state.order_data.items}
                                        disabled={this.isComponentDisabled('productTable') || this.state.productsFilled}
                                        hidden={this.isComponentHidden('productTable')}
                                    />
                                </div>

                                <OrderAddressBlock
                                    address={this.state.order_data.address}
                                    courier={this.state.order_data.courier}
                                    onCourierChange={this.updateCourier}
                                    disabled={this.isComponentDisabled('addressBlock')}
                                    hidden={this.isComponentHidden('addressBlock')}
                                    addressDisabled={this.isComponentDisabled('addressFields')}
                                    addressHidden={this.isComponentHidden('addressFields')}
                                    courierDisabled={this.isComponentDisabled('courierFields')}
                                    courierHidden={this.isComponentHidden('courierFields')}
                                />

                                <div style={{
                                    padding: '12px',
                                    borderTop: '1px solid #f0f0f0'
                                }}>
                                    <TextArea
                                        rows={2}
                                        placeholder="Введите примечание к заказу"
                                        value={this.state.order_data.comment || ''}
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
                                    {this.state.productsCollapsed && this.state.promoCollapsed && (
                                        <>
                                            <div style={{
                                                padding: '3px 12px',
                                                background: '#fafafa',
                                                borderBottom: '1px solid #f0f0f0',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Text strong style={{ color: '#595959' }}>ТОВАРЫ</Text>
                                                    {this.state.productsFilled && (
                                                        <CheckCircleFilled style={{ color: '#40a9ff', marginLeft: 8 }} />
                                                    )}
                                                </div>
                                                <Button
                                                    disabled={this.isComponentDisabled('productsEditButton')}
                                                    onClick={() => this.setState({
                                                        productsCollapsed: false,
                                                        promoCollapsed: true,
                                                        menuType: 'products',
                                                        productsFilled: false,
                                                        promosFilled: false
                                                    })}
                                                >
                                                    <FormOutlined />
                                                    Изменить
                                                </Button>
                                            </div>
                                            <div style={{
                                                padding: '3px 12px',
                                                background: '#fafafa',
                                                borderBottom: '1px solid #f0f0f0',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Text strong style={{ color: '#595959' }}>АКЦИИ</Text>
                                                    {this.state.promosFilled && (
                                                        <CheckCircleFilled style={{ color: '#40a9ff', marginLeft: 8 }} />
                                                    )}
                                                </div>
                                                <Button
                                                    disabled={this.isComponentDisabled('promoEditButton')}
                                                    onClick={() => this.setState({
                                                        promoCollapsed: false,
                                                        productsCollapsed: true,
                                                        menuType: 'promo',
                                                        promosFilled: false
                                                    })}
                                                >
                                                    <FormOutlined />
                                                    Изменить
                                                </Button>
                                            </div>

                                            {!this.state.existingOrder && this.state.productsFilled && this.state.promosFilled && (
                                                <div style={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '24px'
                                                }}>
                                                    <Result
                                                        icon={<CheckOutlined style={{ color: '#40a9ff' }} />}
                                                        title="Товары и акции заполнены!"
                                                        subTitle="Вы можете продолжить оформление заказа"
                                                        style={{ padding: 0 }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {(this.state.menuType === 'products' && !this.state.productsCollapsed) ||
                                    (this.state.menuType === 'promo' && !this.state.promoCollapsed) ? (
                                        <div style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'hidden'
                                        }}>
                                            {menuComponent}
                                        </div>
                                    ) : null}
                                </div>

                                <div style={{
                                    padding: '8px',
                                    borderTop: '1px solid #f0f0f0',
                                    textAlign: 'right',
                                    flexShrink: 0
                                }}>
                                    <StatusButtons
                                        order_data={this.state.order_data}
                                        printDisabed={this.isComponentDisabled('statusButtonsPrint') || (!this.state.existingOrder & (!this.state.productsFilled || !this.state.promosFilled))}
                                        printHidden={this.isComponentHidden('statusButtonsPrint')}
                                        payDisabed={this.isComponentDisabled('statusButtonsPay') || (!this.state.existingOrder & (!this.state.productsFilled || !this.state.promosFilled))}
                                        payHidden={this.isComponentHidden('statusButtonsPay')}
                                        nextDisabed={this.isComponentDisabled('statusButtonsNext') || (!this.state.existingOrder & (!this.state.productsFilled || !this.state.promosFilled))}
                                        nextHidden={this.isComponentHidden('statusButtonsNext')}
                                    />
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