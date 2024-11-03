'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tweet } from '@/lib/types'
import { Heart, BarChart2, MessageCircle, Bookmark, Repeat } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"

type MetricType = 'impressions' | 'likes' | 'comments' | 'bookmarks' | 'retweets'

interface TweetHeatmapProps {
  tweets: Tweet[]
}

interface BucketData {
  tweets: Tweet[]
  total: number
  average: number
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DISPLAYED_HOURS = [...HOURS.filter(hour => hour % 4 === 0), 23]

export function TweetHeatmap({ tweets }: TweetHeatmapProps) {
  const [metric, setMetric] = useState<MetricType>('impressions')

  const getMetricValue = (tweet: Tweet): number => {
    switch (metric) {
      case 'impressions':
        return tweet.view_count
      case 'likes':
        return tweet.like_count
      case 'comments':
        return tweet.reply_count
      case 'bookmarks':
        return tweet.bookmark_count
      case 'retweets':
        return tweet.retweet_count
      default:
        return tweet.view_count
    }
  }

  const buckets = useMemo(() => {
    const bucketMap: Record<string, BucketData> = {}
    
    // Initialize buckets
    DAYS.forEach(day => {
      HOURS.forEach(hour => {
        bucketMap[`${day}-${hour}`] = {
          tweets: [],
          total: 0,
          average: 0
        }
      })
    })

    // Fill buckets with tweets
    tweets.forEach(tweet => {
      const date = new Date(tweet.date)
      const day = DAYS[date.getDay()]
      const hour = date.getHours()
      const key = `${day}-${hour}`
      
      bucketMap[key].tweets.push(tweet)
      bucketMap[key].total += getMetricValue(tweet)
    })

    // Calculate averages
    Object.keys(bucketMap).forEach(key => {
      const bucket = bucketMap[key]
      bucket.average = bucket.tweets.length > 0 
        ? bucket.total / bucket.tweets.length 
        : 0
    })

    return bucketMap
  }, [tweets, metric])

  // Find max value for color scaling
  const maxValue = Math.max(...Object.values(buckets).map(b => b.average))

  const getColor = (value: number): string => {
    const intensity = maxValue > 0 ? (value / maxValue) : 0
    // If there are tweets in this bucket (value > 0), use at least 20% opacity
    const opacity = value > 0 ? Math.max(10, Math.round(intensity * 100)) : 0
    return `hsl(var(--primary) / ${opacity}%)`
  }

  const formatNumber = (num: number): string => {
    return num >= 1000000
      ? `${(num / 1000000).toFixed(1)}M`
      : num >= 1000
      ? `${(num / 1000).toFixed(1)}K`
      : num.toString()
  }

  const formatHour = (hour: number): string => {
    return `${hour.toString().padStart(2, '0')}:00`
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Tweet Timing Analysis</CardTitle>
          <CardDescription>Performance heatmap by day and hour</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end mb-4">
          <div className="flex items-center space-x-2">
            <Label className="text-base">Metric:</Label>
            <div className="flex items-center rounded-md border p-1 space-x-1">
              <Toggle
                variant="outline"
                size="sm"
                pressed={metric === 'impressions'}
                onPressedChange={() => setMetric('impressions')}
              >
                <BarChart2 className="h-4 w-4" />
              </Toggle>
              <Toggle
                variant="outline"
                size="sm"
                pressed={metric === 'likes'}
                onPressedChange={() => setMetric('likes')}
              >
                <Heart className="h-4 w-4" />
              </Toggle>
              <Toggle
                variant="outline"
                size="sm"
                pressed={metric === 'comments'}
                onPressedChange={() => setMetric('comments')}
              >
                <MessageCircle className="h-4 w-4" />
              </Toggle>
              <Toggle
                variant="outline"
                size="sm"
                pressed={metric === 'bookmarks'}
                onPressedChange={() => setMetric('bookmarks')}
              >
                <Bookmark className="h-4 w-4" />
              </Toggle>
              <Toggle
                variant="outline"
                size="sm"
                pressed={metric === 'retweets'}
                onPressedChange={() => setMetric('retweets')}
              >
                <Repeat className="h-4 w-4" />
              </Toggle>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex-1 mr-4">
            <div className="grid grid-cols-7 gap-0.5 p-0.5 rounded-md">
              {HOURS.map(hour => (
                DAYS.map(day => {
                  const bucket = buckets[`${day}-${hour}`]
                  return (
                    <TooltipProvider key={`${day}-${hour}`}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div 
                            className="h-6 w-full rounded-sm transition-colors hover:opacity-80 border border-muted-foreground/20"
                            style={{ backgroundColor: getColor(bucket.average) }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-semibold">{day} {formatHour(hour)}</p>
                            <p>Average: {formatNumber(bucket.average)}</p>
                            <p>Total: {formatNumber(bucket.total)}</p>
                            <p>Tweets: {bucket.tweets.length}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })
              ))}
            </div>
            <div className="flex mt-2">
              {DAYS.map(day => (
                <div key={day} className="flex-1 text-xs text-muted-foreground text-center">
                  {day}
                </div>
              ))}
            </div>
          </div>
          <div className="w-12 flex flex-col justify-between" style={{ height: `${24 * 24}px` }}>
            {DISPLAYED_HOURS.map((hour, index) => (
              <div 
                key={hour} 
                className="text-xs text-muted-foreground"
                style={{
                  position: 'absolute',
                  transform: 'translateY(-50%)',
                  marginTop: `${(hour * 24) + (hour * 2) + 14}px`
                }}
              >
                {formatHour(hour)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 