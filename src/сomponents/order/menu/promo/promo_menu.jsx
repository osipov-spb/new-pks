import React from 'react'
import ItemButton from "../products/item_button";
import {Breadcrumb, Input, Pagination, Row, Layout, Col, Button, Select, List, Divider, Typography } from 'antd';
// import MenuBreadcrumb from "./menu_breadcrumb";
import FolderButton from "../products/folder_button";
import PromoItem from "./promoItem";
import InfiniteScroll from 'react-infinite-scroll-component';

const { Search } = Input;
const { Text } = Typography;

class _PromoMenu extends React.Component {
    constructor(props) {
        super(props);
        this.pageSize = 5
        this.promoList = [
            {
                title: 'Позиция за 100 рублей при заказе от 1000',
                id: '1',
                available: 2,
                info: 'Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции Подробная информация об акции',
                items:[
                    {
                        id: '1',
                        price: 100,
                        title: 'Филадельфия прайм с лососем'
                    },
                    {
                        id: '2',
                        price: 100,
                        title: 'Позиция 2'
                    },
                    {
                        id: '3',
                        price: 100,
                        title: 'Позиция 3'
                    }
                ]
            },
            {
                title: 'Акция 3',
                id: '2',
                available: 7,
                info: 'Подробная информация об акции',
                items:[
                    {
                        id: '1',
                        price: 100,
                        title: 'Филадельфия прайм с лососем'
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
            },
            {
                title: 'Акция 2',
                id: '3',
                available: 3,
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
            },
            {
                title: 'Акция 2',
                id: '4',
                available: 3,
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
            },
            {
                title: 'Акция 2',
                id: '5',
                available: 3,
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
            },
            {
                title: 'Акция 2',
                id: '6',
                available: 3,
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
            },
            {
                title: 'Акция 2',
                id: '7',
                available: 3,
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
            },
        ];
        this.state = {
            items: this.promoList,
            currentPage: 1,
            currentItems: this.promoList.slice(0,this.pageSize)
        }
    }

    componentDidMount() {

    }

    updatePath = (e, level) => {
        let newPath = this.state.currentPath.slice(0, level + 1);
        console.log(newPath)
        this.setState({
            currentPath: newPath
        })
    }
    changePage = (page) => {
        let num1 = Number(page)-1;
        let num2 = this.pageSize;
        let num3 = Number(num1*num2);

        console.log('currentItems:');
        console.log(this.state.currentItems)


        console.log('all items:');
        console.log(this.state.items)

        console.log('new items:');
        let newItems = this.state.items.slice(num3,Number(num3 + this.pageSize))
        console.log(newItems)

        // this.setState({currentItems: []})
        this.setState({currentItems: newItems})

        console.log('state items:');
        console.log(this.state.currentItems)

        this.setState({
            currentPage: page
        })

    }


    openFolder = (id) => {

    }

    render() {
        let promoItems = []
        this.promoList.forEach((item) => {
            promoItems.push(
                <PromoItem data={{
                    title: item.title,
                    id: item.id,
                    available: item.available,
                    info: item.info,
                    items: item.items
                }}/>
            )
        })

        return (
            // <div>
            //     <div className="style-btn-wrapper">
            //         {/*{promoItems}*/}
            //         <List
            //             header={<div>Список доступных акций</div>}
            //             footer={<div><Button> Сохранить </Button></div>}
            //             dataSource={promoItems}
            //             renderItem={(item) => (
            //                 <List.Item>
            //                     {item}
            //                 </List.Item>
            //             )}
            //         />
            //     </div>
            //
            // </div>
            <div>
            <div
                id="scrollableDiv"
                className="style-btn-wrapper-promo"
            >
                <InfiniteScroll
                    dataLength={promoItems.length}
                    // next={loadMoreData}
                    hasMore={promoItems.length < 50}
                    // loader={<Skeleton avatar paragraph={{rows: 1}} active/>}
                    // endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    scrollableTarget="scrollableDiv"
                >
                    <List
                        dataSource={promoItems}
                        // boarded = false
                        renderItem={item => (
                            <List.Item key={item.id}>
                                <div>{item}</div>
                            </List.Item>
                        )}
                    />
                </InfiniteScroll>

            </div>
                <Button> Сохранить </Button>
            </div>


        )
    }
}

export default _PromoMenu;