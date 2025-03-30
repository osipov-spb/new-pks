class _OrderData {
    constructor(
        ord_data = {
            id: '',
            order_number: '',
            package: 'Зал',
            scheduled: false,
            client: '',
            items: [],
            comment: ''
        }
    )
    {
        this.id = ord_data.id;
        this.order_number = ord_data.order_number;
        this.package = ord_data.package;
        this.scheduled = ord_data.scheduled;
        this.client = ord_data.client;
        this.items = ord_data.items;
        this.comment = ord_data.comment;
    }


}

export default _OrderData;