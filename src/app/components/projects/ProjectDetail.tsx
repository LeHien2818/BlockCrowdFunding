"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Rocket, Coins, Users, Calendar, ChevronsRight, Award, CircleDollarSign, PiggyBank } from "lucide-react"
import Container from "../Container"
import { useCrowdfunding } from "@/app/hooks/useCrowdfunding"
import { ethers } from "ethers"
import { daysLeft, calculateBarPercentage } from '@/app/utils'
import { InvestorsSection } from './InvestorsSection'
import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react"
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog'
import { toast } from 'react-hot-toast'
import { Input } from '../ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '../ui/progress'

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  date: string
}

interface ProjectDetailProps {
  id: string
  image: string
  title: string
  content: string
  target: string
  amountCollected: string
  deadline: number
  owner: string
  donators: string[]
  donations: string[]
}

const MotionButton = motion(Button);

const ProjectDetail = ({
  id,
  image,
  title,
  content,
  target,
  amountCollected,
  deadline,
  owner,
  donators: initialDonators,
  donations: initialDonations,
}: ProjectDetailProps) => {
  const [contribution, setContribution] = useState<string>('0.1')
  const [activeTab, setActiveTab] = useState<string>("about")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [donators, setDonators] = useState<string[]>(initialDonators)
  const [donations, setDonations] = useState<string[]>(initialDonations)
  const address = useAddress()
  const { donateToCampaign, isDonating, getDonators } = useCrowdfunding()
  const [isRequestingFunds, setIsRequestingFunds] = useState(false)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [requestReason, setRequestReason] = useState("")
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [reason, setReason] = useState('')
  const [identityVerification, setIdentityVerification] = useState<File | null>(null)
  const [collateral, setCollateral] = useState<File | null>(null)
  const [collateralType, setCollateralType] = useState<'document' | 'token' | 'nft'>('document')
  const [collateralToken, setCollateralToken] = useState('')
  const [collateralAmount, setCollateralAmount] = useState('')
  const [collateralNFT, setCollateralNFT] = useState('')
  const [collateralNFTId, setCollateralNFTId] = useState('')
  const [isReportingProfit, setIsReportingProfit] = useState(false)
  const [profitAmount, setProfitAmount] = useState("")
  const [showReportProfitDialog, setShowReportProfitDialog] = useState(false)

  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
  const { data: campaignStatus } = useContractRead(contract, "checkCampaignStatus", [id])
  const { data: donatorProfit } = useContractRead(
    contract,
    "getDonatorProfitInfo",
    [id, address || "0x0"]
  )
  const { data: profitInfo } = useContractRead(contract, "getCampaignProfitInfo", [id])
  const { data: campaign } = useContractRead(contract, "campaigns", [id])

  const remainingDays = daysLeft(Number(deadline))
  const parsedTarget = ethers.utils.parseEther(target.toString() || '0')
  const parsedAmountCollected = ethers.utils.parseEther(amountCollected.toString() || '0')
  const percentage = calculateBarPercentage(
    parsedTarget,
    parsedAmountCollected
  )

  const isCampaignEnded = campaignStatus?.isCompleted || Number(remainingDays) <= 0
  const isOwner = owner === address && address

  const canWithdraw = isCampaignEnded && isOwner
  const canClaim = donatorProfit && Number(donatorProfit.profitShare) > 0 &&
    (Number(donatorProfit.lastClaim) + Number(profitInfo?.profitDistributionPeriod || 0) <= Date.now() / 1000)

  useEffect(() => {
    const fetchDonators = async () => {
      try {
        const result = await getDonators(id)
        if (result) {
          setDonators(result.donators)
          setDonations(result.donations)
        }
      } catch (error) {
        console.error('Error fetching donators:', error)
      }
    }

    fetchDonators()
  }, [id, getDonators, isDonating])

  const handleContribute = async () => {
    if (!contribution || parseFloat(contribution) <= 0) {
      toast.error('Vui lòng nhập số tiền hợp lệ')
      return
    }

    setIsSubmitting(true)
    try {
      await donateToCampaign(parseInt(id), contribution)
      toast.success('Đóng góp thành công! Cảm ơn bạn đã ủng hộ dự án.')
      setContribution('0.1')
    } catch (error) {
      console.error('Lỗi khi đóng góp:', error)
      toast.error('Đã xảy ra lỗi khi đóng góp. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận")
      return
    }

    setIsSubmitting(true)
    try {
      const commentData = {
        id: `comment-${Date.now()}`,
        user: { name: "Người dùng ẩn danh", avatar: `/placeholder.svg` },
        content: newComment,
        date: new Date().toLocaleDateString("vi-VN")
      }
      setComments([commentData, ...comments])
      setNewComment("")
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error)
      toast.error("Đã xảy ra lỗi khi thêm bình luận. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleIdentityVerificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setIdentityVerification(e.target.files[0]);
  }

  const handleCollateralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCollateral(e.target.files[0]);
  }

  const handleRequestFastFunding = async () => {
    if (!address) return toast.error("Vui lòng kết nối ví");
    if (!campaignStatus) return toast.error("Không thể kiểm tra trạng thái chiến dịch");
    if (campaignStatus.isActive) return toast.error("Chiến dịch đã được kích hoạt. Không thể yêu cầu huy động vốn nhanh.");
    if (campaignStatus.isCompleted) return toast.error("Chiến dịch đã hoàn thành. Không thể yêu cầu huy động vốn nhanh.");
    if (!reason) return toast.error("Vui lòng nhập lý do huy động vốn nhanh");
    if (!identityVerification) return toast.error("Vui lòng tải lên giấy tờ xác thực danh tính");
    if (collateralType === 'document' && !collateral) return toast.error("Vui lòng tải lên tài liệu tài sản thế chấp");
    if (collateralType === 'token' && (!collateralToken || !collateralAmount || Number(collateralAmount) <= 0)) return toast.error("Vui lòng nhập thông tin token thế chấp hợp lệ");
    if (collateralType === 'nft' && (!collateralNFT || !collateralNFTId)) return toast.error("Vui lòng nhập thông tin NFT thế chấp hợp lệ");

    setIsRequestingFunds(true);
    try {
      const collateralTypeEnum = collateralType === 'document' ? 1 : collateralType === 'token' ? 2 : 3;
      // Mock IPFS URLs. Replace with actual storage upload implementation.
      const identityVerificationUrl = "ipfs://mock-identity";
      const collateralUrl = collateral ? "ipfs://mock-collateral" : "";

      await contract?.call("requestFastFunding", [
        id,
        reason,
        identityVerificationUrl,
        collateralUrl,
        collateralType === 'token' ? collateralToken : ethers.constants.AddressZero,
        collateralType === 'token' ? ethers.utils.parseEther(collateralAmount) : 0,
        collateralType === 'nft' ? collateralNFT : ethers.constants.AddressZero,
        collateralType === 'nft' ? Number(collateralNFTId) : 0,
        collateralTypeEnum
      ]);
      toast.success("Yêu cầu huy động vốn nhanh đã được gửi");
      setShowRequestDialog(false);
    } catch (error: any) {
      console.error("Error requesting fast funding:", error);
      toast.error(error.message || "Có lỗi xảy ra khi gửi yêu cầu huy động vốn nhanh");
    } finally {
      setIsRequestingFunds(false);
    }
  }

  const handleClaimProfit = async () => {
    if (!canClaim || !contract) return;
    setIsClaiming(true);
    try {
      const tx = await contract.call("claimProfit", [id]);
      await tx.wait();
      toast.success("Đã nhận lợi nhuận thành công!");
    } catch (error) {
      console.error("Lỗi khi nhận lợi nhuận:", error);
      toast.error("Không thể nhận lợi nhuận. Vui lòng thử lại sau.");
    } finally {
      setIsClaiming(false);
    }
  }

  const handleWithdraw = async () => {
    if (!canWithdraw || !contract) {
        toast.error("Không thể rút tiền. Dự án phải hoàn thành hoặc hết hạn.");
        return;
    }
    setIsWithdrawing(true);
    try {
        const tx = await contract.call("withdrawCampaignFunds", [id]);
        await tx.wait();
        toast.success("Rút tiền thành công!");
        setShowWithdrawDialog(false);
    } catch (error) {
        console.error("Lỗi khi rút tiền:", error);
        toast.error("Không thể rút tiền. Vui lòng thử lại sau.");
    } finally {
        setIsWithdrawing(false);
    }
  }

  const handleReportProfit = async () => {
    if (!profitAmount || !contract) return;
    setIsReportingProfit(true);
    try {
        const amountInWei = ethers.utils.parseEther(profitAmount);
        const tx = await contract.call("reportProfit", [id, amountInWei], { value: amountInWei });
        await tx.wait();
        toast.success("Báo cáo lợi nhuận thành công!");
        setShowReportProfitDialog(false);
        setProfitAmount("");
    } catch (error: any) {
        console.error("Lỗi khi báo cáo lợi nhuận:", error);
        toast.error(error.message?.includes("Must wait for profit distribution period")
            ? "Phải đợi qua thời gian phân phối lợi nhuận giữa các lần báo cáo"
            : "Không thể báo cáo lợi nhuận. Vui lòng thử lại sau.");
    } finally {
        setIsReportingProfit(false);
    }
  }

  const TABS = [
    { id: "about", label: "Giới thiệu" },
    { id: "backers", label: "Nhà đầu tư" },
    { id: "comments", label: "Bình luận" },
  ];

  return (
    <Container>
      <motion.div
        className="mx-auto max-w-7xl text-white mt-10 lg:mt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Project Image */}
            <motion.div
              className="overflow-hidden rounded-2xl shadow-2xl shadow-purple-900/20"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="relative h-60 md:h-96 w-full">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            {/* Project Header */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-100">{title}</h1>
              <p className="text-gray-400">
                bởi <span className="font-medium text-purple-400">{owner.slice(0, 6)}...{owner.slice(-4)}</span>
              </p>
            </div>

            {/* Project Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { icon: CircleDollarSign, label: "Đã huy động", value: `${amountCollected} ETH` },
                { icon: PiggyBank, label: "Mục tiêu", value: `${target} ETH` },
                { icon: Users, label: "Nhà đầu tư", value: donators.length },
                { icon: Calendar, label: "Còn lại", value: `${remainingDays} ngày` },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="bg-gray-800/50 rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <stat.icon className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div>
              <Progress value={percentage} className="w-full h-3 bg-gray-800" indicatorClassName="bg-purple-500" />
              <div className="flex justify-between text-sm mt-1">
                <span className="font-medium text-purple-300">{percentage.toFixed(2)}%</span>
                <span className="text-gray-400">Mục tiêu: {target} ETH</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-700">
              <div className="flex space-x-2 md:space-x-8 -mb-px">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    className={`relative px-3 py-4 text-sm md:text-base font-medium transition-colors duration-300 ${activeTab === tab.id
                        ? "text-purple-400"
                        : "text-gray-400 hover:text-white"
                      }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"
                        layoutId="underline"
                      />
                    )}
                    {tab.label} {tab.id === "backers" && `(${donators.length})`} {tab.id === "comments" && `(${comments.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px] py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "about" && (
                     <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                  )}
                  {activeTab === "backers" && (
                    <InvestorsSection donators={donators} donations={donations} amountCollected={amountCollected} />
                  )}
                  {activeTab === "comments" && (
                    <div className="space-y-6">
                      <div>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Viết bình luận của bạn..."
                          className="w-full rounded-lg border-gray-700 bg-gray-800 p-4 text-white focus:border-purple-500 focus:ring-purple-500"
                          rows={3}
                        />
                        <MotionButton
                          onClick={handleAddComment}
                          disabled={isSubmitting}
                          className="mt-2 bg-purple-500 hover:bg-purple-600 text-white"
                          whileTap={{ scale: 0.95 }}
                        >
                          {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
                        </MotionButton>
                      </div>
                      <div className="space-y-4">
                        {comments.length > 0 ? comments.map((comment) => (
                          <div key={comment.id} className="rounded-lg bg-gray-800/50 p-4 flex space-x-4">
                            <Image src={comment.user.avatar} alt={comment.user.name} width={40} height={40} className="rounded-full" />
                            <div>
                              <p className="font-medium">{comment.user.name} <span className="text-xs text-gray-400 ml-2">{comment.date}</span></p>
                              <p className="text-gray-300">{comment.content}</p>
                            </div>
                          </div>
                        )) : <p className="text-gray-400 text-center py-4">Chưa có bình luận nào.</p>}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column - Sticky Pledge Card */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-24 space-y-6">
              <motion.div
                className="rounded-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 p-6 space-y-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {/* Pledge Form */}
                {!isCampaignEnded && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Ủng hộ dự án</h3>
                    <div className="space-y-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">ETH</span>
                        <Input
                          id="amount" type="number" step="0.01" min="0.01"
                          value={contribution}
                          onChange={(e) => setContribution(e.target.value)}
                          className="w-full rounded-lg border-gray-600 bg-gray-900 p-3 pl-12 text-white focus:border-purple-500 focus:ring-purple-500"
                          disabled={isCampaignEnded}
                        />
                      </div>
                      <MotionButton
                        onClick={handleContribute}
                        disabled={isSubmitting || isDonating || isCampaignEnded}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white text-base py-6"
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting || isDonating ? "Đang xử lý..." : "Đóng góp ngay"}
                      </MotionButton>
                    </div>
                  </div>
                )}
                 {isCampaignEnded && (
                  <div className="text-center p-4 bg-gray-900 rounded-lg">
                      <p className="font-semibold text-purple-400">Dự án đã kết thúc</p>
                      <p className="text-sm text-gray-400 mt-1">Không thể đóng góp thêm vào lúc này.</p>
                  </div>
                )}


                {/* Owner Actions */}
                <AnimatePresence>
                  {isOwner && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 pt-6 border-t border-gray-700"
                    >
                      <h3 className="text-lg font-semibold text-center">Bảng điều khiển</h3>
                       <Button onClick={() => setShowRequestDialog(true)} variant="outline" className="w-full border-purple-500/50 hover:bg-purple-500/10">
                         <Rocket className="w-4 h-4 mr-2" /> Yêu cầu vốn nhanh
                      </Button>
                      <Button onClick={() => setShowWithdrawDialog(true)} variant="outline" className="w-full border-green-500/50 hover:bg-green-500/10">
                          <Award className="w-4 h-4 mr-2" /> Rút tiền
                      </Button>
                       <Button onClick={() => setShowReportProfitDialog(true)} variant="outline" className="w-full border-blue-500/50 hover:bg-blue-500/10">
                          <Coins className="w-4 h-4 mr-2" /> Báo cáo lợi nhuận
                       </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                 {/* Investor Dashboard */}
                 <AnimatePresence>
                  {donatorProfit && Number(donatorProfit.donationAmount) > 0 && (
                     <motion.div
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       className="space-y-4 pt-6 border-t border-gray-700"
                     >
                       <h3 className="text-lg font-semibold text-center">Lợi nhuận của bạn</h3>
                       <div className="space-y-2 text-sm">
                          <div className="flex justify-between"><span>Đã đầu tư:</span> <span className="font-bold">{ethers.utils.formatEther(donatorProfit.donationAmount)} ETH</span></div>
                          <div className="flex justify-between"><span>Lợi nhuận được nhận:</span> <span className="font-bold text-green-400">{ethers.utils.formatEther(donatorProfit.profitShare)} ETH</span></div>
                          <div className="flex justify-between"><span>Lần nhận cuối:</span> <span className="font-bold">{Number(donatorProfit.lastClaim) === 0 ? "Chưa có" : new Date(Number(donatorProfit.lastClaim) * 1000).toLocaleDateString()}</span></div>
                       </div>
                       <Button
                        onClick={handleClaimProfit}
                        disabled={!canClaim || isClaiming}
                        className="w-full bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-600"
                       >
                        {isClaiming ? "Đang xử lý..." : "Nhận lợi nhuận"}
                       </Button>
                       {!canClaim && Number(donatorProfit.profitShare) > 0 && (
                          <p className="mt-2 text-xs text-purple-400 text-center">
                            Lần nhận tiếp theo vào ngày {new Date((Number(donatorProfit.lastClaim) + Number(profitInfo?.profitDistributionPeriod || 0)) * 1000).toLocaleDateString()}
                          </p>
                        )}
                     </motion.div>
                  )}
                 </AnimatePresence>

              </motion.div>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Yêu cầu huy động vốn nhanh</DialogTitle>
                <DialogDescription>
                  Cung cấp thông tin để BQT xem xét và kích hoạt sớm dự án của bạn.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lý do</label>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Trình bày lý do bạn cần huy động vốn nhanh..." className="w-full rounded-lg border-gray-700 bg-gray-800 p-3 text-white focus:border-purple-500 focus:ring-purple-500" rows={3}/>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Xác thực danh tính</label>
                  <Input type="file" accept=".pdf,.jpg,.png" onChange={handleIdentityVerificationChange} className="bg-gray-800 border-gray-700"/>
                  <p className="text-xs text-gray-400">Tải lên CMND/CCCD/Hộ chiếu.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Loại tài sản thế chấp</label>
                  <select value={collateralType} onChange={(e) => setCollateralType(e.target.value as any)} className="w-full rounded-lg border-gray-700 bg-gray-800 p-3 text-white focus:border-purple-500 focus:ring-purple-500">
                    <option value="document">Tài liệu (Sổ đỏ, hợp đồng, ...)</option>
                    <option value="token">Token (ERC20, ...)</option>
                    <option value="nft">NFT (ERC721, ...)</option>
                  </select>
                </div>

                <AnimatePresence>
                {collateralType === 'document' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <label className="text-sm font-medium">Tài liệu thế chấp</label>
                    <Input type="file" accept=".pdf,.jpg,.png" onChange={handleCollateralChange} className="bg-gray-800 border-gray-700"/>
                  </motion.div>
                )}
                {collateralType === 'token' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <Input value={collateralToken} onChange={(e) => setCollateralToken(e.target.value)} placeholder="Địa chỉ token" className="bg-gray-800 border-gray-700"/>
                    <Input type="number" value={collateralAmount} onChange={(e) => setCollateralAmount(e.target.value)} placeholder="Số lượng" className="bg-gray-800 border-gray-700"/>
                  </motion.div>
                )}
                {collateralType === 'nft' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <Input value={collateralNFT} onChange={(e) => setCollateralNFT(e.target.value)} placeholder="Địa chỉ NFT" className="bg-gray-800 border-gray-700"/>
                    <Input type="number" value={collateralNFTId} onChange={(e) => setCollateralNFTId(e.target.value)} placeholder="Token ID" className="bg-gray-800 border-gray-700"/>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowRequestDialog(false)} variant="outline">Hủy</Button>
                <Button onClick={handleRequestFastFunding} disabled={isRequestingFunds} className="bg-purple-500 hover:bg-purple-600">
                  {isRequestingFunds ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </Button>
              </DialogFooter>
            </DialogContent>
        </Dialog>
        <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
             <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Rút tiền từ dự án</DialogTitle>
                    <DialogDescription>
                      {isCampaignEnded
                        ? "Bạn sẽ rút toàn bộ số tiền đã gọi được từ dự án."
                        : "Dự án phải hoàn thành hoặc hết hạn mới có thể rút tiền."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                     <p>Số dư khả dụng: {campaign ? ethers.utils.formatEther(campaign.amountCollected) : "0"} ETH</p>
                     {!isCampaignEnded && <p className="text-purple-400 mt-2">Dự án chưa kết thúc. Còn {remainingDays} ngày.</p>}
                  </div>
                  <DialogFooter>
                    <Button onClick={handleWithdraw} disabled={isWithdrawing || !canWithdraw} className="w-full bg-green-500 hover:bg-green-600 text-black">
                      {isWithdrawing ? "Đang xử lý..." : "Xác nhận rút tiền"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
        </Dialog>
        <Dialog open={showReportProfitDialog} onOpenChange={setShowReportProfitDialog}>
             <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Báo cáo lợi nhuận</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input type="number" value={profitAmount} onChange={(e) => setProfitAmount(e.target.value)} placeholder="0.0 ETH" className="bg-gray-800 border-gray-600"/>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setShowReportProfitDialog(false)} variant="outline">Hủy</Button>
                    <Button onClick={handleReportProfit} disabled={isReportingProfit || !profitAmount} className="bg-blue-500 hover:bg-blue-600">
                      {isReportingProfit ? "Đang xử lý..." : "Báo cáo"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
        </Dialog>
      </motion.div>
    </Container>
  )
}

export default ProjectDetail
