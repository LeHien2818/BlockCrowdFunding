'use client'

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Progress } from "../ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { daysLeft, calculateBarPercentage } from "@/app/utils"
import { ethers } from "ethers"
import { motion } from 'framer-motion'
import { Clock, Trash2 } from 'lucide-react'
import { useCrowdfunding } from "@/app/hooks/useCrowdfunding"
import { useState } from "react"
import { Button } from "../ui/button"
import { toast } from "react-hot-toast"

interface CardProjectProps {
  id: string
  owner: string
  title: string
  description: string
  target: string
  deadline: number
  amountCollected: string
  image: string
  handleClick: () => void
}

const CardProject = ({
  id,
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
}: CardProjectProps) => {
  const { address, deleteCampaign } = useCrowdfunding()
  const [isDeleting, setIsDeleting] = useState(false)
  
  const remainingDays = daysLeft(deadline)
  const percentage = calculateBarPercentage(
    ethers.utils.parseEther(target.toString()),
    ethers.utils.parseEther(amountCollected.toString())
  )
  const formattedAmountCollected = parseFloat(amountCollected).toFixed(2)


  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this project?')) return

    setIsDeleting(true)
    try {
      await deleteCampaign(parseInt(id))
      toast.success('Project deleted successfully!')
      window.location.reload()
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 shadow-lg group cursor-pointer flex flex-col relative"
      onClick={handleClick}
    >
      {address === owner && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-4 right-4 z-20">
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="destructive"
            size="icon"
            className="w-9 h-9 bg-red-500/80 hover:bg-red-500 rounded-full"
          >
            {isDeleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </motion.div>
      )}

      <div className="relative h-52 w-full">
        <Image
          src={image || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="p-5 flex-grow flex flex-col text-white">
        <h3 className="text-xl font-bold tracking-tight mb-2 truncate">{title}</h3>
        <p className="text-gray-400 text-sm line-clamp-3 flex-grow">{description}</p>
        
        <div className="mt-5">
            <Progress value={percentage} className="h-2.5 bg-white/10" indicatorClassName="bg-gradient-to-r from-purple-400 to-pink-500" />
            <div className="flex justify-between text-sm text-gray-300 mt-2">
                <span><span className="font-bold text-white">{formattedAmountCollected} ETH</span> Raised</span>
                <span><span className="font-bold text-white">{percentage.toFixed(0)}%</span></span>
            </div>
        </div>

        <div className="border-t border-white/10 mt-5 pt-4 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
                <Avatar className="w-7 h-7 border-2 border-white/20">
                    <AvatarImage src={`https://source.boringavatars.com/beam/120/${owner}`} />
                    <AvatarFallback>{owner.slice(2, 4)}</AvatarFallback>
                </Avatar>
                <p className="font-mono">{owner.slice(0, 6)}...{owner.slice(-4)}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3"/>
                <span>{remainingDays > 0 ? `${remainingDays} days left` : 'Ended'}</span>
            </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CardProject
