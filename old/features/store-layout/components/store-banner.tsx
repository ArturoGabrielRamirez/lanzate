import Image from "next/image"

const StoreBanner = () => {
    return (
        <div className="relative h-40 w-full brightness-50 hover:brightness-100 transition-all duration-300 group overflow-hidden mask-t-from-50%">
            <Image
                src="/public-store/banner.jpg"
                alt="Banner"
                fill
                objectFit="cover"
                className="group-hover:scale-105 transition-all duration-300"
            />
        </div>
    )
}
export default StoreBanner