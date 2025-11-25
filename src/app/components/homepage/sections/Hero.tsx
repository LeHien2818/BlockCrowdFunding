import React from "react";
import { useRouter } from "next/navigation";

const Hero: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative w-full bg-black overflow-hidden bg-cover bg-center border-b border-gray-800">
      <div className="relative flex flex-col items-center justify-center min-h-[500px] mt-20 text-center px-4">
        <h1 className="lg:text-8xl md:text-7xl text-6xl font-bold text-white tracking-tighter">
          Decentralized
        </h1>
        <h1 className="lg:text-8xl md:text-7xl text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mt-2 tracking-tighter">
          Funding Platform
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl">
          Empower your innovative blockchain ideas. Get funded by a global community, or become an investor in the next big thing.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => router.push("/create-project")} 
            className="text-lg font-semibold px-8 py-4 rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Create a campaign
          </button>
          <button 
            onClick={() => router.push('/projects')} 
            className="text-lg font-semibold px-8 py-4 rounded-full text-white border-2 border-gray-600 hover:bg-gray-800 hover:border-gray-700 transition-all duration-300"
          >
            Explore Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
