const initial = {
    notifications: [],
    unreadLength: 0,
}

const notificationReducer = (state = initial, action) => {
    switch (action.type) {
        case "SetNotification":
            return {
                ...state,
                notifications: action.payload,
                unreadLength: action.payload.filter((item) => item.status === "unread").length,
            }
        case "AddNotification":
            return {
                ...state,
                notifications: [action.payload, ...state.notifications],
                unreadLength: state.unreadLength + 1,
            }
        case "updateNotificationStatus":
            return {
                ...state,
                notifications: state.notifications.map((item) => {
                    if (item.status === "unread") {
                        return { ...item, status: "read" }
                    }
                    return item;
                }),
                unreadLength: 0,
            }

        default:
            return state;
    }
}
export default notificationReducer


