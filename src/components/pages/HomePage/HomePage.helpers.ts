import { UserProfile } from "../../../models/UserProfile";

export const initialUserProfile: UserProfile = {
  displayName: "Anon",
  email: "",
  followers: 0,
  href: "",
  spotifyProfileUrl: "",
  id: "",
  profileImage: "",
  uri: "",
  topTracks: {
    shortTerm: [],
    mediumTerm: [],
    longTerm: [],
  },
  topArtists: {
    shortTerm: [],
    mediumTerm: [],
    longTerm: [],
  },
  followedArtists: [],
};
