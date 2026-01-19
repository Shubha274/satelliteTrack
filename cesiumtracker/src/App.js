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

  // return (
  //   <>
  //     {/* INPUT PANEL */}
  //     <div className="container">
  //       <h1 className="title">Satellite Tracker</h1>
  //       <label htmlFor="tle1">Enter TLE Line 1:</label>
  //       <br />
  //       <textarea
  //         value={tle1}
  //         onChange={(e) => setTle1(e.target.value)}
  //         rows={2}
  //         cols={70}
  //         id="tle1"
  //       />
  //       <br />
  //       <br />
  //       <label htmlFor="tle2">Enter TLE Line 2:</label>
  //       <br />
  //       <textarea
  //         value={tle2}
  //         onChange={(e) => setTle2(e.target.value)}
  //         rows={2}
  //         id="tle2"
  //         cols={70}
  //       />
  //       <br />
  //       <br />
  //       <button onClick={startTracking}>Track Satellite</button>
  //     </div>
  //     {/* CESIUM MAP */}
  //     <div
  //       id="cesiumContainer"
  //       style={{ width: "100%", height: "80vh", margin: "120px" }}
  //     />
  //   </>
  // );
  return (
    <>
      <div className="layout">
        {/* INPUT PANEL */}
        <div className="container">
          <h1 className="title">Satellite Tracker</h1>

          {/* <label htmlFor="tle1" className="labels">
            Enter TLE Line 1:
          </label>
          <textarea
            className="textbox"
            value={tle1}
            onChange={(e) => setTle1(e.target.value)}
            rows={2}
            cols={20}
            id="tle1"
          />
          <br />
          <label htmlFor="tle2" className="labels">
            Enter TLE Line 2:
          </label>
          <textarea
            className="textbox"
            value={tle2}
            onChange={(e) => setTle2(e.target.value)}
            rows={2}
            cols={20}
            id="tle2"
          />
          <br />

          <button className="buttons" onClick={startTracking}>
            Track Satellite
          </button> */}
          <form
            className="tle-form"
            onSubmit={(e) => {
              e.preventDefault();
              startTracking();
            }}
          >
            <label htmlFor="tle1" className="labels">
              Enter TLE Line 1:
            </label>
            <textarea
              className="textbox"
              value={tle1}
              onChange={(e) => setTle1(e.target.value)}
              rows={3}
              cols={30}
              id="tle1"
            />

            <label htmlFor="tle2" className="labels">
              Enter TLE Line 2:
            </label>
            <textarea
              className="textbox"
              value={tle2}
              onChange={(e) => setTle2(e.target.value)}
              rows={3}
              cols={30}
              id="tle2"
            />

            <div></div>
            <button className="buttons" type="submit">
              Track Satellite
            </button>
          </form>
        </div>

        {/* CESIUM MAP */}
        <div id="cesiumContainer" className="map" />
      </div>
    </>
  );
}

export default App;
