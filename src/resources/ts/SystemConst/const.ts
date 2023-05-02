export const Resolutions = {
    OsType:{
        PC:0,
        ANDROID:1,
        IPHONE:2
      },
    ResolutionsToCheckIphone: [
        {width: 120,  height:160},
        {width: 180,  height:320},
        {width: 240,  height:320},
        {width: 360,  height:640},
        {width: 480,  height:640},
        {width: 576,  height:768},
        {width: 576, height:1024},
        {width: 720, height:1280},
        {width: 768, height:1280},
        {width: 800, height:1280},
        {width: 900, height:1280},
        {width: 1000, height:1280},
        {width: 1080, height:1920},
        {width: 1200, height:1920},
        {width: 1440, height:2560},
        {width: 2160, height:3840},
        {width: 2160, height:4096},
        {width: 3000, height:4000},
        {width: 3120, height:4096}
    ],
    ResolutionsToCheckPcAndroid: [
        {width: 160,  height:120},
        {width: 320,  height:180},
        {width: 320,  height:240},
        {width: 640,  height:360},
        {width: 640,  height:480},
        {width: 768,  height:576},
        {width: 1024, height:576},
        {width: 1280, height:720},
        {width: 1280, height:768},
        {width: 1280, height:800},
        {width: 1280, height:900},
        {width: 1280, height:1000},
        {width: 1920, height:1080},
        {width: 1920, height:1200},
        {width: 2560, height:1440},
        {width: 3840, height:2160},
        {width: 4096, height:2160},
        {width: 4096, height:3120}
    ],
    URL: "http://localhost:8080/api/",
    STATE: {
      INIT : 0,      // 初期
      PLAY : 1,      // 通常
      REQUEST : 2,   // 通信中
      ANALYSIS : 3,  // 解析中
      COMP : 4,      // 完了
    },

    SEND_FILE: "send_file",
    GET_RESULT: "result",
    GET_SCHEDULE: "schedules",
    UPDATE_SCHEDULE: "update_schedule",
    GET_SCHEDULE_ALL: "schedule_all"
  }