'use client'

import { useCrowdfunding } from "@/app/hooks/useCrowdfunding"
import { useEffect, useState } from "react"
import CardProject from "@/app/components/projects/CardProject"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const FeaturedProjects = () => {
  const { campaigns, isLoadingCampaigns } = useCrowdfunding()
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      // Sắp xếp theo số tiền huy động được
      const sorted = [...campaigns].sort((a, b) => 
        Number(b.amountCollected) - Number(a.amountCollected)
      )
      setFeaturedProjects(sorted.slice(0, 3))
    }
  }, [campaigns])

  if (isLoadingCampaigns) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Top Campaigns</h2>
          <Link 
            href="/projects"
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="bg-gray-800/50 rounded-2xl p-6 space-y-4 border border-transparent animate-pulse"
            >
              <div className="h-48 bg-gray-700/60 rounded-lg" />
              <div className="space-y-3">
                <div className="h-5 bg-gray-700/60 rounded w-3/4" />
                <div className="h-4 bg-gray-700/60 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Top Campaigns</h2>
        <Link 
          href="/projects"
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProjects.map((project) => (
          <CardProject
            key={project.id}
            id={project.id.toString()}
            owner={project.owner}
            title={project.title}
            description={project.description}
            target={project.target.toString()}
            deadline={project.deadline}
            amountCollected={project.amountCollected.toString()}
            image={project.image}
            handleClick={() => router.push(`/projects/${project.id}`)}
          />
        ))}
      </div>
    </div>
  )
}

export default FeaturedProjects