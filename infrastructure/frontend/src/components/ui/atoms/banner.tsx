"use client";

type BannerProps = {
  title: string;
};

export function Banner({ title }: BannerProps) {
  return (
    <div className="relative h-36 w-full overflow-hidden">
      <img
        src="/assets/images/home-banner.jpg"
        alt="Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-end justify-start">
        <div className="container mx-auto px-4 pb-2">
          <h1 className="text-4xl font-bold text-white container">{title}</h1>
        </div>
      </div>
    </div>
  );
}
