import { Star } from 'lucide-react';

export function SocialAvatars({ tip }: { tip: string }) {
  return (
    <div className="mx-auto mt-8 flex w-fit flex-col items-center gap-2 sm:flex-row">
      <div className="flex flex-col items-center gap-1 md:items-start">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className="size-4 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        <p className="text-muted-foreground text-left text-sm font-normal">
          {tip}
        </p>
      </div>
    </div>
  );
}
