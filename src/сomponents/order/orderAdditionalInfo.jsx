class OrderAdditionalInfo {
    constructor(
        data = {
            menu: [
                {
                    title: 'Витаминный салат',
                    id: '1',
                    price: 2000,
                    discount: false,
                    stop: false,
                    folder: true
                },
                {
                    title: 'Чука салат',
                    id: '2',
                    price: 1500,
                    discount: true,
                    stop: false,
                    folder: false
                },
                {
                    title: 'Азиатский краб ролл',
                    id: '3',
                    price: 370,
                    discount: false,
                    stop: false,
                    folder: false
                },
                {
                    title: 'Азия чикен ролл',
                    id: '4',
                    price: 560,
                    discount: false,
                    stop: false,
                    folder: false
                },
                {
                    title: 'Аляска ролл',
                    id: '5',
                    price: 2670,
                    discount: true,
                    stop: false,
                    folder: false
                },
                {
                    title: 'Чука салат',
                    id: '2',
                    price: 1500,
                    discount: true,
                    stop: false,
                    folder: false
                },
                {
                    title: 'Азиатский краб ролл',
                    id: '3',
                    price: 370,
                    discount: false,
                    stop: false,
                    folder: false
                },
                {
                    title: 'Азия чикен ролл',
                    id: '4',
                    price: 560,
                    discount: false,
                    stop: false,
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
            ]
        }
    )
    {
        this.menu = data.menu;
    }


}

export default OrderAdditionalInfo;