import { useRouter } from "next/navigation";
import { Briefcase, Wallet, Handshake, BarChart } from 'lucide-react';

export function HpHowItWorks() {
    const router = useRouter();

    const steps = [
      {
        icon: <Briefcase className="w-8 h-8 text-purple-400" />,
        title: "1. Create a Project",
        description:
          "Launch your vision on our platform. Detail your project, set your funding goals, and tell your story with rich media.",
      },
      {
        icon: <Wallet className="w-8 h-8 text-purple-400" />,
        title: "2. Connect Wallet",
        description:
          "Link your digital wallet in seconds. We support a variety of wallets for seamless and secure transactions.",
      },
      {
        icon: <Handshake className="w-8 h-8 text-purple-400" />,
        title: "3. Give & Get Funds",
        description:
          "Explore a universe of innovative projects to back, or attract investors to bring your own ideas to life.",
      },
      {
        icon: <BarChart className="w-8 h-8 text-purple-400" />,
        title: "4. Track & Grow",
        description:
          "Stay updated with real-time analytics. Monitor your investments or track your campaign's funding progress from your dashboard.",
      },
    ];
  
    return (
      <section id="how-it-works" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-purple-400">How It Works</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    A Simple Path to Funding and Investment
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-400">
                    Follow these four simple steps to get started on our decentralized crowdfunding platform.
                </p>
            </div>

            <div className="relative mt-16 sm:mt-20 lg:mt-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step) => (
                        <div key={step.title} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
                            <div className="flex justify-center mb-6">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 border-2 border-purple-500/20">
                                    {step.icon}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-20 text-center">
              <button 
                onClick={() => router.push("/create-project")} 
                className="text-lg font-semibold px-8 py-4 rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start a Campaign
              </button>
            </div>
        </div>
      </section>
    );
  }
  
export default HpHowItWorks;