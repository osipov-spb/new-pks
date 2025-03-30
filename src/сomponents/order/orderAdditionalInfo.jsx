class OrderAdditionalInfo {
    constructor(
        data = {
            menu: [],
            promoList: []
        }
    )
    {
        this.menu = data.menu;
        this.promoList = data.promoList;
    }
}

export default OrderAdditionalInfo;