'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TweetList } from './tweet-list'
import { Tweet } from '@/lib/types'
import { Heart, BarChart2, MessageCircle, Bookmark, Repeat } from "lucide-react"
import { Label } from '@/components/ui/label'

type SortMetric = 'impressions' | 'likes' | 'comments' | 'bookmarks' | 'retweets'

interface PopularTweetsProps {
  tweets: Tweet[]
}

export function PopularTweets({ tweets }: PopularTweetsProps) {
  const [sortBy, setSortBy] = useState<SortMetric>('impressions')

  const sortedTweets = [...tweets].sort((a, b) => {
    switch (sortBy) {
      case 'impressions':
        return b.view_count - a.view_count
      case 'likes':
        return b.like_count - a.like_count
      case 'comments':
        return b.reply_count - a.reply_count
      case 'bookmarks':
        return b.bookmark_count - a.bookmark_count
      case 'retweets':
        return b.retweet_count - a.retweet_count
      default:
        return b.view_count - a.view_count
    }
  })

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Popular Tweets</CardTitle>
            <CardDescription>Top performing tweets by engagement</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Label>Sort by:</Label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortMetric)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="impressions">
                  <div className="flex items-center">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Impressions
                  </div>
                </SelectItem>
                <SelectItem value="likes">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Likes
                  </div>
                </SelectItem>
                <SelectItem value="comments">
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Comments
                  </div>
                </SelectItem>
                <SelectItem value="bookmarks">
                  <div className="flex items-center">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmarks
                  </div>
                </SelectItem>
                <SelectItem value="retweets">
                  <div className="flex items-center">
                    <Repeat className="w-4 h-4 mr-2" />
                    Retweets
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TweetList tweets={sortedTweets} maxHeight={`${24 * 24 + (24 * 2) + 24}px`} />
      </CardContent>
    </Card>
  )
} 