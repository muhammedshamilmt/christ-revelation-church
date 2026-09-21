import Image from "next/image";

export default function AboutGallerySection() {
  const images = Array(8).fill("/images/hero-bg.png");

  return (
    <section className="w-full bg-white text-[#0c0c0c] py-16 sm:py-24 px-4 sm:px-8 lg:px-12">
      <div className="w-full mx-auto flex flex-col">

        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b border-[#0c0c0c]/10 pb-6">
          <h2 className="font-open-sauce text-2xl sm:text-3xl lg:text-6xl font-medium tracking-tight flex items-start">
            Our Gallery <sup className="text-sm ml-1 mt-2 text-[#0c0c0c]/60 font-normal">(24)</sup>
          </h2>

          <div className="flex gap-6 sm:gap-10 font-open-sauce text-lg sm:text-xl font-medium">
            <button className="text-[#0c0c0c] transition-colors">Grid</button>
            <button className="text-[#0c0c0c]/30 hover:text-[#0c0c0c] transition-colors">List</button>
            <button className="text-[#0c0c0c]/30 hover:text-[#0c0c0c] transition-colors">Feed</button>
            <button className="text-[#0c0c0c]/30 hover:text-[#0c0c0c] transition-colors">Full</button>
          </div>
        </div>

        {/* Seamless Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
          {images.map((src, index) => (
            <div key={index} className="relative w-full aspect-square border-[1px] border-white group overflow-hidden bg-gray-100">
              <Image
                src={src}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
