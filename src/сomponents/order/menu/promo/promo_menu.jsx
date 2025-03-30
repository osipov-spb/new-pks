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
        this.promoList = props.items;
        this.state = {
            items: this.promoList,
            currentPage: 1,
            currentItems: [],
            selectedItems: []
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
        let promoItems = [];
        if (this.promoList != undefined){
        this.promoList.forEach((item) => {
            promoItems.push(
                <PromoItem data={{
                    title: item.title,
                    id: item.id,
                    available: item.available,
                    info: item.info,
                    items: item.items
                }}
                selectedItems={this.state.selectedItems}/>
            )
        })
        }

       let addSelectedToList = () => {
            console.log(this.state.selectedItems)
            this.state.selectedItems.forEach((dataItem) => {
                window.order_product_list_AddItem(dataItem.title, dataItem.id, dataItem.price)
            })
           window.changeMenuType('products')
        }

        return (
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
                <Button onClick={addSelectedToList}> Сохранить </Button>
            </div>


        )
    }
}

export default _PromoMenu;