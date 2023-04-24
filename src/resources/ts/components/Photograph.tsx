import React, {useRef, useState, useEffect, forwardRef} from 'react';
import {VideoArea, VideoAreaHandles} from "./VideoArea";
import {Resolutions} from "../SystemConst/const";
import { useNavigate } from "react-router-dom"
import "../../css/app.css";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom';
import { updatePhoto} from '../reducks/store/slice';


function Photograph() {
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState<string>("撮影");
  const location = useLocation(); 
  const param = location.state as Object; //型を無理やり与える
  const dispatch = useDispatch();
  const { photos, videos } = useSelector((store:any) => store.analysis);

  const [visible, setVisible] = useState<boolean>(false);
  const [saveCanvasList, setCanvasList] = useState<Array<HTMLDivElement>>([]);
  const state = useRef<number>(Resolutions.STATE.INIT);
  const childRef = useRef<VideoAreaHandles>(null);
  const videoListRef = useRef<HTMLCanvasElement | null>(null);
  const checkListRef = useRef<Array<HTMLInputElement | null>>([]);

  //let state = Resolutions.STATE.INIT;


  useEffect(() => {
    //console.log("状態:" + state);
    switch(state.current){
      case Resolutions.STATE.INIT:
        start();
        break;
      case Resolutions.STATE.PLAY:
        break;
      case Resolutions.STATE.ANALYSIS:
        
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
    var video = childRef.current?.getVideo();
    //var div = document.createElement("div");
    //div.setAttribute("className", "canvas_list");
    var canvas = document.createElement("canvas");
    //canvasの描画モードを2sに
    var ctx:CanvasDrawImage = canvas.getContext('2d') as CanvasDrawImage;
    //var checkbox = document.createElement('input');
    //checkbox.setAttribute("type", "checkbox");
    //checkbox.setAttribute("name", "image[]");

    //同じサイズをcanvasに指定
    let osType:number = videos.osType;
    //let osType:number = childRef.current!.getOsType();
    //let cameraOptions:HTMLInputElement | null = childRef.current!.getCameraOptions();
    let cameraOptions:HTMLInputElement | null = videos.cameraOptions;
    //let cameraResolutionsList:{ [key:string]: { [key:string]: number; }; } = childRef.current!.getCameraResolutionsList();
    let cameraResolutionsList:{ [key:string]: { [key:string]: number; }; } = videos.cameraResolutionsList;
    //let setVideoHeight = childRef.current!.getVideoHeight();
    let setVideoHeight = videos.setVideoHeight;
    //let setVideoWidth = childRef.current!.getVideoWidth();
    let setVideoWidth = videos.setVideoWidth;
    if(osType == Resolutions.OsType.ANDROID){
      canvas.setAttribute("width", cameraResolutionsList[cameraOptions!.value].maxHeight.toString());
      canvas.setAttribute("height", cameraResolutionsList[cameraOptions!.value].maxWidth.toString());
    }else{
      canvas.setAttribute("width", cameraResolutionsList[cameraOptions!.value].maxWidth.toString());
      canvas.setAttribute("height", cameraResolutionsList[cameraOptions!.value].maxHeight.toString());
    }

    //checkbox.setAttribute("style", "margin-bottom:20px; text-alignn:left;");

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
    //div.appendChild(checkbox);
    let imagesElement:HTMLDivElement | null = document.getElementById('images') as HTMLDivElement | null;
    //if(imageElement.){
    if(imagesElement!.children!.length > 0){
      imagesElement!.removeChild(videoListRef.current!);
    }
    //}

    imagesElement!.appendChild(canvas);
    
    //checkListRef.current.push(checkbox);
    videoListRef.current = canvas;
    //setCanvasList([...saveCanvasList,div]);
    setButtonText("再撮影");
    state.current = Resolutions.STATE.PLAY;
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

  //画像解析開始
  function nextStage() {
    if(videoListRef.current == null){
      alert("まだ写真撮影が行われていません。");
      return;
    }
    let photolist = photos;
    photolist = [...photolist,videoListRef.current];
    dispatch(updatePhoto(photolist));
    let imagesElement:HTMLDivElement | null = document.getElementById('images') as HTMLDivElement | null;
    imagesElement!.removeChild(videoListRef.current!);
    setButtonText("撮影");
    videoListRef.current = null;
    if(((param as any).number as number) <= photos.length + 1){
      // 画面遷移する
      navigate('/photolist');
    }
  }



  return (
    <div className="App">
      <a>{(photos.length + 1).toString() + "枚目"}</a>
      <a>{"部位：" + (param as any).parts}</a>
      <VideoArea ref={childRef}></VideoArea>
      <div className="controls">
        <button onClick={shootImagePreparation}>{buttonText}</button><br/>
        <div className="timer">
        Timer(s)<input type="number" step="1" min="0" max="99" id="timer" defaultValue="0"/>
        </div>
        <p id="count" className="count"></p>
      </div>
      <hr/>
      <div className="controls">
        <button onClick={nextStage}>次へ</button><br/>
      </div>
      <hr />
      保存
      <form method="post" action="" name="images">
        <div className='canvas_list' id="images">

        </div>
      </form>

      <audio id="shootSe" preload="auto" src="/storage/se/camera-shutter1.mp3"/>
      <audio id="countDownSe" preload="auto" src="/storage/se/count-down1.mp3"/>
    </div>

  );
}


export default Photograph;
