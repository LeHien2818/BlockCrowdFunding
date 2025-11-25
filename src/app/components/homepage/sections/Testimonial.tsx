import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Jake Smith",
    role: "Blockchain Developer",
    avatar: "https://source.boringavatars.com/beam/120/Jake%20Smith",
    content:
      "As a developer in the Web3 space, this platform was exactly what I needed. The transparent process and smart contract integration make everything trustworthy and efficient.",
  },
  {
    name: "Amanda Rodriguez",
    role: "Angel Investor",
    avatar: "https://source.boringavatars.com/beam/120/Amanda%20Rodriguez",
    content:
      "The dashboard analytics are a game-changer for tracking my investments. The detailed progress reports and transparent funding metrics provide me with complete confidence.",
  },
  {
    name: "Tyler Nguyen",
    role: "Startup Founder",
    avatar: "https://source.boringavatars.com/beam/120/Tyler%20Nguyen",
    content:
      "Finding investors for my project was a challenge until I found this platform. The interface is intuitive, and connecting with potential backers has never been easier.",
  },
];

export function HpTestimonials() {
  return (
    <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-purple-400">Testimonials</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Loved by Innovators and Investors
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-400">
                    Hear from our community about how they're using our platform to build the future.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 sm:mt-20 lg:mt-24">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
                >
                    <div className="flex-grow">
                        <Quote className="h-8 w-8 text-purple-400/50 mb-4" />
                        <p className="text-gray-300 text-lg italic">"{testimonial.content}"</p>
                    </div>

                    <div className="flex items-center mt-6 pt-6 border-t border-white/10">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full border-2 border-white/20"
                        />
                        <div className="ml-4 text-left">
                            <p className="font-bold text-white">{testimonial.name}</p>
                            <p className="text-sm text-gray-400">{testimonial.role}</p>
                        </div>
                    </div>
                </div>
              ))}
            </div>
        </div>
    </section>
  );
}

export default HpTestimonials;
