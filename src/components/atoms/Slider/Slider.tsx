import styles from "./Slider.module.scss";

interface SliderProps {
  sliderTitle: string;
  sliderValue: number;
  setSlider: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  sliderTitle,
  setSlider,
  sliderValue,
}) => {
  return (
    <div className={styles.slidecontainer}>
      <div id={styles.slider_title_container}>
        <h4>{sliderTitle}</h4>
        <p>{sliderValue}</p>
      </div>
      <input
        onChange={(e) => setSlider(e.target.valueAsNumber)}
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        className={styles.slider}
        id="myRange"
      />
    </div>
  );
};

export default Slider;
