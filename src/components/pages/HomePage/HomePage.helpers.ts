import { UserProfile } from "../../../models/UserProfile";

export const initialUserProfile: UserProfile = {
  display_name: "",
  email: "",
  followers: 0,
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
