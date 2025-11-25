import React from "react";
import {
  Lock,
  FileText,
  Wallet,
  PieChart,
  Shield,
  History,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div
      className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 overflow-hidden transition-all duration-300 group hover:border-purple-400/50 hover:-translate-y-1"
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="bg-purple-500/10 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-5 border border-purple-500/20 group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
};

const Feature = () => {
  const features = [
    {
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      title: "Secure Transactions",
      description:
        "All transactions are secured by blockchain technology ensuring transparency and immutability.",
    },
    {
      icon: <FileText className="w-6 h-6 text-purple-400" />,
      title: "Project Showcase",
      description:
        "Create detailed project profiles with rich media content to attract potential investors.",
    },
    {
      icon: <Wallet className="w-6 h-6 text-purple-400" />,
      title: "Wallet Integration",
      description:
        "Connect your cryptocurrency wallet seamlessly to invest in projects directly.",
    },
    {
      icon: <PieChart className="w-6 h-6 text-purple-400" />,
      title: "Investment Analytics",
      description:
        "Track your investments with detailed analytics and performance metrics.",
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      title: "Smart Contracts",
      description:
        "Automated funding processes with smart contracts for transparent fund distribution.",
    },
    {
      icon: <History className="w-6 h-6 text-purple-400" />,
      title: "Transaction History",
      description:
        "Complete history of all transactions with filtering and export capabilities.",
    },
  ];

  return (
    <div className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-purple-400">Our Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to fund and get funded
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Our platform provides a comprehensive suite of tools for both creators and investors, built on the security and transparency of the blockchain.
            </p>
        </div>
        <div className="mt-16 max-w-2xl mx-auto sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feature;
