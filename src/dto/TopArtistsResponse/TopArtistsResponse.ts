import { Artist } from "../Shared/Shared";

export interface TopArtistsResponse {
  href: string;
  next: string;
  total: number;
  items: Artist[];
}
