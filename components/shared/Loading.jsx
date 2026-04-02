import Image from "next/image"

const Loading = () => {
    return (
        <div className="h-screen w-screen flex justify-center items-center bg-background/50 backdrop-blur-sm fixed inset-0 z-[9999]">
            <div className="relative flex items-center justify-center">
                <Image 
                    src="/images/loading.svg" 
                    height={100} 
                    width={100} 
                    alt="Loading..." 
                    className="animate-spin-slow"
                    priority
                />
            </div>
        </div>
    )
}

export default Loading;