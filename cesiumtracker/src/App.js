// import { useState, useEffect } from "react";
// import * as Cesium from "cesium";

// import * as satellite from "satellite.js";
// Cesium.Ion.defaultAccessToken =
//   process.env.REACT_APP_CESIUM_TOKEN ||
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxM2JlOTA0Zi1mMjI5LTRjZTctOTM0OS03MzMwMTgzNDM0ODQiLCJpZCI6Mzc5NDY2LCJpYXQiOjE3Njg1MzcyODZ9.UiDxc-GY4VnAH9268odcZLMRI78MID94K9FlOYuD6iQ";

// console.log("Cesium token:", Cesium.Ion.defaultAccessToken);

// function generateOrbitSamples(satrec, startTime, minutes, stepSeconds = 10) {
//   const property = new Cesium.SampledPositionProperty();
//   const startJulian = Cesium.JulianDate.fromDate(startTime);

//   for (let i = 0; i <= minutes * 60; i += stepSeconds) {
//     const time = Cesium.JulianDate.addSeconds(
//       startJulian,
//       i,
//       new Cesium.JulianDate(),
//     );

//     const pv = satellite.propagate(satrec, Cesium.JulianDate.toDate(time));
//     if (!pv.position) continue;

//     const gmst = satellite.gstime(Cesium.JulianDate.toDate(time));
//     const geo = satellite.eciToGeodetic(pv.position, gmst);

//     const position = Cesium.Cartesian3.fromDegrees(
//       satellite.degreesLong(geo.longitude),
//       satellite.degreesLat(geo.latitude),
//       geo.height * 1000, // 🔥 SAME altitude
//     );

//     property.addSample(time, position);
//   }

//   return property;
// }

// function App() {
//   const [tle1, setTle1] = useState("");
//   const [tle2, setTle2] = useState("");
//   const [intervalId, setIntervalId] = useState(null);
//   const [viewer, setViewer] = useState(null);
//   const [satEntity, setSatEntity] = useState(null);
//   const [pastTrackEntity, setPastTrackEntity] = useState(null);
//   const [futureTrackEntity, setFutureTrackEntity] = useState(null);
//   //Create Cesium Viewer once
//   useEffect(() => {
//     const cesiumViewer = new Cesium.Viewer("cesiumContainer", {
//       baseLayer: Cesium.ImageryLayer.fromProviderAsync(
//         Cesium.createWorldImageryAsync({
//           style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
//         }),
//       ),
//       baseLayerPicker: false,
//       timeline: false,
//       animation: false,
//       shouldAnimate: true,
//     });

//     setViewer(cesiumViewer);

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//       cesiumViewer.destroy();
//     };
//   }, []);

//   const startTracking = () => {
//     if (!viewer) return alert("Cesium Viewer not ready");
//     if (!tle1 || !tle2) return alert("Please enter both TLE lines");

//     // Cleanup
//     viewer.entities.removeAll();

//     const satrec = satellite.twoline2satrec(tle1.trim(), tle2.trim());

//     const startTime = new Date();
//     const stopTime = new Date(startTime.getTime() + 90 * 60 * 1000);

//     viewer.clock.startTime = Cesium.JulianDate.fromDate(startTime);
//     viewer.clock.stopTime = Cesium.JulianDate.fromDate(stopTime);
//     viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime);
//     viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
//     viewer.clock.multiplier = 1;

//     const orbitPosition = generateOrbitSamples(satrec, startTime, 90);

//     viewer.entities.add({
//       polyline: {
//         positions: new Cesium.CallbackProperty((time) => {
//           const positions = [];
//           orbitPosition._property._times.forEach((t) => {
//             const p = orbitPosition.getValue(t);
//             if (p) positions.push(p);
//           });
//           return positions; // ✅ Cartesian3[]
//         }, false),
//         width: 2,
//         material: Cesium.Color.RED.withAlpha(0.7),
//       },
//     });

//     // 🛰️ Satellite entity (MOVES ON SAME PATH)
//     const satelliteEntity = viewer.entities.add({
//       position: orbitPosition,
//       billboard: {
//         image: "/satellites.png",
//         scale: 0.6,
//         disableDepthTestDistance: Number.POSITIVE_INFINITY,
//       },
//       orientation: new Cesium.VelocityOrientationProperty(orbitPosition),
//     });

//     viewer.trackedEntity = satelliteEntity;
//   };

//   return (
//     <>
//       <div className="layout">
//         {/* INPUT PANEL */}
//         <div className="container">
//           <h1 className="title">Satellite Tracker</h1>

//           <form
//             className="tle-form"
//             onSubmit={(e) => {
//               e.preventDefault();
//               startTracking();
//             }}
//           >
//             <label htmlFor="tle1" className="labels">
//               Enter TLE Line 1:
//             </label>
//             <textarea
//               className="textbox"
//               value={tle1}
//               onChange={(e) => setTle1(e.target.value)}
//               rows={3}
//               cols={30}
//               id="tle1"
//             />

//             <label htmlFor="tle2" className="labels">
//               Enter TLE Line 2:
//             </label>
//             <textarea
//               className="textbox"
//               value={tle2}
//               onChange={(e) => setTle2(e.target.value)}
//               rows={3}
//               cols={30}
//               id="tle2"
//             />

//             <div></div>
//             <button className="buttons" type="submit">
//               Track Satellite
//             </button>
//           </form>
//         </div>

//         {/* CESIUM MAP */}
//         <div id="cesiumContainer" className="map" />
//       </div>
//     </>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import CountrySatellites from "./pages/CountrySatellites";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/satellites/:country" element={<CountrySatellites />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
