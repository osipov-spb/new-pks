class OrderAdditionalInfo {
    constructor(
        data = {
            menu: [],
            promoList: [],
            available_projects: []
        }
    )
    {
        this.menu = data.menu;
        this.promoList = data.promoList;
    }
}

export default OrderAdditionalInfo;