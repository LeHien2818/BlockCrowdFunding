'use client'

import { useRouter } from 'next/navigation'
import { useCrowdfunding } from '@/app/hooks/useCrowdfunding'
import CardProject from '@/app/components/projects/CardProject'
import { Plus, Search, LayoutGrid, List, Zap } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { daysLeft } from '../utils'

const MotionButton = motion(motion.button)

export default function ProjectsPage() {
  const router = useRouter()
  const { campaigns, isLoadingCampaigns, address } = useCrowdfunding()
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns;

    if (activeTab === 'active') {
      filtered = campaigns.filter(c => daysLeft(c.deadline) > 0)
    } else if (activeTab === 'my-projects') {
      filtered = campaigns.filter(c => c.owner === address)
    } else if (activeTab === 'finished') {
      filtered = campaigns.filter(c => daysLeft(c.deadline) <= 0)
    }

    if (searchQuery) {
        return filtered.filter(campaign =>
            campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    return filtered;
  }, [campaigns, searchQuery, activeTab, address])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  if (!mounted) {
    // Avoid hydration mismatch
    return <div className="h-screen bg-gray-900" />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <AnimatePresence>
        <motion.div 
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
          {/* Header */}
          <div className="text-center pt-16 pb-12">
            <motion.h1 
                className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
              Explore Projects
            </motion.h1>
            <motion.p 
                className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
              Discover, back, and bring innovative ideas to life through the power of decentralized crowdfunding.
            </motion.p>
          </div>

          {/* Controls */}
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative w-full md:max-w-xs">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
            
            <MotionButton
              onClick={() => router.push('/create-project')}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(192, 132, 252, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </MotionButton>
          </motion.div>
          
          {/* Tabs */}
          <motion.div 
            className="flex justify-center items-center mb-10 border-b border-gray-700/50"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[
              {id: 'active', label: 'Active'},
              {id: 'my-projects', label: 'My Projects'},
              {id: 'finished', label: 'Finished'}
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:text-white">
                {tab.label}
                {activeTab === tab.id && <motion.div className="absolute bottom-0 left-2 right-2 h-0.5 bg-purple-500" layoutId="tab-underline" />}
              </button>
            ))}
          </motion.div>


          {/* Grid */}
          {isLoadingCampaigns ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
              <p className="mt-4 text-lg text-gray-400">Loading Projects...</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-400">No projects found for this category.</p>
            </div>
          ) : (
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
              {filteredCampaigns.map((project) => (
                <CardProject
                  key={project.id}
                  id={project.id}
                  owner={project.owner}
                  title={project.title}
                  description={project.description}
                  target={project.target}
                  deadline={project.deadline}
                  amountCollected={project.amountCollected}
                  image={project.image}
                  handleClick={() => router.push(`/projects/${project.id}`)}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 