import React, {useRef, useState, useEffect, forwardRef} from 'react';
import axios from "axios";
import {VideoArea, VideoAreaHandles} from "./VideoArea";
import {Resolutions} from "../SystemConst/const";
import "../../css/app.css";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom';
import { updatePhoto} from '../reducks/store/slice';


function PhotographList() {
  const location = useLocation(); 
  const param = location.state as Object; //型を無理やり与える
  const dispatch = useDispatch();
  const { photos, videos } = useSelector((store:any) => store.analysis);


  useEffect(() => {
    initialise();
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



  return (
    <div className="App">
      <a>以下のデータを解析します。</a>
      <form method="post" action="" name="images" id="images">
      </form>
    </div>

  );
}


export default PhotographList;
