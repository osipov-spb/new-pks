export const componentRules = {
    // Правила для _ProductsMenu
    productsMenu: {
        disabled: (orderData) => {
            return orderData.status;
        },
        hidden: (orderData) => {
            return false;
        }
    },
    orderHeader: {
        disabled: (orderData) => orderData.status,
        hidden: (orderData) => false
    },
    statusButtonsPrint: {
        disabled: (orderData) => !orderData.status,
        hidden: (orderData) => false
    },
    statusButtonsPay: {
        disabled: (orderData) => orderData.paid,
        hidden: (orderData) => false
    },
    statusButtonsNext: {
        disabled: (orderData) => false,
        hidden: (orderData) => false
    },
    productTable: {
        disabled: (orderData) => orderData.status,
        hidden: (orderData) => false
    },
    // ... другие компоненты
};