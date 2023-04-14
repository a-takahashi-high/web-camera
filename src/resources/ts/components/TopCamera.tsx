import React, {useRef, useState, useEffect, forwardRef} from 'react';
import { createRoot} from 'react-dom/client';
import axios from "axios";
import {VideoArea, VideoAreaHandles} from "./VideoArea";
import {Resolutions} from "../../ts/SystemConst/const";
import "../../css/app.css";
//import { useDispatch, useSelector } from "react-redux";
//import { SET_VIDEO, setAction } from "../reducks/video/actions";
//import {Videos} from "../reducks/store/initialState";

function TopCamera() {
  //const dispatch = useDispatch();
  //const selector = useSelector((state:Videos) => state);
  /*dispatch(setAction({
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
  }));*/
  

  const [visible, setVisible] = useState<boolean>(false);
  const [saveCanvasList, setCanvasList] = useState<Array<HTMLDivElement>>([]);
  const state = useRef<number>(Resolutions.STATE.INIT);
  const childRef = useRef<VideoAreaHandles>(null);
  const videoListRef = useRef<Array<HTMLCanvasElement | null>>([]);
  const checkListRef = useRef<Array<HTMLInputElement | null>>([]);

  //let state = Resolutions.STATE.INIT;

  //console.log("変数宣言");


  useEffect(() => {
    //console.log("状態:" + state);
    switch(state.current){
      case Resolutions.STATE.INIT:
        //cameraOptions = document.querySelector('.video-options>select');
        //videoSelect = document.querySelector('select#videoSource');
        //console.log("チェック");
        //console.log(selector.backCameraId);
        start();
        break;
      case Resolutions.STATE.PLAY:
      case Resolutions.STATE.ANALYSIS:
        break;
      case Resolutions.STATE.REQUEST:
        sendImage();
        break;
    }

  });

  // 開始処理
  function start() {
    console.log("チェック");
    childRef.current!.setVideo();
  }

  //画像撮影の準備
  function shootImagePreparation(){
    // 撮影タイマー待機
    let timerElement:HTMLInputElement | null = document.getElementById('timer') as HTMLInputElement | null;
    let countElement:HTMLInputElement | null = document.getElementById('count') as HTMLInputElement | null;
    let count:number = timerElement == null ? 0 : Number(timerElement!.value);
    if(count > 0){
      countElement!.textContent = count.toString();
      playSeCountDown();
      return new Promise<void>( resolve => {
        const timer = setInterval(() => {
          // 撮影タイマー待機
          let count:number = countElement == null ? 0 : Number(countElement!.textContent);
          if(count > 1){
            countElement!.textContent = (count - 1).toString();
            playSeCountDown();
          }else{
            countElement!.textContent = '0';
            shootImageMain();
            clearInterval(timer);
            return resolve();
          }
        }, 1000
        );
      })
    }else{
      shootImageMain();
    }
  }

  // 画像撮影
  function shootImageMain() {
    var imageCount = getImageCount();
    if(imageCount >= 5){
      alert('5件までしか撮影できません');
      return;
    }
    var video = childRef.current?.getVideo();
    //var video = document.getElementById('video');
    var div = document.createElement("div");
    div.setAttribute("className", "canvas_list");
    var canvas = document.createElement("canvas");
    //canvasの描画モードを2sに
    var ctx:CanvasDrawImage = canvas.getContext('2d') as CanvasDrawImage;
    var checkbox = document.createElement('input');
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("name", "image[]");

    //同じサイズをcanvasに指定
    let osType:number = childRef.current!.getOsType();
    let cameraOptions:HTMLInputElement | null = childRef.current!.getCameraOptions();
    let cameraResolutionsList:{ [key:string]: { [key:string]: number; }; } = childRef.current!.getCameraResolutionsList();
    let setVideoHeight = childRef.current!.getVideoHeight();
    let setVideoWidth = childRef.current!.getVideoWidth();
    if(osType == Resolutions.OsType.ANDROID){
      canvas.setAttribute("width", cameraResolutionsList[cameraOptions!.value].maxHeight.toString());
      canvas.setAttribute("height", cameraResolutionsList[cameraOptions!.value].maxWidth.toString());
    }else{
      canvas.setAttribute("width", cameraResolutionsList[cameraOptions!.value].maxWidth.toString());
      canvas.setAttribute("height", cameraResolutionsList[cameraOptions!.value].maxHeight.toString());
    }

    checkbox.setAttribute("style", "margin-bottom:20px; text-alignn:left;");

    var stylestr = "height:"+ setVideoHeight + "px; width:" + setVideoWidth+"px;";
    canvas.setAttribute("style", stylestr);

    // SE再生
    playSeShoot();

    //canvasにコピー
    if(osType == Resolutions.OsType.ANDROID){
      ctx.drawImage(video!, 0, 0, 
        cameraResolutionsList[cameraOptions!.value].maxHeight, 
        cameraResolutionsList[cameraOptions!.value].maxWidth);
    } else {
      ctx.drawImage(video!, 0, 0, 
        cameraResolutionsList[cameraOptions!.value].maxWidth, 
        cameraResolutionsList[cameraOptions!.value].maxHeight);
    }
    console.log("ここまで１");
    div.appendChild(checkbox);
    div.appendChild(canvas);
    console.log("ここまで２");
    let imagesElement:HTMLImageElement | null = document.getElementById('images') as HTMLImageElement | null;
    console.log("ここまで３："+ imagesElement);
    imagesElement!.appendChild(div);
    console.log("ここまで4");
    checkListRef.current.push(checkbox);
    videoListRef.current.push(canvas);
    setCanvasList([...saveCanvasList,div]);
    console.log("追加");
  }

  // 撮影用SEの再生
  function playSeShoot() {
    let se:HTMLAudioElement | null = document.getElementById('shootSe') as HTMLAudioElement | null;
    se!.load();
    se!.currentTime = 0;
    se!.play();
  }

  // カウントダウン用SEの再生
  function playSeCountDown() {
    let se:HTMLAudioElement | null = document.getElementById('countDownSe') as HTMLAudioElement | null;
    se!.load();
    se!.currentTime = 0;
    se!.play();
  }


  //画像削除
  function removeImage(){
    //let images:HTMLCollectionOf<HTMLElement> | null = document.getElementById('images') as HTMLCollectionOf<HTMLElement> | null;
    //let checkBoxElement : HTMLCollectionOf<HTMLInputElement> | null = document.getElementById('image[]') as HTMLCollectionOf<HTMLInputElement> | null;
    //let imageCollection:HTMLCollectionOf<HTMLElement> = document.images as HTMLCollectionOf<HTMLElement>;
    
    console.log("イメージ："+videoListRef.current.length );
    if(videoListRef.current.length == 0){
      return;
    }
    /*let obj:HTMLImageElement | null = imageCollection.elements['image[]'] as HTMLImageElement | null;
    if(!obj){
      return;
    }*/
    //let images:HTMLCollectionOf<HTMLElement> | null = document.getElementById('images') as HTMLCollectionOf<HTMLElement> | null;
    let len = videoListRef.current.length;
    let imagesElement:HTMLImageElement | null = document.getElementById('images') as HTMLImageElement | null;
    if (len == 1){
      if(checkListRef.current[0]!.checked ) {
        let checkFlg = window.confirm('1件の画像を削除しますか？');
        if(checkFlg){
          console.log("チェック0："+imagesElement);
          imagesElement!.removeChild(saveCanvasList[0]);
          console.log("チェック1："+imagesElement);
          setCanvasList([]);
          videoListRef.current!.splice(0);
          checkListRef.current!.splice(0);
          console.log("チェック2："+ videoListRef.current.length);
        }
      }
    }else{
      let deletecount = 0;

      checkListRef.current!.forEach(element => {
        if(element!.checked){
          deletecount++;
        }
      });
      if(deletecount > 0){
        let checkFlg = window.confirm(deletecount+'件の画像を削除しますか？');
        if(checkFlg){
          for(var i=len-1; i >= 0; i-- ) {
            if(checkListRef.current[i]!.checked ) {
              imagesElement!.removeChild(saveCanvasList[i]);
              setCanvasList(saveCanvasList.filter((item,index) => (index !== i)));
              videoListRef.current!.splice(i);
              checkListRef.current!.splice(i);
            }
          }
        }
      }
    }
  }

  //画像解析開始
  function startAnalysis() {
    state.current = Resolutions.STATE.REQUEST;
    console.log("状態確認:"+state);
    setVisible(true);
    sendImage();
  }

  // 解析対象画像送信
  function sendImage(){
    if(videoListRef.current.length == 0){
      return;
    }


    /*var obj = document.images.elements['image[]'];
    if(!obj){
      return;
    }
    var images = document.getElementById('images');
    var len = obj.length;l*/
    
    let len = videoListRef.current.length;
    let imagesElement:HTMLImageElement | null = document.getElementById('images') as HTMLImageElement | null;
    if (len == 1){
      if(checkListRef.current[0]!.checked ) {
        let checkFlg = window.confirm('1件の画像を解析しますか？');
        if(checkFlg){
          moveFile(0, videoListRef.current[0]);
        }
      }
    }else{
      let sendcount = 0;

      checkListRef.current!.forEach(element => {
        if(element!.checked){
          sendcount++;
        }
      });
      if(sendcount > 0){
        let checkFlg = window.confirm(sendcount+'件の画像を解析しますか？');
        if(checkFlg){
          for(var i=len-1; i >= 0; i-- ) {
            if(checkListRef.current[i]!.checked ) {
              moveFile(i, videoListRef.current![i]);
            }
          }
        }
      }
    }
    state.current = Resolutions.STATE.ANALYSIS;
    waitResult();
  }

  // カメラ変更
  /*function changeVideo(){
    //console.log("videoChange()");

    for (let track of stream.getTracks()) { 
        track.stop()
    }
    //console.log("cameraOptions.value :", cameraOptions.value);
    findMaximumWidthHeightForCamera();
  }*/

  // 撮影した画像の数を取得
  function getImageCount() {
    let checkBoxElement : HTMLCollectionOf<HTMLInputElement> | null = document.getElementById('image[]') as HTMLCollectionOf<HTMLInputElement> | null;
    if(!checkBoxElement){
      return 0;
    }
    var len = checkBoxElement.item.length;
    if (!len){
      return 1;
    }else{
      return len;
    } 
  }

      //画像ダウンロード
      /*function downloadFile(canvas) {
        //canvasからpng生成してダウンロードする
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/jpeg", 1);
        a.download = "image.jpeg";
        a.click();
      }*/

  //解析ファイルの送信
  function moveFile(order:number, canvas:any) {
    //canvasからpng生成してダウンロードする
    var base64 = canvas.toDataURL("image/png", 1);
    
    // ファイルへ保存
    axios.post(Resolutions.URL+Resolutions.SEND_FILE, {
      no: order,
      date: base64
    })
    .then(function ( res ) {
      //送信完了
      console.log("送信完了");
    })
    .catch(function ( error ) {
      console.error('ERROR:', error);
    });
  }

  //解析中
  function waitResult() {
    // 結果取得ファイルへ保存
    var success = 0;
    axios.get(Resolutions.URL+Resolutions.GET_RESULT, {
      params: {
        exam_id: 1,
        exam_date: '2023-03-20',
        user_id: '00001',
        photo_part: 1
      }
    })
    .then(function ( res ) {
      //送信完了
      //console.log("送信完了");
      console.log(res.data);
      if ('success' in res.data){
        success = res.data.success;
        console.log("結果:" + success);
        setVisible(false);
        state.current = Resolutions.STATE.PLAY;
        if (!success){
          alert("解析は成功しました。");
        }else{
          alert("解析は失敗しました。\n再度写真を撮影し解析開始を行なってください。");
        }
        
      }else{
        console.log("繰り返し");
        setTimeout(waitResult, 3000);
      }
    })
    .catch(function ( error ) {
      console.error('ERROR:', error);
    });
  }

  return (
    <div className="App">
      <VideoArea ref={childRef}></VideoArea>
      <div className="controls">
        <button onClick={shootImagePreparation}>撮影</button><br/>
        <div className="timer">
        Timer(s)<input type="number" step="1" min="0" max="99" id="timer" defaultValue="0"/>
        </div>
        <p id="count" className="count"></p>
      </div>
      <hr/>
      <div className="controls">
        <button onClick={removeImage}>削除</button><br/>
        <button onClick={startAnalysis}>解析開始</button><br/>
      </div>
      <hr />
      保存
      <form method="post" action="" name="images" id="images">
      </form>
      <div id="overlay" className="overlay" style={{ visibility: visible ? "visible" : "hidden" }} >
        <div style={{ position: "relative" }}>
          <div>
            <a style={{ position: "absolute", left:-20, top: -50 }}>解析中...</a>
            <div className="loader" ></div>
          </div>
        </div>
        
      </div>

      <audio id="shootSe" preload="auto" src="/storage/se/camera-shutter1.mp3"/>
      <audio id="countDownSe" preload="auto" src="/storage/se/count-down1.mp3"/>
    </div>

  );
}


export default TopCamera;

/*if (document.getElementById('top_camera')) {
  const top_camera = createRoot(document.getElementById('top_camera')!)  
  top_camera.render(<TopCamera />)
  //ReactDOM.render(<TopCamera />, document.getElementById('top_camera'));
}*/
