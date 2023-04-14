import {
    createStore as reduxCreateStore,
    combineReducers,
  } from "redux";
  import thunk from "redux-thunk";
  import { VideosReducer } from "../video/reducers";
  
  export default function createStore() {
    return reduxCreateStore(
      combineReducers({
        videos: VideosReducer,
      }),
    );
  }