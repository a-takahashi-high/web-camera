import React, {useRef, useState, useEffect, forwardRef, useCallback} from 'react';
import FullCalendar  from "@fullcalendar/react";
import EventClickArg from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import listPlugin from '@fullcalendar/list';


function Top() {
  let test:Array<Object> = [
    {title:'明日は', start: '2023-04-09'},
    {title:'こんな感じで追加できます', start: '2023-04-10', end: '2023-04-12'}
  ];
  useEffect(() => {

  });

  function handleEventClick(){
    alert("テスト");
  }

  function startAnalysis(){
  }

  return (
    <div style={{width: '50%', position:'relative'}}>
      <div style={{width: '50%', position:'absolute', left: '75%'}}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          locales={[jaLocale]}
          locale='ja'
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek listWeek',
          }}
          events={test}
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
