// roomReducer.js
const initialState = {
  rooms: [],
  currentRoom: null,
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {

    case "SetRooms":
      return {
        ...state,
        rooms: action.payload,
      };

    case "AddRoom":
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
      };
    case "DeleteRoom":
      return {
        ...state,
        rooms: state.rooms.filter((room) => room._id !== action.payload),
      };
    case "SetCurrentRoom":
      const selectedRoom = state.rooms.find((room) => room._id === action.payload);
      return {
        ...state,
        currentRoom: selectedRoom,  // Set the selected room as the current room
      };
    case "EditRoom":
      return {
        ...state,
        rooms: state.rooms.map((room) =>
          room._id === action.payload._id ? { ...room, ...action.payload } : room
        ),
      };
    default:
      return state;
  }
};

export default roomReducer;
