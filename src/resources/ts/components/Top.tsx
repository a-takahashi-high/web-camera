import React, {useRef, useState, useEffect, forwardRef, useCallback} from 'react';
import FullCalendar  from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import listPlugin from '@fullcalendar/list';
import { useSelector, useDispatch } from "react-redux";
import { updateVideo, updateSchedule } from '../reducks/store/slice';
import {Resolutions} from "../../ts/SystemConst/const";
import axios from "axios";

function Top() {
  const [scedule, setScedule] = useState<Array<Object>>([]);
  const state = useRef<number>(Resolutions.STATE.INIT);
  const dispatch = useDispatch();
  const { schedules,videos } = useSelector((store:any) => store.cart);
  //console.log(tests.test);



  /*let slecule:Array<Object> = [
    //{title:'明日は', start: '2023-04-09'},
    //{title:'こんな感じで追加できます', start: '2023-04-10', end: '2023-04-12'}
  ];*/
  useEffect(() => {
    console.log("呼び出し");
    switch(state.current){
      case Resolutions.STATE.INIT:
        state.current = Resolutions.STATE.PLAY;
        // 結果取得ファイルへ保存
        var success = 0;
        axios.get(Resolutions.URL+Resolutions.GET_SCHEDULE, {
          params: {
            user_id: 1,
          }
        })
        .then(function ( res ) {
          //通信完了
          console.log("通信完了");
          console.log(res.data);
          dispatch(updateSchedule(res.data));
          let newList = [];
          for (let val of res.data) {
            newList.push(
              {
                title: val.content,
                start: val.start_time,
                end: val.end_time
              });
          }
          setScedule(newList);
        })
        .catch(function ( error ) {
          console.error('ERROR:', error);
        });
        
        break;
      case Resolutions.STATE.PLAY:
        break;
    }


  });

  function handleEventClick(e:any){
    alert(e.event.title);
  }

  function startAnalysis(){
    dispatch(updateVideo({
        backCameraId: "",
        osType: 0,
        checkResolutions:[],
        leftIndex: 9,
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
    }));
    console.log(videos.leftIndex);
  }

  return (
    <div style={{width: '100%', position:'relative'}}>
      <div style={{width: '50%', position:'absolute', left: '50%'}}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          locales={[jaLocale]}
          locale='ja'
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek listWeek',
          }}
          events={scedule}
          eventClick={handleEventClick}
        />
        <div className="controls">
          <button onClick={startAnalysis}>解析開始</button><br/>
        </div>
      </div>
    </div>
  );
}

export default Top;
