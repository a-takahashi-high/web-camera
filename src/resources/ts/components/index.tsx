require("../bootstrap");

import React from "react";
import { createRoot} from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from "../reducks/store/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopCamera from "./TopCamera"
import Top from "./Top"

//const store = createStore();

if (document.getElementById("root")) {
    const container = document.getElementById('root');
    const root = createRoot(container!);
    root.render(
        <Provider store={store}> 
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Top />} />
                    <Route path="/camera" element={<TopCamera />} />
                </Routes>
            </BrowserRouter>
        </Provider>
    );
}