// visibilityRules.js
export const VisibilityRules = {
    // Базовые проверки
    isLocked: (order) => ['completed', 'cancelled', 'approved'].includes(order.status),
    isEditable: (order) => ['draft', 'editing', 'new'].includes(order.status),
    hasItems: (order) => order.items && order.items.length > 0,

    // Правила для компонентов
    orderHeader: {
        visible: (order) => true, // Всегда видим, но может быть заблокирован
        props: (order) => ({
            disabled: VisibilityRules.isLocked(order),
            style: {
                opacity: VisibilityRules.isLocked(order) ? 0.6 : 1,
                pointerEvents: VisibilityRules.isLocked(order) ? 'none' : 'auto'
            }
        })
    },

    productsMenu: {
        visible: (order) => VisibilityRules.isEditable(order),
        props: (order) => ({
            disabled: VisibilityRules.isLocked(order)
        })
    },

    printButton: {
        visible: (order) => VisibilityRules.isLocked(order) && VisibilityRules.hasItems(order),
        props: (order) => ({})
    }
};