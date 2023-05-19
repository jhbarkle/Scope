import { SimpleAlbumObject } from "../../../models/Album";
import { SimpleArtistObject } from "../../../models/Artist";
import { SimpleTrackObject } from "../../../models/Track";
import styles from "./Category.module.scss";

interface CategoryProps {
  title: string;
  description: string;
  spotifyItems:
    | SimpleAlbumObject[]
    | SimpleArtistObject[]
    | SimpleTrackObject[];
}

const Category: React.FC<CategoryProps> = ({
  title,
  description,
  spotifyItems,
}) => {
  return (
    <section id={styles.category_container}>
      <h2 className={styles.remove_spacing}>{title}</h2>
      <p className={styles.remove_spacing}>{description}</p>
      <section id={styles.item_section_container}>
        {spotifyItems.map((item) => {
          return (
            <div id={styles.item_container} key={item.id}>
              <img id={styles.item_image} src={item.image} alt="" />
              <p className={styles.remove_spacing}>{item.name}</p>
            </div>
          );
        })}
      </section>
    </section>
  );
};

export default Category;
