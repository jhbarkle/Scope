import { useState } from "react";
import { SimpleAlbumObject } from "../../../models/Album";
import { SimpleArtistObject } from "../../../models/Artist";
import { SimpleTrackObject } from "../../../models/Track";
import styles from "./FilterableCategory.module.scss";
import { UserProfile } from "../../../models/UserProfile";

interface FilterableCategoryProps {
  title: string;
  description: string;
  filterableCategoryItems: {
    shortTerm: SimpleTrackObject[] | SimpleArtistObject[];
    mediumTerm: SimpleTrackObject[] | SimpleArtistObject[];
    longTerm: SimpleTrackObject[] | SimpleArtistObject[];
  };
}

type FilterableCategoryState = "Last 4 Weeks" | "Last 6 Months" | "All Time";

const FilterableCategory: React.FC<FilterableCategoryProps> = ({
  title,
  description,
  filterableCategoryItems,
}) => {
  const [filter, setFilter] = useState<FilterableCategoryState>("Last 4 Weeks");

  const getSpotifyItems = (): SimpleTrackObject[] | SimpleArtistObject[] => {
    switch (filter) {
      case "Last 4 Weeks":
        return filterableCategoryItems.shortTerm;
      case "Last 6 Months":
        return filterableCategoryItems.mediumTerm;
      case "All Time":
        return filterableCategoryItems.longTerm;
      default:
        return filterableCategoryItems.shortTerm;
    }
  };

  const filterItems = (filter: FilterableCategoryState) => {
    switch (filter) {
      case "Last 4 Weeks":
        setFilter("Last 4 Weeks");
        break;
      case "Last 6 Months":
        setFilter("Last 6 Months");
        break;
      case "All Time":
        setFilter("All Time");
        break;
      default:
        setFilter("Last 4 Weeks");
    }
  };

  const getActiveButton = (state: FilterableCategoryState) => {
    if (state === filter) {
      return styles.active_button;
    } else {
      return styles.inactive_button;
    }
  };

  return (
    <section id={styles.category_container}>
      <h2 className={styles.remove_spacing}>{title}</h2>
      <p className={styles.remove_spacing}>{description}</p>
      <div id={styles.filter_buttons_contianer}>
        <button
          id={styles.default_button_styles}
          className={getActiveButton("Last 4 Weeks")}
          onClick={() => filterItems("Last 4 Weeks")}
        >
          Last 4 Weeks
        </button>
        <button
          id={styles.default_button_styles}
          className={getActiveButton("Last 6 Months")}
          onClick={() => filterItems("Last 6 Months")}
        >
          Last 6 Months
        </button>
        <button
          id={styles.default_button_styles}
          className={getActiveButton("All Time")}
          onClick={() => filterItems("All Time")}
        >
          All Time
        </button>
      </div>
      <section id={styles.item_section_container}>
        {getSpotifyItems().map((item) => {
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

export default FilterableCategory;
