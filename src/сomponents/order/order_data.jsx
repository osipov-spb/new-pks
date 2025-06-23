
class _OrderData {
    constructor(
        ord_data = {
            id: null,
            status: null,
            date: null,
            order_number: '',
            package: 'Зал',
            scheduled: false,
            scheduledTime: '',
            client: '',
            comment: '',
            deliveryPrice: 0,
            summary: 0,
            total: 0,
            project: {},
            address: {},
            paid: false,
            courier: null,
            items: []

        }
    )
    {
        this.id = ord_data.id;
        this.status = ord_data.status;
        this.date = ord_data.date;
        this.order_number = ord_data.order_number;
        this.package = ord_data.package;
        this.scheduled = ord_data.scheduled;
        this.scheduledTime = ord_data.scheduledTime;
        this.client = ord_data.client;
        this.comment = ord_data.comment;
        this.deliveryPrice = ord_data.deliveryPrice;
        this.summary = ord_data.summary;
        this.total = ord_data.total;
        this.project = ord_data.project;
        this.address = ord_data.address;
        this.paid = ord_data.paid;
        this.courier = ord_data.courier;
        this.items = ord_data.items;
    }


}

export default _OrderData;