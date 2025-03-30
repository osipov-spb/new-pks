import React from "react";
import {Button, Tag, Row, Col, Divider, Select, Popover, Carousel, Tabs} from 'antd'
import {InfoCircleOutlined, PercentageOutlined} from "@ant-design/icons";
import { Checkbox } from 'antd';
import {Typography} from "antd";
import MenuBreadcrumb from "../products/menu_breadcrumb";

const { Option } = Select;
const {Text } = Typography;


class ItemSelector extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.items==undefined){
            this.state = {
                count: 0,
                items:[
                    {
                        id: '1',
                        price: 100,
                        title: 'Филадельфия прайм с лососем'
                    },
                    {
                        id: '4',
                        price: 100,
                        title: 'Позиция 2'
                    },
                    {
                        id: '3',
                        price: 100,
                        title: 'Позиция 3'
                    }
                ],
                selectedItems:[]
            }
        }else {
            this.state = {
                count: this.props.count,
                items: this.props.items,
                selectedItems: this.props.selectedItems
            }
        }
    }

    componentDidMount() {

    }

    render() {
        const items = []
        let handlePromoItemSelect = (value) => {
            this.state.items.forEach((item) => {
                if (item.id == value) {
                    this.state.selectedItems.push(item)
                }
            })
            console.log(this.state.selectedItems)
        }
        const selector = <Select style={{
            width: '270px'
        }} placeholder="Выберите позицию из списка" allowClear={true} onChange={handlePromoItemSelect}>
            {this.state.items
                ? this.state.items.map((item, index) => (
                    <Option value={item.id}>{item.title}</Option>
                ))
                : null}
        </Select>
        for (let i = 1; i <= this.state.count; i++) {
            let child = () => {
                return (
                    <>
                        <Select placeholder="Выберите" allowClear={true} o>
                            {this.state.items
                                ? this.state.items.map((item, index) => (
                                    <Option value={item.id}>{item.title}</Option>
                                ))
                                : null}
                        </Select>
                    </>
                )
            }
            items.push({label: i, key: 'item' + i, children: selector})
        }

       return (
            <div>
                <Row align="middle">
                 <Tabs centered size={'small'} items={items} />
                </Row>
            </div>

        )
    };
}

export default ItemSelector