const initialState = {
    userAvature: null,
    userId: null,
    reciptionistAvature: null,
    reciptionistId: null,

    managerAvature: null,
    managerId: null,

}
const userAvatureReducer = (state = initialState, action) => {
    console.log(state)
    switch (action.type) {
        case "setUserAvatar":
            return {
                ...state,
                userAvature: action.payload.avatare,
                userId: action.payload.id
            }
        case "setReciptionistAvatar":
            return {
                ...state,
                reciptionistAvature: action.payload.avatare,
                reciptionistId: action.payload.id,

            }
        case "setManagerAvatare":
            return {
                ...state,
                managerAvature: action.payload.avatare,
                managerId: action.payload.id,

            }
        case "removeUserAvatar":
            return initialState;
        default:
            return state;
    }
}

export default userAvatureReducer;