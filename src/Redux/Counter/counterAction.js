import { LOGIN , BIKE_TYPE } from "./counterActionTypes";

export const login = (phone) => {
  return {
    type: LOGIN,
    payload: {
      loggedIn: true,
      phone: phone
    }
  };
};

export const logout = () => {
 return {
   type: LOGIN,
   payload: {
     loggedIn: false,
     phone: ''
   }
 };
};


export const Bike_tpe = () => {
  return {
    type: BIKE_TYPE,
    payload: 'EV'
  };
};