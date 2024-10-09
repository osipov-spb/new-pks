import React from 'react'
import ItemButton from "./item_button";
import {Breadcrumb} from 'antd';
import MenuBreadcrumb from "./menu_breadcrumb";
import FolderButton from "./folder_button";
import { Pagination } from 'antd';

class _ProductsMenu extends React.Component {
    constructor(props) {
        super(props);
        this.pageSize = 4
        this.menu = [
            {
                title: 'Витаминный салат',
                id: '1',
                price: 2000,
                discount: false,
                folder: true
            },
            {
                title: 'Чука салат',
                id: '2',
                price: 1500,
                discount: true,
                folder: false
            },
            {
                title: 'Азиатский краб ролл',
                id: '3',
                price: 370,
                discount: false,
                folder: false
            },
            {
                title: 'Азия чикен ролл',
                id: '4',
                price: 560,
                discount: false,
                folder: false
            },
            {
                title: 'Аляска ролл',
                id: '5',
                price: 2670,
                discount: true,
                folder: false
            },
            {
                title: 'Калифорния с тигровой креветкой ролл',
                id: '6',
                price: 950,
                discount: true,
                folder: false
            },
            {
                title: 'Сэнсей ролл',
                id: '7',
                price: 1250,
                discount: false,
                folder: false
            },
            {
                title: 'Филадельфия Гранд ролл',
                id: '8',
                price: 150,
                discount: false,
                folder: false
            },
            {
                title: 'Филадельфия с тигровой креветкой Гранд ролл',
                id: '9',
                price: 250,
                discount: false,
                folder: false
            },
            {
                title: 'Филадельфия Угорь и Лосось ролл',
                id: '10',
                price: 500,
                discount: false,
                folder: false
            },
            {
                title: 'Авокадо мини ролл',
                id: '11',
                price: 960,
                discount: false,
                folder: false
            },
            {
                title: 'Крабик мини ролл',
                id: '12',
                price: 280,
                discount: false,
                folder: false
            },
            {
                title: 'Огурец мини ролл',
                id: '13',
                price: 280,
                discount: false,
                folder: false
            },
            {
                title: 'Угорь мини ролл',
                id: '14',
                price: 890,
                discount: false,
                folder: false
            },
            {
                title: 'Гавайская пицца итал 25см',
                id: '15',
                price: 590,
                discount: false,
                folder: false
            },
            {
                title: 'Карбонара пицца итал 25см',
                id: '16',
                price: 450,
                discount: false,
                folder: false
            },
            {
                title: 'Петровская пицца итал 25см',
                id: '17',
                price: 560,
                discount: false,
                folder: false
            },
            {
                title: 'Четыре Сезона пицца итал 25см',
                id: '18',
                price: 500,
                discount: false,
                folder: false
            },
            {
                title: 'Карбонара пицца итал 30см',
                id: '19',
                price: 880,
                discount: false,
                folder: false
            },
            {
                title: 'Пикантный цыпленок сулугуни пицца итал 30см',
                id: '20',
                price: 250,
                discount: false,
                folder: false
            },
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
        console.log('all items:');
        console.log(this.state.items)
        console.log('new items:');
        let newItems = this.state.items.slice(num3,Number(num3 + this.pageSize))

        console.log(newItems)

        this.setState({currentItems: newItems});

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
                <Breadcrumb>
                    {this.state.currentPath
                        ? this.state.currentPath.map((item, index) => (
                            <MenuBreadcrumb title={item.title} updatePath={this.updatePath} level={item.level}/>
                        ))
                        : null}
                </Breadcrumb>

                <div className="style-btn-wrapper">
                    {this.state.currentItems
                        ? this.state.currentItems.map((item, index) => {
                            if (!item.folder) {
                                return (
                                    <div>
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
                                    <div>
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

export default _ProductsMenu;