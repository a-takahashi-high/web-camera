import React, {useRef, useImperativeHandle, useEffect, forwardRef } from "react";
import {Resolutions} from "../../ts/SystemConst/const";
import "../../css/app.css";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom';
import { updateVideo} from '../reducks/store/slice';

export interface VideoAreaHandles{
  setVideo():void;
  getOsType():number;
  getVideo():HTMLVideoElement | null;
  getCameraResolutionsList():{ [key:string]: { [key:string]: number; }; } ;
  getCameraOptions():HTMLInputElement | null;
  getVideoHeight():number;
  getVideoWidth():number;
}

export const VideoArea = forwardRef<VideoAreaHandles>((props,ref) => {
  const location = useLocation(); 
  const param = location.state as Object; //型を無理やり与える
  const dispatch = useDispatch();
  const { videos } = useSelector((store:any) => store.analysis);
  //const state = useRef<number>(Resolutions.STATE.INIT);

  let backCameraId:string | null = null;
  let osType = 0;
  let checkResolutions: { [Key: string]: number; }[] = [];
  let leftIndex = 0;
  let rightIndex = 0;
  let midIndex: number = 0;  //  (leftIndex+rightIndex)/2 の解像度がサポートされているかどうかを確認し、結果に基づいて左右を変更します。
  let cameraResolutionsList:{ [key:string]: { [key:string]: number; }; } = {}; // カメラ毎の最大解像度リスト
  let cameraOptions:HTMLInputElement | null = null;
  let videoSelect:any = null;
  let maxResolutionWidth:number;  // 最大ビデオ解像度横
  let maxResolutionHeight:number; // 最大ビデオ解像度縦
  let videoInputs:Array<MediaDeviceInfo> = [];
  let stream:MediaStream | null;
  let setVideoWidth:number;  // 撮影用ビデオのサイズ横
  let setVideoHeight:number; // 撮影用ビデオのサイズ縦

  useEffect(() => {
    cameraOptions = document.querySelector('.video-options>select') as HTMLInputElement  | null;
    videoSelect = document.querySelector('select#videoSource');
  });

  useImperativeHandle(
    ref,
    () => ({
      // 開始処理
      setVideo:() => {
        if(!Object.keys(videos).length){
          console.log("チェック2");
          var ua = window.navigator.userAgent.toLowerCase();
          console.log("端末情報:" + ua);
  
          if (ua.indexOf('iPhone') > 0 || ua.indexOf('iphone') > 0) {
            //console.log("端末 : iPhone");
            osType = Resolutions.OsType.IPHONE;
            checkResolutions = Resolutions.ResolutionsToCheckIphone;
          } else if (ua.indexOf('Android') > 0 || ua.indexOf('android') > 0) {
            //console.log("端末 : Android");
            osType = Resolutions.OsType.ANDROID;
            checkResolutions = Resolutions.ResolutionsToCheckPcAndroid;
          } else {
            //console.log("端末 : PC");
            osType = Resolutions.OsType.PC;
            checkResolutions = Resolutions.ResolutionsToCheckPcAndroid;
          }
          rightIndex = checkResolutions.length;
          // カメラの最大解像度の検索
          findMaximumWidthHeightForCamera();
          console.log("チェック３");
        }

      },
      getOsType:() => {
        return osType;
      },
      getVideo:() => {
        let video:HTMLVideoElement | null = document.getElementById('video') as HTMLVideoElement | null;
        return video;
      },
      getCameraResolutionsList:() => {
        return cameraResolutionsList;
      },
      getCameraOptions:() => {
        return cameraOptions;
      },
      getVideoHeight:() => {
        return setVideoHeight;
      },
      getVideoWidth:() => {
        return setVideoWidth;
      }
    })
  )


  // カメラの最大解像度の検索
  const findMaximumWidthHeightForCamera = () => {
    //console.log("findMaximumWidthHeightForCamera()");
    //console.log("leftIndex:rightIndex = ", leftIndex, ":", rightIndex);
    if(leftIndex > rightIndex) {
        //console.log("MaxResolution Width:Height = ", maxResolutionWidth, ":", maxResolutionHeight);
        leftIndex = 0;
        rightIndex = checkResolutions.length;

        if(backCameraId){
          cameraResolutionsList[cameraOptions!.value] = new Object() as { [key:string]: number; };
          cameraResolutionsList[cameraOptions!.value]!.maxWidth = maxResolutionWidth;
          cameraResolutionsList[cameraOptions!.value]!.maxHeight = maxResolutionHeight;
          // 撮影ビデオのサイズ設定
          setVideoSize();
          //console.log("ビデオサイズ設定："+ backCameraId);
        }else{
          // デバイス毎の設定
          setupDevice();
        }
        return;
    }

    midIndex = Math.floor((leftIndex + rightIndex) / 2);
    //console.log("midIndex : ", midIndex);

    let temporaryConstraints:{[key:string]:any;}|null = null;
    if(backCameraId) {
      temporaryConstraints = {
        "audio": false,
        "video": {
            "mandatory": {
              "minWidth": checkResolutions[midIndex].width,
              "minHeight": checkResolutions[midIndex].height,
              "maxWidth": checkResolutions[midIndex].width,
              "maxHeight": checkResolutions[midIndex].height
            },
            "optional": [{
              "deviceId": cameraOptions!.value
            }]
        }
      }
    } else {
      if(osType != Resolutions.OsType.PC){
        temporaryConstraints = {
        "audio": false,
        "video": {
            "mandatory": {
              "minWidth": checkResolutions[midIndex].width,
              "minHeight": checkResolutions[midIndex].height,
              "maxWidth": checkResolutions[midIndex].width,
              "maxHeight": checkResolutions[midIndex].height
            },
            "optional": [{
              "facingMode": {
                "exact": 'environment'
              }
            }]
          }
        }
      } else {
        temporaryConstraints = {
        "audio": false,
        "video": {
            "mandatory": {
              "minWidth": checkResolutions[midIndex].width,
              "minHeight": checkResolutions[midIndex].height,
              "maxWidth": checkResolutions[midIndex].width,
              "maxHeight": checkResolutions[midIndex].height
            },
            "optional": [{
              "facingMode": 'user'
            }]
          }
        }
      }
    }
    navigator.mediaDevices.getUserMedia(temporaryConstraints).then(checkSuccess).catch(checkError);
  }

  // Constraints設定の成功処理
  const checkSuccess = (stream:any) => {
    //console.log("Success for --> " , midIndex , " ", checkResolutions[midIndex]);
    maxResolutionWidth = checkResolutions[midIndex].width;
    maxResolutionHeight = checkResolutions[midIndex].height;

    leftIndex = midIndex + 1;

    for (let track of stream.getTracks()) { 
        track.stop()
    }
    findMaximumWidthHeightForCamera();
  }

  // Constraints設定の失敗処理
  const checkError = (error:any) => {
    //console.log("Failed for --> " + midIndex , " ", checkResolutions[midIndex],  " ", error);
    rightIndex = midIndex - 1;

    findMaximumWidthHeightForCamera();
  }

  // デバイス毎の設定
  async function setupDevice() {
    //console.log("setupDevice()");

    // webカメラを使う
    await navigator.mediaDevices.enumerateDevices()
    .then(function(devices) { // 成功時
      devices.forEach(function(device) {
          // デバイスごとの処理
          switch ( device.kind ) {
          case 'audioinput':
              break;
          case 'videoinput':
              videoInputs.push((device as MediaDeviceInfo));
              break;
          }
      });
      setCameraSelection(); // カメラ選択BOXの設定
      cameraResolutionsList[cameraOptions!.value] = new Object() as { [key:string]: number; };
      cameraResolutionsList[cameraOptions!.value].maxWidth = maxResolutionWidth;
      cameraResolutionsList[cameraOptions!.value].maxHeight = maxResolutionHeight;
      setVideoSize(); // 撮影ビデオのサイズ設定
      //console.log('最後まで来ました');
    })
    .catch(function(err) { // エラー発生時
      console.error('enumerateDevide ERROR:', err);
    });
  }

  // カメラ選択BOXの設定
  function setCameraSelection(){
    //console.log("setCameraSelection()");
    var optionlist = [];
    for (let i = 0; i < videoInputs.length; i++){
      var selected= "";
      if (videoInputs[i].label.indexOf('back') > -1 || videoInputs[i].label.indexOf('後ろ向き') > -1 || videoInputs[i].label.indexOf('背面') > -1){
        backCameraId = videoInputs[i].deviceId;
        selected = 'selected'
      }
      optionlist[i] = `<option value="${videoInputs[i].deviceId}" ${selected}>${videoInputs[i].label}</option>`;
    }
    cameraOptions!.innerHTML = optionlist.join('');
  }

  // 撮影ビデオのサイズ設定
  async function setVideoSize() {
    //console.log("setVideoSize()");

    var video:HTMLVideoElement | null = document.getElementById('video') as HTMLVideoElement | null;
    stream = await setVideoResolution(
      cameraResolutionsList[cameraOptions!.value].maxWidth , 
      cameraResolutionsList[cameraOptions!.value].maxHeight
    );
    video!.srcObject = stream;
    
    var windowAspect = 0;
    var checkAspect = 0;
    
    if(osType == Resolutions.OsType.PC) {
      // 横長
      checkAspect = window.innerHeight / window.innerWidth;
      windowAspect = cameraResolutionsList[cameraOptions!.value].maxHeight / cameraResolutionsList[cameraOptions!.value].maxWidth;
      if(checkAspect > windowAspect){
        setVideoWidth = window.innerWidth;
        setVideoHeight = window.innerWidth * windowAspect;
      }else{
        setVideoHeight = window.innerHeight;
        setVideoWidth = window.innerHeight / windowAspect;
      }
    } else if(osType == Resolutions.OsType.ANDROID) {
      // 縦長
      checkAspect = window.innerWidth / window.innerHeight;
      windowAspect = cameraResolutionsList[cameraOptions!.value].maxHeight / cameraResolutionsList[cameraOptions!.value].maxWidth;
      if(checkAspect > windowAspect){
        setVideoWidth = window.innerHeight * windowAspect;
        setVideoHeight = window.innerHeight;
      }else{
        setVideoWidth = window.innerWidth;
        setVideoHeight = window.innerWidth / windowAspect;
      }
    } else {
      // 縦長
      checkAspect = window.innerWidth / window.innerHeight;
      windowAspect = cameraResolutionsList[cameraOptions!.value].maxWidth/ cameraResolutionsList[cameraOptions!.value].maxHeight;
      if(checkAspect > windowAspect){
        setVideoWidth = window.innerHeight * windowAspect;
        setVideoHeight = window.innerHeight;
      }else{
        setVideoWidth = window.innerWidth;
        setVideoHeight = window.innerWidth / windowAspect;
      }
    }

    //console.log("設定するVideoのサイズ : 横 : ", setVideoWidth, " : 縦 : ", setVideoHeight);

    dispatch(updateVideo({
      backCameraId: backCameraId,
      osType: osType,
      checkResolutions:checkResolutions,
      leftIndex: leftIndex,
      rightIndex: rightIndex,
      midIndex: midIndex,
      cameraResolutionsList: cameraResolutionsList,
      cameraOptions: cameraOptions,
      videoSelect: videoSelect,
      maxResolutionWidth: maxResolutionWidth,
      maxResolutionHeight: maxResolutionHeight,
      videoInputs: videoInputs,
      stream: stream,
      setVideoWidth: setVideoWidth,
      setVideoHeight: setVideoHeight          
    }));

    return new Promise<void>((resolve) => {
      video!.onloadedmetadata = () => {
        video!.width = setVideoWidth;
        video!.height = setVideoHeight;

        resolve();
      };
    });




  }

  // 撮影用ビデオの解像度設定
  async function setVideoResolution(width:number, height:number) {
    //console.log("setResolution()");
    //console.log("設定する解像度 : 横 : ", width, " : 縦 : ", height);

    var constraints = {
      audio: false,
      video: {
        deviceId: cameraOptions!.value, 
        width: width, 
        height: height 
        //width: 2160, 
        //height: 1080
        //width: 3120, 
        //height: 4096
      }
    };

    var setstream = null;
    await navigator.mediaDevices.getUserMedia(constraints).then(stream => setstream = stream);
    return setstream;
  }

  // カメラ変更
  function changeVideo(){
    //console.log("videoChange()");

    for (let track of stream!.getTracks()) { 
        track.stop()
    }
    //console.log("cameraOptions.value :", cameraOptions.value);
    findMaximumWidthHeightForCamera();
  }
  
  return (
    <div className="App">
      <div>
        <video 
          id='video' 
          width="480px" 
          height="360px" 
          autoPlay 
          muted 
          playsInline>
        </video>
      </div>
      <div className="video-options">
        <select name="device" id="videoSource" className="custom-select" onChange={changeVideo}>
          <option defaultValue="">Select camera</option>
        </select>
      </div>
    </div>

  );
});

//export default forwardRef(VideoArea);
