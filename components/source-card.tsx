'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IconCircleDot } from '@tabler/icons-react'

interface CardData {
  id: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
}

interface ComponentProps {
  data: CardData | null;
  isLoading: boolean;
}

export function SourceCard({ data, isLoading }: ComponentProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const defaultColor = '#3b82f6' // Default blue color
  const DefaultIcon = IconCircleDot // Default icon

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
          className="w-[250px] overflow-hidden rounded-lg cursor-pointer"
          onMouseEnter={() => setIsPopoverOpen(true)}
          onMouseLeave={() => setIsPopoverOpen(false)}
        >
          <CardContent className="p-2">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="space-y-1"
                >
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
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <motion.div
                      variants={itemVariants}
                      className={`h-5 w-5 rounded-md flex items-center justify-center flex-shrink-0`}
                      style={{ backgroundColor: data?.color || defaultColor }}
                    >
                      <DefaultIcon className="text-white" size={12} />
                    </motion.div>
                    <motion.h3 variants={itemVariants} className="text-[13px] font-semibold">
                      {data?.title || 'Feature Title'}
                    </motion.h3>
                  </div>
                  <motion.p variants={itemVariants} className="text-xs text-gray-500 truncate">
                    {data?.description || 'Short description here that gets truncated if it\'s too long for a single line'}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
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