import { useState } from "react";
import styles from "./CreationStation.module.scss";
import Slider from "../../atoms/Slider/Slider";

const CreationStation: React.FC = () => {
  const [playlistCountSliderValue, setPlaylistCountSliderValue] = useState(0);
  const [songLengthSliderValue, setSongLengthSliderValue] = useState(0);
  const [energySliderValue, setEnergySliderValue] = useState(0);
  const [popularitySliderValue, setPopularitySliderValue] = useState(0);
  const [tempoSliderValue, setTempoSliderValue] = useState(0);
  return (
    <div id={styles.creation_station_container}>
      <h1>Creation Station</h1>

      {/* Artists Selections */}
      <h3>Artists</h3>
      <div id={styles.artists_selections_container}>
        <img src="/icons/no-selection.png" alt="" />
        <img src="/icons/no-selection.png" alt="" />
        <img src="/icons/no-selection.png" alt="" />
        <img src="/icons/no-selection.png" alt="" />
        <img src="/icons/no-selection.png" alt="" />
      </div>

      {/* Tracks Selections */}
      <h3>Tracks</h3>
      <div id={styles.artists_selections_container}>
        <img src="/icons/no-selection.png" alt="" />
        <img src="/icons/no-selection.png" alt="" />
        <img src="/icons/no-selection.png" alt="" />
        <img src="/icons/no-selection.png" alt="" />
        <img src="/icons/no-selection.png" alt="" />
      </div>

      <h3>Genres</h3>
      <div className={styles.genres_container}></div>

      {/* Metric Selections */}
      <Slider
        sliderTitle="Target Playlist Track Count"
        sliderValue={playlistCountSliderValue}
        setSlider={setPlaylistCountSliderValue}
      />

      <Slider
        sliderTitle="Target Song Length"
        sliderValue={songLengthSliderValue}
        setSlider={setSongLengthSliderValue}
      />

      <Slider
        sliderTitle="Song Energy"
        sliderValue={energySliderValue}
        setSlider={setEnergySliderValue}
      />

      <Slider
        sliderTitle="Song Popularity"
        sliderValue={popularitySliderValue}
        setSlider={setPopularitySliderValue}
      />
      <Slider
        sliderTitle="Tempo (BPM)"
        sliderValue={tempoSliderValue}
        setSlider={setTempoSliderValue}
      />
    </div>
  );
};

export default CreationStation;
