import React, {useRef, useState, useEffect, forwardRef} from 'react';
import axios from "axios";
import {VideoArea, VideoAreaHandles} from "./VideoArea";
import {Resolutions} from "../SystemConst/const";
import "../../css/app.css";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom';
import { updatePhoto} from '../reducks/store/slice';
import { useNavigate } from "react-router-dom"


function PhotographList() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const param = location.state as Object; //型を無理やり与える
  const dispatch = useDispatch();
  const { photos, videos } = useSelector((store:any) => store.analysis);
  const state = useRef<number>(Resolutions.STATE.INIT);
  const [comp, setcomp] = useState<boolean>(true);
  const sendcount = useRef<number>(0);
  const buttonText = useRef<string>("解析開始");


  useEffect(() => {
    switch(state.current){
      case Resolutions.STATE.INIT:
        initialise();
        break;
      case Resolutions.STATE.REQUEST:
        break;
    }
  });

  //画像解析開始
  function initialise() {
    let photolist = photos;
    if(!photolist || photolist.length <= 0){
      return;
    }

    let imagesElement:HTMLFormElement | null = document.getElementById('images') as HTMLFormElement | null;

    for(var i=0; i < photolist.length; i++ ) {
      console.log("セット");
      var div = document.createElement("div");
      div.setAttribute("className", "canvas_list");
      div.appendChild(photolist[i]);
      imagesElement!.appendChild(div);
    }

  }

  //画像解析開始
  function startAnalysis() {
    if(state.current != Resolutions.STATE.COMP){
      let photolist = photos;
      state.current = Resolutions.STATE.REQUEST;
      setcomp(false);
      for(var i=0; i < photolist.length; i++ ) {
        moveFile(i, photolist[i]);
      }
    }

  }

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
      sendcount.current++;
      if(sendcount.current >= photos.length){
        waitResult();
      }
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
        setcomp(true);
        //state.current = Resolutions.STATE.PLAY;
        if (!success){
          alert("解析は成功しました。");
          buttonText.current = "次へ";
          state.current = Resolutions.STATE.COMP;

          // 更新処理
          axios.post(Resolutions.URL+Resolutions.UPDATE_SCHEDULE, {
            id: (param as any).id,
            completion: 1
          })
          .then(function ( res ) {
            //送信完了
            console.log("更新完了");
            dispatch(updatePhoto([]));
            navigate('/');
          })
          .catch(function ( error ) {
            console.error('ERROR:', error);
          });

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
      <a>以下のデータを解析します。</a>
      <form method="post" action="" name="images" id="images">
      </form>
      <hr/>
      <div className="controls">
        <button onClick={startAnalysis} disabled={!comp}>{buttonText.current}</button><br/>
      </div>
      <hr />
      <div id="overlay" className="overlay" style={{ visibility: !comp ? "visible" : "hidden" }} >
        <div style={{ position: "relative" }}>
          <div>
            <a style={{ position: "absolute", left:10, top: -10, color: 'white', fontSize: 30 }}>解析中...</a>
            <div className="loader" ></div>
          </div>
        </div>
      </div>
    </div>

  );
}


export default PhotographList;
