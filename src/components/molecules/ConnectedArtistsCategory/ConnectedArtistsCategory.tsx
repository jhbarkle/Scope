import { useEffect, useState, useRef } from "react";
import { ConnectedArtistObject } from "../../../models/Artist";
import styles from "./ConnectedArtistsCategory.module.scss";

interface ConnectedArtistsCategoryProps {
  title: string;
  description: string;
  spotifyItems: ConnectedArtistObject[];
}

interface PlayState {
  isPlaying: boolean;
  url: string;
  audio?: HTMLAudioElement;
}

const ConnectedArtistsCategory: React.FC<ConnectedArtistsCategoryProps> = ({
  title,
  description,
  spotifyItems,
}) => {
  return (
    <section id={styles.category_container}>
      <h2 className={styles.remove_spacing}>{title}</h2>
      <p className={styles.remove_spacing}>{description}</p>
      <section id={styles.item_section_container}>
        {spotifyItems.map((item, index) => {
          return (
            <div id={styles.item_container} key={item.id + index}>
              <img id={styles.item_image} src={item.image} alt="" />
              <p className={styles.remove_spacing}>{item.trackName}</p>
              <ul>
                {item.artists.map((artist) => {
                  return <li>{artist.name}</li>;
                })}
              </ul>
            </div>
          );
        })}
      </section>
    </section>
  );
};

export default ConnectedArtistsCategory;
