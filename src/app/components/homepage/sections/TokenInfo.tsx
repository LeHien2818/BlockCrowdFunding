'use client'

import { Copy, ExternalLink, Gift, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const TokenInfo = () => {
  const [copiedToken, setCopiedToken] = useState(false)
  const [copiedDonation, setCopiedDonation] = useState(false)
  
  const tokenAddress = '0xb99192491aB525d7b1775b95A2560b8095B89B89'
  const donationAddress = '0x9eD54f75893Fa84f1aAC8a3a883fdDaF42c79Dae'
  const pancakeSwapLink = `https://pancakeswap.finance/swap?outputCurrency=${tokenAddress}`

  const copyToClipboard = (text: string, type: 'token' | 'donation') => {
    navigator.clipboard.writeText(text)
    if (type === 'token') {
      setCopiedToken(true)
      setTimeout(() => setCopiedToken(false), 2000)
    } else {
      setCopiedDonation(true)
      setTimeout(() => setCopiedDonation(false), 2000)
    }
  }

  return (
    <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-base font-semibold leading-7 text-purple-400">Our Token</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Join the HUFA Ecosystem
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-400">
                  By holding HUFA tokens, you're not just investing; you're becoming a vital part of the future of decentralized crowdfunding. Your support fuels the platform's growth and empowers innovators worldwide.
                </p>
            </div>

            <div className="mt-16 max-w-2xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
                <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Token Contract (BSC)</h3>
                      <div className="flex items-center gap-2">
                        <code className="bg-black/20 px-4 py-3 rounded-lg text-gray-300 flex-1 font-mono text-sm truncate">
                          {tokenAddress}
                        </code>
                        <button
                          onClick={() => copyToClipboard(tokenAddress, 'token')}
                          className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          {copiedToken ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-purple-400" />
                        <span>Support Us (Donation Address)</span>
                      </h3>
                      <div className="flex items-center gap-2">
                        <code className="bg-black/20 px-4 py-3 rounded-lg text-gray-300 flex-1 font-mono text-sm truncate">
                          {donationAddress}
                        </code>
                        <button
                          onClick={() => copyToClipboard(donationAddress, 'donation')}
                          className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          {copiedDonation ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-white/10">
                    <a
                      href={`https://bscscan.com/token/${tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-lg font-semibold px-6 py-3 rounded-full text-white border-2 border-gray-600 hover:bg-gray-800 hover:border-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>View on BscScan</span>
                    </a>
                    <a
                      href={pancakeSwapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-lg font-semibold px-6 py-3 rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Buy on PancakeSwap</span>
                    </a>
                </div>
            </div>
        </div>
    </section>
  )
}

export default TokenInfo