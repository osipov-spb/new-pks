class _OrderData {
    constructor(
        ord_data = {
            order_number: '',
            package_type: 'Зал',
            scheduled: false,
            bso: false,
            client: '',
            items: [],
            comment: ''
        }
    )
    {
        this.order_number = ord_data.order_number;
        this.package_type = ord_data.package_type;
        this.scheduled = ord_data.scheduled;
        this.bso = ord_data.bso;
        this.client = ord_data.client;
        this.items = ord_data.items;
        this.comment = ord_data.comment;
    }


}

export default _OrderData;