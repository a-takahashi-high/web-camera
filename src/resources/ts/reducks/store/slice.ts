import { createSlice } from "@reduxjs/toolkit";
/*export const initialState = {
    users: {
      email: "",
      isSignedIn: false,
      uid: "",
      username: ""
    }
  };*/
  const initialState = {
    schedules:[],
    photos:[],
    videos:{}
  }
  const analysisSlice = createSlice({
    name: "analysis", // sliceの名前、useSelectorでアクセスするときに使う
    initialState, // 初期の状態
    reducers: {
      // プロパティ名がactionCreatorとして作られる
      updateVideo: (state, actions) => {
        return {schedules:state.schedules,photos:state.photos,videos:actions.payload};
      },
      updateSchedule: (state, actions) => {
        return {videos:state.videos,photos:state.photos,schedules:actions.payload};
      },
      updatePhoto: (state, actions) => {
        return {videos:state.videos,schedules:state.schedules,photos:actions.payload};
      },
    }, // reducerを格納、actionCreatorはreducerを作成すると自動的に作られる
  });
  
  export const { updateSchedule } = analysisSlice.actions;
  export const { updateVideo } = analysisSlice.actions;
  export const { updatePhoto } = analysisSlice.actions;
  export default analysisSlice.reducer; // reducerをexport












  

/*export const videos:Videos = {
  backCameraId: "",
  osType: 0,
  checkResolutions:[],
  leftIndex: 0,
  rightIndex: 0,
  midIndex: 0,
  cameraResolutionsList: {},
  cameraOptions: null,
  videoSelect: null,
  maxResolutionWidth: 0,
  maxResolutionHeight: 0,
  videoInputs: [],
  stream: null,
  setVideoWidth: 0,
  setVideoHeight: 0
}

export interface Videos {
    backCameraId: string,
    osType: number,
    checkResolutions:{ [Key: string]: number; }[],
    leftIndex: number,
    rightIndex: number,
    midIndex: number,
    cameraResolutionsList: { [key:string]: { [key:string]: number; }; },
    cameraOptions:HTMLInputElement | null,
    videoSelect:HTMLVideoElement | null,
    maxResolutionWidth:number,
    maxResolutionHeight:number,
    videoInputs:Array<MediaDeviceInfo>,
    stream:MediaStream | null,
    setVideoWidth: number,
    setVideoHeight: number
} */