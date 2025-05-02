import type { MediaDetails } from "@web/types/details";

import { Link } from "@tanstack/react-router";

import { Route as filmRoute } from "@web/routes/films/$id.$title";
import { Route as seriesRoute } from "@web/routes/series/$id.$title";
import { getSimpleTitle } from "@web/utils/strings";

import { SearchDialogClose } from "./SearchDialog";

export default function SearchResult({ media }: { media: MediaDetails }) {
  const simpleTitle = media.title ? getSimpleTitle(media.title) : "";
  const mediaType = media.mediaType === "movie" ? "film" : "series";

  const route =
    mediaType === "film" ? filmRoute.fullPath : seriesRoute.fullPath;

  const poster = (
    <img
      src={`https://image.tmdb.org/t/p/w92${media.posterPath}`}
      alt={`A promotional poster from ${media.title}`}
      width={92}
      height={138}
      className="h-12 w-8 rounded"
    />
  );

  return (
    media.title &&
    media.releaseDate && (
      <div className="animate-fade-in hover:bg-background mt-0 flex items-center justify-start rounded-md md:py-2">
        <SearchDialogClose asChild>
          <Link
            to={route}
            params={{ id: media.id.toString(), title: simpleTitle }}
            preload={false}
            className="flex w-full cursor-default items-center outline-none"
          >
            <div className="pointer-events-none mr-1.5 flex md:px-2">
              {media.posterPath ? poster : ""}
            </div>
            <div className="flex flex-col items-baseline text-left">
              <p className="text-[15px] font-medium">
                {media.title} ({media.releaseDate.slice(0, 4)})
              </p>
              <p className="text-gray text-xs font-semibold tracking-wide text-nowrap md:text-sm md:font-medium">
                {media.mediaType === "movie" ? media.director : media.creator}
              </p>
            </div>

            {/* Badge */}
            <div className="mr-0.5 flex grow justify-end md:mr-4">
              <div className="bg-background rounded ring-2 ring-white/5">
                <p className="inline-block w-[61.33px] rounded bg-gradient-to-b from-neutral-100 via-neutral-100/80 to-neutral-100/30 bg-clip-text px-2 py-1 text-center text-sm text-transparent">
                  {media.mediaType === "movie" ? "Film" : "Series"}
                </p>
              </div>
            </div>
          </Link>
        </SearchDialogClose>
      </div>
    )
  );
}
