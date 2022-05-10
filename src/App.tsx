import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Boards from './screens/Boards';
import Intro from './screens/Intro';

const App = (): React.ReactElement => {
    return(
        <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/boards" element={<Boards />} />
        </Routes>
    );
};

export default App;