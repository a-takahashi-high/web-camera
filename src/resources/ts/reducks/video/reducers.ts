import * as Actions from "./actions";
import { videos } from "../store/initialState";

export const VideosReducer = (state = videos, action:any) => {
  switch (action.type) {
    case Actions.SET_VIDEO:
    return {
      ...state,
      ...action.payload,
    };
    default:
      return state;
  }
};