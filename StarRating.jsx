import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, numReviews, size = 'sm', interactive = false, onRate }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizes[size]} ${
              star <= Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-stone-200 fill-stone-200'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
      {numReviews !== undefined && (
        <span className="text-xs text-stone-500 ml-1">({numReviews})</span>
      )}
    </div>
  );
}
