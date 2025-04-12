import React, { useEffect, useState } from "react";
import RoomCard from "../../components/RoomCard";
import { useSelector } from "react-redux";

export default function ShowRoomCard() {
  const { rooms } = useSelector((state) => state.roomReducer);
  console.log(rooms)
  return (
    rooms && (
      <div className="w-full flex justify-center items-center flex-col p-2 lg:10 mt-10 gap-2" id="available-rooms">
        {rooms &&
          rooms.length !== 0 &&
          rooms?.map((room) => {
            return <RoomCard key={room._id} room={room} />;
          })}
      </div>
    )
  );
}
