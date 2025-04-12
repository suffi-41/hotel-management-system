export const depositMoney = (amount) => {
    return (dispatch) => {
        dispatch({
            type: 'deposit',
            payload: amount
        })
    }
}

export const widraMoney = (amount) => {
    return (dispatch) => {
        dispatch({
            type: 'widthraw',
            payload: amount
        })
    }
}


// lgoin and logout action creater
export const login = () => {
    return (dispatch) => {
        dispatch({
            type: 'login',
        })
    }
}
export const logout = () => {
    return (dispatch) => {
        dispatch({
            type: 'logout',
        })
    }
}

export const Adminlogin = () => {
    return (dispatch) => {
        dispatch({
            type: 'admin-login',
        })
    }
}
export const Adminlogout = () => {
    return (dispatch) => {
        dispatch({
            type: 'admin-logout',
        })
    }
}

export const Stafflogin = () => {
    return (dispatch) => {
        dispatch({
            type: 'staff-login',
        })
    }
}

export const Stafflogout = () => {
    return (dispatch) => {
        dispatch({
            type: 'staff-logout',
        })
    }
}


//Employees action creater


export const AddEmployee = (employee) => {
    return (dispatch) => {
        dispatch({
            type: 'AddEmployee',
            payload: employee
        })
    }
}

export const EditEmployee = (updateDetials) => {
    return (dispatch) => {
        dispatch({
            type: 'EditEmployee',
            payload: updateDetials
        })
    }
}

export const SetEmployees = (employees) => {
    return (dispatch) => {
        dispatch({
            type: 'SetEmployees',
            payload: employees
        })
    }
}

export const SetCurrentEmployee = (id) => {
    return (dispatch) => {
        dispatch({
            type: 'SetCurrentEmployee',
            payload: id
        })
    }
}

export const DeleteEmployee = (id) => {
    return (dispatch) => {
        dispatch({
            type: 'DeleteEmployee',
            payload: id
        })
    }
}

// room action creater
export const AddRoom = (room) => {
    return (dispatch) => {
        dispatch({
            type: 'AddRoom',
            payload: room
        })
    }
}

export const EditRoom = (updateDetials) => {
    return (dispatch) => {
        dispatch({
            type: 'EditRoom',
            payload: updateDetials
        })
    }
}

export const SetRooms = (rooms) => {
    return (dispatch) => {
        dispatch({
            type: 'SetRooms',
            payload: rooms
        })
    }
}

export const SetCurrentRoom = (id) => {
    return (dispatch) => {
        dispatch({
            type: 'SetCurrentRoom',
            payload: id
        })
    }
}

export const DeleteRoom = (id) => {
    return (dispatch) => {
        dispatch({
            type: 'DeleteRoom',
            payload: id
        })
    }
}


// User avature
export const setUserAvatuer = (avatare, id) => {
    return (dispatch) => {
        dispatch({
            type: 'setUserAvatar',
            payload: {
                avatare,
                id
            }
        })
    }
}

export const deleteUserAvatuer = () => {
    return (dispatch) => {
        dispatch({
            type: 'removeUserAvatar',
        })
    }
}

// employee and manager avatute and id set 
export const setReciptionistAvatuer = (avatare, id) => {
    return (dispatch) => {
        dispatch({
            type: 'setReciptionistAvatar',
            payload: {
                avatare,
                id,

            }

        })
    }
}

export const setManagerAvatuer = (avatare, id) => {
    return (dispatch) => {
        dispatch({
            type: 'setManagerAvatare',
            payload: {
                avatare,
                id

            }
        })
    }
}


// User 
export const AddUser = (User) => {
    return (dispatch) => {
        dispatch({
            type: 'AddUser',
            payload: User
        })
    }
}

export const EditUser = (updateDetials) => {
    return (dispatch) => {
        dispatch({
            type: 'EditUser',
            payload: updateDetials
        })
    }
}

export const SetUsers = (users) => {
    return (dispatch) => {
        dispatch({
            type: 'SetUsers',
            payload: users
        })
    }
}

export const SetCurrentUser = (id) => {
    return (dispatch) => {
        dispatch({
            type: 'SetCurrentUser',
            payload: id
        })
    }
}

export const DeleteUser = (id) => {
    return (dispatch) => {
        dispatch({
            type: 'DeleteUser',
            payload: id
        })
    }
}

// notification action creater
export const SetNotification = (notifications) => {
    return (dispatch) => {
        dispatch({
            type: 'SetNotification',
            payload: notifications
        })
    }
}

export const AddNotification = (notification) => {
    return (dispatch) => {
        dispatch({
            type: 'AddNotification',
            payload: notification
        })
    }
}

export const updateNotificationStatus = () => {
    return (dispatch) => {
        dispatch({
            type: 'updateNotificationStatus',

        })
    }
}

