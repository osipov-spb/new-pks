import React from 'react'
import ItemButton from "../products/item_button";
import {Breadcrumb, Input, Pagination, Row, Layout, Col} from 'antd';
// import MenuBreadcrumb from "./menu_breadcrumb";
import FolderButton from "../products/folder_button";

const { Search } = Input;

class _PromoMenu extends React.Component {
    constructor(props) {
        super(props);
        this.pageSize = 4
        this.menu = [
            {
                title: 'Акция 1',
                id: '1',
                price: 2000,
                discount: false,
                stop: false
            },
            {
                title: 'Акция 2',
                id: '2',
                price: 1500,
                discount: true,
                stop: false
            },
            {
                title: 'Акция 3',
                id: '3',
                price: 370,
                discount: false,
                stop: false
            },
            {
                title: 'Акция 4',
                id: '4',
                price: 560,
                discount: false,
                stop: false
            },
            {
                title: 'Акция 5',
                id: '5',
                price: 2670,
                discount: true,
                stop: false
            },
            {
                title: 'Акция 6',
                id: '2',
                price: 1500,
                discount: true,
                stop: false
            },
            {
                title: 'Акция 7',
                id: '3',
                price: 370,
                discount: false,
                stop: false
            },
            {
                title: 'Акция 8',
                id: '4',
                price: 560,
                discount: false,
                stop: false
            },
            {
                title: 'Акция 9',
                id: '5',
                price: 2670,
                discount: true
            },
            {
                title: 'Акция 10',
                id: '6',
                price: 950,
                discount: true
            },
            {
                title: 'Акция 11',
                id: '7',
                price: 1250,
                discount: false
            },
            {
                title: 'Акция 12',
                id: '8',
                price: 150,
                discount: false
            },
            {
                title: 'Акция 13',
                id: '9',
                price: 250,
                discount: false
            }
        ];
        this.state = {
            currentPath: [
                {
                    level: 0,
                    id: 0,
                    title: 'Меню'
                },
                {
                    level: 1,
                    id: 1,
                    title: 'Меню 2'
                },
                {
                    level: 2,
                    id: 2,
                    title: 'Меню 3'
                }
            ],
            items: this.menu,
            currentPage: 1,
            currentItems: this.menu.slice(0,this.pageSize)
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
        return (
            <div>

                <div className="style-btn-wrapper">
                    {this.state.currentItems
                        ? this.state.currentItems.map((item, index) => {
                            if (!item.folder) {
                                return (
                                    <div key={item.id}>
                                        <ItemButton data={{
                                            index: index,
                                            price: item.price,
                                            discount: item.discount,
                                            title: item.title
                                        }}/>
                                    </div>
                                )
                            } else {
                                return (
                                    <div key={item.id}>
                                    <FolderButton data={{
                                        index: index,
                                        price: item.price,
                                        discount: item.discount,
                                        title: item.title
                                    }}/>
                                </div>)
                            }
                        })
                        : null}
                </div>
                <Pagination current={this.state.currentPage} onChange={this.changePage} total={this.state.items.length} pageSize = {this.pageSize} />
            </div>
        )
    }
}

export default _PromoMenu;