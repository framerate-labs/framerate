import type { Review } from '@/types/ratings';

import { useEffect, useRef, useState } from 'react';

import { ArrowUp } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

import PosterGrid from '@/components/poster-grid';
import Tooltip from '@/components/tooltip';
import { TooltipProvider } from '@/components/ui/tooltip-ui';
import LibraryFilters from '@/features/library/components/library-filters';
import { scrollToTop } from '@/lib/scroll';
import { Route } from '@/routes/library';

export default function LibraryGrid({
  fetchedReviews,
}: {
  fetchedReviews: Review<'movie' | 'tv'>[];
}) {
  const [reviews, setReviews] = useState<Review<'movie' | 'tv'>[]>([]);
  const [isArrowVisible, setIsArrowVisible] = useState(false);

  const scrollToTopBtn = useRef<HTMLButtonElement>(null);

  const { filter } = Route.useSearch();

  useHotkeys('t', () => {
    scrollToTopBtn.current?.click();
  });

  useEffect(() => {
    const toggleVisibility = () => {
      setIsArrowVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  useEffect(() => {
    if (fetchedReviews.length > 0) {
      fetchedReviews.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    }

    if (filter === 'film') {
      if (fetchedReviews.length > 0) {
        const filtered = fetchedReviews.filter(
          (review) => review.mediaType === 'movie',
        );

        return setReviews(filtered);
      }
    } else if (filter === 'series') {
      if (fetchedReviews.length > 0) {
        const filtered = fetchedReviews.filter(
          (review) => review.mediaType === 'tv',
        );

        return setReviews(filtered);
      }
    } else {
      setReviews(fetchedReviews);
    }
  }, [fetchedReviews, filter]);

  return (
    <>
      <div>
        <LibraryFilters />
      </div>

      <section className="animate-fade-in-fast mt-4 pb-20">
        {reviews.length === 0 ? (
          <div className="mx-auto mt-32 text-center">
            <p className="text-lg font-medium">
              Log your first review to start building your personal library!
            </p>
          </div>
        ) : (
          <div className="bg-background-dark min-h-screen w-full rounded-md p-4 md:px-7 md:py-8">
            <PosterGrid
              media={reviews}
              classes="grid-cols-4 gap-1.5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-3.5"
            />
          </div>
        )}

        <TooltipProvider>
          <Tooltip side="top" sideOffset={12} content="Scroll to top" key1="T">
            <button
              ref={scrollToTopBtn}
              onClick={scrollToTop}
              className={`${isArrowVisible ? 'animate-fade-in' : ''} fixed right-4 bottom-4 rounded-full p-2 shadow-lg transition-colors duration-200 outline-none hover:bg-white/5 ${
                isArrowVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-label="Scroll to top"
            >
              <ArrowUp strokeWidth={1.5} />
            </button>
          </Tooltip>
        </TooltipProvider>
      </section>
    </>
  );
}
