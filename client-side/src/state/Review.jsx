import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { addReviewsUrl } from "../utils/api";
import { logged_token } from "../utils/extra";

export const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const auth_token = logged_token();

  const addReviews = async (id, data) => {
    const response = await fetch(`${addReviewsUrl}/${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "authorized-user-token": auth_token,
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    console.log(resData);
    return resData;
  };

  return (
    <ReviewsContext.Provider value={{ addReviews }}>
      {children}
    </ReviewsContext.Provider>
  );
};
