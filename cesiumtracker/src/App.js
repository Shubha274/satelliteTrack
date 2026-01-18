import { useState, useEffect } from "react";
import * as Cesium from "cesium";

import * as satellite from "satellite.js";
Cesium.Ion.defaultAccessToken =
  process.env.REACT_APP_CESIUM_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxM2JlOTA0Zi1mMjI5LTRjZTctOTM0OS03MzMwMTgzNDM0ODQiLCJpZCI6Mzc5NDY2LCJpYXQiOjE3Njg1MzcyODZ9.UiDxc-GY4VnAH9268odcZLMRI78MID94K9FlOYuD6iQ";

console.log("Cesium token:", Cesium.Ion.defaultAccessToken);
// Helper function to generate ground track
function generateGroundTrack(satrec, startTime, minutes, stepSeconds = 30) {
  const positions = [];

  for (let i = 0; i <= minutes * 60; i += stepSeconds) {
    const time = new Date(startTime.getTime() + i * 1000);

    const pv = satellite.propagate(satrec, time);
    if (!pv.position) continue;

    const gmst = satellite.gstime(time);
    const geo = satellite.eciToGeodetic(pv.position, gmst);

    positions.push(
      Cesium.Cartesian3.fromDegrees(
        satellite.degreesLong(geo.longitude),
        satellite.degreesLat(geo.latitude),
        0,
      ),
    );
  }

  return positions;
}

function App() {
  const [tle1, setTle1] = useState("");
  const [tle2, setTle2] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [satEntity, setSatEntity] = useState(null);
  const [pastTrackEntity, setPastTrackEntity] = useState(null);
  const [futureTrackEntity, setFutureTrackEntity] = useState(null);
  //Create Cesium Viewer once
  useEffect(() => {
    // const cesiumViewer = new Cesium.Viewer("cesiumContainer", {
    //   shouldAnimate: true,
    //   imageryProvider: false,
    //   //imageryProvider: Cesium.createWorldImagery(),
    //   // terrainProvider: Cesium.createWorldTerrain(),
    //   // baseLayerPicker: false,
    //   // animation: false,
    //   // timeline: false,
    // });
    const cesiumViewer = new Cesium.Viewer("cesiumContainer", {
      baseLayer: Cesium.ImageryLayer.fromProviderAsync(
        Cesium.createWorldImageryAsync({
          style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
        }),
      ),
      baseLayerPicker: false,
      timeline: false,
      animation: false,
      shouldAnimate: true,
    });

    setViewer(cesiumViewer);

    return () => {
      if (intervalId) clearInterval(intervalId);
      cesiumViewer.destroy();
    };
  }, []);
  // useEffect(() => {
  //   const viewer = new Cesium.Viewer("cesiumContainer", {
  //     baseLayer: Cesium.ImageryLayer.fromProviderAsync(
  //       Cesium.createWorldImagery(),
  //     ),
  //     baseLayerPicker: false,
  //     animation: false,
  //     timeline: false,
  //     shouldAnimate: true,
  //   });

  //   setViewer(viewer);

  //   return () => {
  //     if (intervalId) clearInterval(intervalId);
  //     cesiumViewer.destroy();
  //   };
  // }, []);
  const startTracking = () => {
    if (!viewer) {
      alert("Cesium Viewer not ready");
      return;
    }

    if (!tle1 || !tle2) {
      alert("Please enter both TLE lines");
      return;
    }

    // Cleanup previous run
    if (intervalId) clearInterval(intervalId);
    if (pastTrackEntity) viewer.entities.remove(pastTrackEntity);
    if (futureTrackEntity) viewer.entities.remove(futureTrackEntity);
    if (satEntity) viewer.entities.remove(satEntity);

    const satrec = satellite.twoline2satrec(tle1.trim(), tle2.trim());
    const now = new Date();

    // Generate tracks
    const pastTrack = generateGroundTrack(
      satrec,
      new Date(now.getTime() - 45 * 60 * 1000),
      45,
    );

    const futureTrack = generateGroundTrack(satrec, now, 45);

    const pastEntity = viewer.entities.add({
      polyline: {
        positions: pastTrack,
        width: 2,
        material: Cesium.Color.RED.withAlpha(0.7),
        clampToGround: true,
      },
    });

    const futureEntity = viewer.entities.add({
      polyline: {
        positions: futureTrack,
        width: 2,
        material: Cesium.Color.RED.withAlpha(0.7),
        clampToGround: true,
      },
    });

    setPastTrackEntity(pastEntity);
    setFutureTrackEntity(futureEntity);

    // Satellite icon
    const entity = viewer.entities.add({
      billboard: {
        image: "/satellites.png",
        scale: 0.6,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });

    setSatEntity(entity);
    viewer.trackedEntity = entity;

    // Live propagation
    const id = setInterval(() => {
      const time = new Date();
      const pv = satellite.propagate(satrec, time);
      if (!pv.position) return;

      const gmst = satellite.gstime(time);
      const geo = satellite.eciToGeodetic(pv.position, gmst);

      entity.position = Cesium.Cartesian3.fromDegrees(
        satellite.degreesLong(geo.longitude),
        satellite.degreesLat(geo.latitude),
        geo.height * 1000,
      );
    }, 1000);

    setIntervalId(id);
  };

  // const startTracking = () => {
  //   if (!viewer) {
  //     alert("Cesium Viewer not ready");
  //     return;
  //   }

  //   if (!tle1 || !tle2) {
  //     alert("Please enter both TLE lines");
  //     return;
  //   }

  //   const satrec = satellite.twoline2satrec(tle1, tle2);
  //   let entity = satEntity;
  //   const now = new Date();

  //   // Past and future tracks
  //   const pastTrack = generateGroundTrack(
  //     satrec,
  //     new Date(now.getTime() - 45 * 60 * 1000),
  //     45,
  //   );

  //   const futureTrack = generateGroundTrack(satrec, now, 45);
  //   viewer.entities.add({
  //     polyline: {
  //       positions: pastTrack,
  //       width: 2,
  //       material: new Cesium.ColorMaterialProperty(
  //         Cesium.Color.RED.withAlpha(0.7),
  //       ),
  //       clampToGround: true,
  //     },
  //   });

  //   // viewer.entities.add({
  //   //   polyline: {
  //   //     positions: futureTrack,
  //   //     width: 2,
  //   //     material: new Cesium.ColorMaterialProperty(
  //   //       Cesium.Color.RED.withAlpha(0.7),
  //   //     ),
  //   //     clampToGround: true,
  //   //   },
  //   // });
  //   const pastEntity = viewer.entities.add({
  //     polyline: {
  //       positions: pastTrack,
  //       width: 2,
  //       material: Cesium.Color.RED.withAlpha(0.7),
  //       clampToGround: true,
  //     },
  //   });

  //   const futureEntity = viewer.entities.add({
  //     polyline: {
  //       positions: futureTrack,
  //       width: 2,
  //       material: Cesium.Color.RED.withAlpha(0.7),
  //       clampToGround: true,
  //     },
  //   });

  //   setPastTrackEntity(pastEntity);
  //   setFutureTrackEntity(futureEntity);

  //   if (!entity) {
  //     entity = viewer.entities.add({
  //       billboard: {
  //         image: "/satellites.png", // put satellite.png in public/
  //         scale: 0.6,
  //         verticalOrigin: Cesium.VerticalOrigin.CENTER,
  //       },
  //     });

  //     setSatEntity(entity);
  //     viewer.trackedEntity = entity;
  //   }
  //   // Remove previous tracks
  //   if (pastTrackEntity) viewer.entities.remove(pastTrackEntity);
  //   if (futureTrackEntity) viewer.entities.remove(futureTrackEntity);
  //   if (intervalId) clearInterval(intervalId);

  //   const id = setInterval(() => {
  //     const now = new Date();
  //     const pv = satellite.propagate(satrec, now);
  //     if (!pv.position) return;

  //     const gmst = satellite.gstime(now);
  //     const geo = satellite.eciToGeodetic(pv.position, gmst);

  //     entity.position = Cesium.Cartesian3.fromDegrees(
  //       satellite.degreesLong(geo.longitude),
  //       satellite.degreesLat(geo.latitude),
  //       geo.height * 1000,
  //     );

  //     entity.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
  //   }, 1000);

  //   setIntervalId(id);
  // };

  return (
    <>
      {/* INPUT PANEL */}
      <div className="container">
        <label htmlFor="tle1">Enter TLE Line 1:</label>
        <br />
        <textarea
          value={tle1}
          onChange={(e) => setTle1(e.target.value)}
          rows={2}
          cols={70}
          id="tle1"
        />
        <br />
        <br />
        <label htmlFor="tle2">Enter TLE Line 2:</label>
        <br />
        <textarea
          value={tle2}
          onChange={(e) => setTle2(e.target.value)}
          rows={2}
          id="tle2"
          cols={70}
        />
        <br />
        <br />
        <button onClick={startTracking}>Track Satellite</button>
      </div>
      {/* CESIUM MAP */}
      <div
        id="cesiumContainer"
        style={{ width: "100%", height: "80vh", margin: "120px" }}
      />
    </>
  );
}

export default App;
// import { useEffect, useRef, useState } from "react";
// import * as Cesium from "cesium";
// import * as satellite from "satellite.js";
// // import "cesium/Build/Cesium/Widgets/widgets.css";

// Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || "";

// export default function App() {
//   const cesiumRef = useRef(null);
//   const viewerRef = useRef(null);
//   const satEntityRef = useRef(null);
//   const intervalRef = useRef(null);

//   // 🔹 USER-ENTERED TLE
//   const [tle1, setTle1] = useState("");
//   const [tle2, setTle2] = useState("");

//   // 🔹 INIT CESIUM (OFFLINE)
//   useEffect(() => {
//     if (viewerRef.current) return;

//     const viewer = new Cesium.Viewer(cesiumRef.current, {
//       imageryProvider: new Cesium.SingleTileImageryProvider({
//         url: "/earth.jpg",
//       }),
//       baseLayerPicker: false,
//       geocoder: false,
//       timeline: false,
//       animation: false,
//       homeButton: false,
//       fullscreenButton: false,
//       sceneModePicker: false,
//     });

//     viewer.scene.globe.enableLighting = true;
//     viewerRef.current = viewer;

//     return () => viewer.destroy();
//   }, []);

//   // 🔹 SATELLITE POSITION CALCULATION
//   function getPosition(satrec, time) {
//     const pv = satellite.propagate(satrec, time);
//     if (!pv.position) return null;

//     const gmst = satellite.gstime(time);
//     const geo = satellite.eciToGeodetic(pv.position, gmst);

//     return {
//       lat: satellite.degreesLat(geo.latitude),
//       lon: satellite.degreesLong(geo.longitude),
//       alt: geo.height * 1000, // meters
//     };
//   }

//   // 🔹 TRACK SATELLITE (USER TLE)
//   function trackSatellite() {
//     const viewer = viewerRef.current;

//     if (!viewer) return;

//     // 🛑 VALIDATION
//     if (!tle1.trim() || !tle2.trim()) {
//       alert("Please enter both TLE lines");
//       return;
//     }

//     if (!tle1.startsWith("1 ") || !tle2.startsWith("2 ")) {
//       alert("Invalid TLE format");
//       return;
//     }

//     // 🧹 CLEAN PREVIOUS TRACK
//     if (satEntityRef.current) {
//       viewer.entities.remove(satEntityRef.current);
//     }

//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     viewer.entities.removeAll();

//     const satrec = satellite.twoline2satrec(tle1, tle2);

//     // 🛰️ SATELLITE ICON
//     const entity = viewer.entities.add({
//       position: Cesium.Cartesian3.fromDegrees(0, 0, 400000),
//       billboard: {
//         image: "/satellite.png",
//         scale: 0.6,
//         verticalOrigin: Cesium.VerticalOrigin.CENTER,
//       },
//     });

//     satEntityRef.current = entity;
//     viewer.trackedEntity = entity;

//     // ⏱️ REAL-TIME UPDATE (1s)
//     intervalRef.current = setInterval(() => {
//       const pos = getPosition(satrec, new Date());
//       if (!pos) return;

//       entity.position = Cesium.Cartesian3.fromDegrees(
//         pos.lon,
//         pos.lat,
//         pos.alt,
//       );
//     }, 1000);

//     // 🧭 GROUND TRACK (NEXT 90 MIN)
//     const groundTrack = [];
//     for (let i = 0; i <= 90 * 60; i += 30) {
//       const time = new Date(Date.now() + i * 1000);
//       const pos = getPosition(satrec, time);
//       if (!pos) continue;

//       groundTrack.push(Cesium.Cartesian3.fromDegrees(pos.lon, pos.lat));
//     }

//     viewer.entities.add({
//       polyline: {
//         positions: groundTrack,
//         width: 2,
//       },
//     });
//   }

//   return (
//     <>
//       {/* UI PANEL */}
//       <div style={uiStyle}>
//         <h3>Satellite Tracker (Offline)</h3>

//         <textarea
//           value={tle1}
//           onChange={(e) => setTle1(e.target.value)}
//           placeholder="TLE Line 1"
//         />

//         <textarea
//           value={tle2}
//           onChange={(e) => setTle2(e.target.value)}
//           placeholder="TLE Line 2"
//         />

//         <button onClick={trackSatellite}>Track Satellite</button>
//       </div>

//       {/* CESIUM CONTAINER */}
//       <div id="cesiumContainer" ref={cesiumRef}></div>
//     </>
//   );
// }

// // 🔹 UI STYLES
// const uiStyle = {
//   position: "absolute",
//   top: "10px",
//   left: "10px",
//   zIndex: 10,
//   background: "rgba(0,0,0,0.75)",
//   padding: "12px",
//   color: "white",
//   width: "320px",
//   borderRadius: "6px",
// };
