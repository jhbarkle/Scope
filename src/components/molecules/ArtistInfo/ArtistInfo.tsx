import styles from "./ArtistInfo.module.scss";

interface ArtistInfoProps {
  artistName: string;
  image: string;
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ artistName, image }) => {
  return (
    <div className={styles.artist_info_container}>
      <img src={image} alt="Artist" />
      <h2>{artistName}</h2>
    </div>
  );
};

export default ArtistInfo;
