import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FaultAlarmVisualization from './pages/FaultAlarmVisualization';
import NodeDetails from './pages/nodeDetails';  // The page that displays node details
import Inventory from './pages/inventory';
import Fault from './pages/Fault';
import LoginPage from './pages/Login';
import NewFault from './pages/Newfault';
import DynamicTreeVisualization from './componants/DynamicTreeVisualization';
import Map from './pages/Map';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/fault" element={<Fault />} />
        <Route path="/faultalarm" element={< FaultAlarmVisualization/>} />
        <Route path="/node/:nodeName" element={<NodeDetails />} /> {/* Define route for node details */}
        <Route path='/newfault' element={<NewFault/>}/>
        <Route path="/faulty-node/:nodeName" element={<DynamicTreeVisualization/>} /> {/* Define route for node details */}
        <Route path="/map" element={<Map />} />

      </Routes>
    </Router>
  );
}

export default App;
