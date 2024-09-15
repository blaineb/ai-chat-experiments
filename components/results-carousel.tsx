'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IconCircleDot, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

interface CardData {
  id: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
}

interface SourceData {
  source: string;
  objects: CardData[];
}

interface CardProps {
  data: CardData | null;
  isLoading: boolean;
}

function SkeletonCard({ data, isLoading }: CardProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const defaultColor = '#3b82f6'
  const DefaultIcon = IconCircleDot

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 30 }
    },
  }

  const skeletonPulse = {
    initial: { opacity: 0.7 },
    animate: {
      opacity: 1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.8,
      },
    },
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Card 
          className="w-full overflow-hidden rounded-lg cursor-pointer"
          onMouseEnter={() => setIsPopoverOpen(true)}
          onMouseLeave={() => setIsPopoverOpen(false)}
        >
          <CardContent className="p-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1"
            >
              {isLoading ? (
                <>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      variants={skeletonPulse}
                      initial="initial"
                      animate="animate"
                      className="h-5 w-5 rounded-md bg-gray-200 flex-shrink-0"
                    />
                    <motion.div
                      variants={skeletonPulse}
                      initial="initial"
                      animate="animate"
                      className="h-3 w-[100px] bg-gray-200 rounded-full"
                    />
                  </div>
                  <motion.div
                    variants={skeletonPulse}
                    initial="initial"
                    animate="animate"
                    className="h-3 w-full bg-gray-200 rounded-full"
                  />
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      variants={itemVariants}
                      className={`h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0`}
                      style={{ backgroundColor: data?.color || defaultColor }}
                    >
                      <DefaultIcon className="text-white" size={12} />
                    </motion.div>
                    <motion.h3 variants={itemVariants} className="text-[13px] font-semibold truncate">
                      {data?.title || 'Feature Title'}
                    </motion.h3>
                  </div>
                  <motion.p variants={itemVariants} className="text-xs text-gray-500 truncate">
                    {data?.description || 'Short description here that gets truncated if it\'s too long for a single line'}
                  </motion.p>
                </>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top" align="start">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-md bg-gray-200 flex-shrink-0 animate-pulse" />
              <div className="h-3 w-[100px] bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="w-full h-40 bg-gray-200 rounded-md animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div 
                className={`h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0`}
                style={{ backgroundColor: data?.color || defaultColor }}
              >
                <DefaultIcon className="text-white" size={12} />
              </div>
              <h3 className="text-[13px] font-semibold">{data?.title || 'Feature Title'}</h3>
            </div>
            {data?.imageUrl && (
              <img 
                src={data.imageUrl} 
                alt={data.title} 
                className="w-full h-40 object-cover rounded-md"
              />
            )}
            <p className="text-sm text-gray-700">
              {data?.description || 'Short description here that gets truncated if it\'s too long for a single line'}
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default function ResultsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedCards, setLoadedCards] = useState<CardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSource, setCurrentSource] = useState(0)

  const mockData: SourceData[] = [
    {
      source: "Slack",
      objects: [
        {
          id: '1',
          title: 'Channel Discussion',
          description: 'Recent conversation in #project-alpha about the new feature.',
          color: '#3b82f6',
          imageUrl: '/placeholder.svg?height=160&width=320'
        },
        {
          id: '2',
          title: 'Team Announcement',
          description: 'Important update from the product team on Slack.',
          color: '#10b981',
          imageUrl: '/placeholder.svg?height=160&width=320'
        },
      ]
    },
    {
      source: "Salesforce",
      objects: [
        {
          id: '3',
          title: 'Customer Inquiry',
          description: 'New support ticket opened by Acme Corp.',
          color: '#f59e0b',
          imageUrl: '/placeholder.svg?height=160&width=320'
        },
        {
          id: '4',
          title: 'Sales Opportunity',
          description: 'High-value lead identified in Salesforce pipeline.',
          color: '#ef4444',
          imageUrl: '/placeholder.svg?height=160&width=320'
        },
      ]
    }
  ]

  useEffect(() => {
    const loadCards = async () => {
      for (let sourceIndex = 0; sourceIndex < mockData.length; sourceIndex++) {
        await new Promise(resolve => setTimeout(resolve, 500)) // Delay before changing source
        setCurrentSource(sourceIndex)
        for (let i = 0; i < mockData[sourceIndex].objects.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          setLoadedCards(prev => [...prev, mockData[sourceIndex].objects[i]])
        }
      }
      setIsLoading(false)
    }
    loadCards()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (loadedCards.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (loadedCards.length - 2)) % (loadedCards.length - 2))
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={isLoading ? 'loading' : 'loaded'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden"
        >
          {isLoading ? (
            <motion.h2
              className="text-sm font-bold text-gray-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              }}
              style={{
                backgroundImage: "linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Searching {mockData[currentSource].source}...
            </motion.h2>
          ) : (
            <h2 className="text-sm font-bold text-gray-700">
              Top results
            </h2>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="relative w-full max-w-[568px] mx-auto">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
          >
            {loadedCards.map((cardData, index) => (
              <div key={cardData.id} className="flex-shrink-0 w-1/3 px-2">
                <SkeletonCard 
                  data={cardData}
                  isLoading={index >= loadedCards.length}
                />
              </div>
            ))}
            {[...Array(Math.max(0, 4 - loadedCards.length))].map((_, index) => (
              <div key={`skeleton-${index}`} className="flex-shrink-0 w-1/3 px-2">
                <SkeletonCard 
                  data={null}
                  isLoading={true}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md"
          disabled={currentIndex === 0 || loadedCards.length < 3}
        >
          <IconChevronLeft size={16} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-md"
          disabled={currentIndex === Math.max(0, loadedCards.length - 3) || loadedCards.length < 3}
        >
          <IconChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}