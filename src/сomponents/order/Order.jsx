import React from 'react';
import {Button, Card, Col, Input, Layout, Result, Row, Space, Typography} from 'antd';
import {
    ArrowRightOutlined,
    CheckCircleFilled,
    CheckOutlined,
    CloseOutlined,
    FormOutlined,
    GiftOutlined,
    SearchOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import ProductTable from "./ProductsList";
import OrderHeader from "./OrderHeader";
import OrderData from "./common/OrderData";
import ProductsMenu from "./menu/products/ProductsMenu";
import StatusButtons from "./buttons/StatusButtons";
import OrderAdditionalInfo from "./common/OrderAdditionalInfo";
import {componentRules} from './common/ComponentRules';
import OrderAddressBlock from "./OrderAddressBlock";
import PromoMenu from "./menu/promo/PromoMenu";

const { Search } = Input;
const { Content } = Layout;
const { Text } = Typography;
const { TextArea } = Input;

// noinspection JSUnresolvedReference
class Order extends React.Component {
    constructor(props) {
        super(props);
        const parsedData = JSON.parse(this.props.order_str);
        const existingOrder = parsedData.id != null && parsedData.id !== "";

        this.state = {
            order_data: new OrderData({
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

    updateBSOData = (date, number) =>{
        const newOrderData = { ...this.state.order_data };
        newOrderData.bsoDate = date;
        newOrderData.bsoNumber = number;
        this.setState({ order_data: newOrderData });
    }

    updateScheduledStatus = (isScheduled) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.scheduled = isScheduled;
        // Если сбрасываем флаг scheduled, то и время тоже нужно сбросить
        if (!isScheduled) {
            newOrderData.scheduledTime = null;
        }
        this.setState({ order_data: newOrderData });
    };

    updateScheduledTime = (time) => {
        const newOrderData = { ...this.state.order_data };
        newOrderData.scheduledTime = time ? time.format() : null;
        newOrderData.scheduled = !!time; // Явно устанавливаем scheduled в true/false
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
                    promo_id: null,
                    hide: false,
                    composition: false,
                    promo_uid: ""

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
                    order_data: new OrderData({
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
            const newAdditionalParams = { ...this.state.additionalParams }
            newAdditionalParams.promoList = JSON.parse(promoList);
            const filteredList = newAdditionalParams.promoList?.filter(promo => promo.available > 0) || []
            if (!filteredList.length){
                this.setState({
                    additionalParams: newAdditionalParams,
                    promoCollapsed: true,
                    promosFilled: true
                });
            } else {
                this.setState({ additionalParams: newAdditionalParams });
            }
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
                        padding: '4px 8px',
                        background: '#fafafa',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Space size='small'>
                                <ShoppingCartOutlined style={{ color: '#1890ff' }} />
                                <Text strong style={{ color: '#595959' }}>МЕНЮ</Text>
                            </Space>
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
                                    boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
                                    background: '#73d13d',
                                    borderColor: '#73d13d',
                                }}
                                icon={<ArrowRightOutlined />}
                                onClick={() => this.setState({
                                    productsCollapsed: true,
                                    promoCollapsed: false,
                                    menuType: 'promo',
                                    productsFilled: true
                                })}
                            >
                                Продолжить
                            </Button>
                        </div>
                    </div>
                    <ProductsMenu
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
                            <Space size='small'>
                                <GiftOutlined style={{ color: '#faad14' }} />
                                <Text strong style={{ color: '#595959' }}>АКЦИИ</Text>
                            </Space>

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
                                boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
                                background: '#73d13d',
                                borderColor: '#73d13d',
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
                    <OrderHeader
                        order_data={this.state.order_data}
                        updatePackage={this.updatePackageType}
                        updateScheduledStatus={this.updateScheduledStatus}
                        updateScheduledTime={this.updateScheduledTime}
                        updateClient={this.updateClient}
                        updateBSOData={this.updateBSOData}
                        disabled={this.isComponentDisabled('orderHeader')}
                        hidden={this.isComponentHidden('orderHeader')}
                    />

                    <Row gutter={[12, 12]} style={{
                        margin: '0',
                        padding: '0px',
                        flex: 1,
                        display: 'flex'
                    }}>
                        <Col xs={24} md={11} style={{ display: 'flex', flexDirection: 'column', paddingLeft: '0px', paddingRight: '3px'}}>
                            <Card
                                bordered={false}
                                style={{
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
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
                                    <ProductTable
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
                                        gap: '10px',
                                        padding: '20px',
                                        background: 'white',
                                        borderRadius: '0px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}>
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <Text>Итого:</Text>
                                            <Text>{this.state.order_data.summary || 0} ₽</Text>
                                        </div>
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <Text>Доставка:</Text>
                                            <Text>{this.state.order_data.deliveryPrice || 0} ₽</Text>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginTop: '8px',
                                            paddingTop: '12px',
                                            borderTop: '1px solid #f1f1f1'
                                        }}>
                                            <Text strong style={{fontSize: '16px'}}>К оплате:</Text>
                                            <Text strong style={{
                                                fontSize: '16px',
                                                color: '#28a745'
                                            }}>{this.state.order_data.total || 0} ₽</Text>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col xs={24} md={13} style={{display: 'flex', flexDirection: 'column', paddingLeft: '3px', paddingRight: '0px'}}>
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
                                                    <Space size='small'>
                                                        <ShoppingCartOutlined style={{ color: '#1890ff' }} />
                                                        <Text strong style={{ color: '#595959' }}>МЕНЮ</Text>
                                                    </Space>
                                                    {this.state.productsFilled && (
                                                        <CheckCircleFilled style={{ color: '#52c41a', marginLeft: 8 }} />
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
                                                    <Space size='small'>
                                                        <GiftOutlined style={{ color: '#faad14' }} />
                                                        <Text strong style={{ color: '#595959' }}>АКЦИИ</Text>
                                                    </Space>
                                                    {this.state.promosFilled && (
                                                        <CheckCircleFilled style={{ color: '#52c41a', marginLeft: 8 }} />
                                                    )}
                                                </div>
                                                <Button
                                                    href="#"
                                                    data-button-id="products-confirm"
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

                                            {!this.state.existingOrder && this.state.productsFilled
                                                && this.state.promosFilled && (this.state.order_data.total!==0) && (
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
                                            {!this.state.existingOrder && this.state.productsFilled
                                                && this.state.promosFilled && !this.state.order_data.total && (
                                                    <div style={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: '24px'
                                                    }}>
                                                        <Result
                                                            icon={<CloseOutlined style={{ color: '#ff7875' }} />}
                                                            title="Список товаров не заполнен!"
                                                            subTitle="Вернитесь к выбору товаров"
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