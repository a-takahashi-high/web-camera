/*export const initialState = {
    users: {
      email: "",
      isSignedIn: false,
      uid: "",
      username: ""
    }
  };*/

export const videos:Videos = {
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
} 