"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Metric, Tweet } from "@/lib/types"
import { TweetPerformance } from "./tweet-performance"
import { Metrics } from "./metrics"

const metricLabels: Record<Metric, string> = {
  impressions: "Impressions",
  engagement_rate: "Engagement Rate",
  comments: "Comments",
  likes: "Likes",
  bookmarks: "Bookmarks",
  retweets: "Retweets",
}

export function TweetAnalyticsDashboardComponent() {
  const { data: session } = useSession()
  const [tweetData, setTweetData] = useState<Tweet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [handle, setHandle] = useState<string | null>(null)

  useEffect(() => {
    const fetchTweets = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch(`/api/tweets/${session.user.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch tweets')
        }

        const data: Tweet[] = await response.json()
        setTweetData(data)
        setHandle(data[0].author.handle)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching tweets:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTweets()
  }, [session?.user?.name])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Loading tweets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p>Please sign in to view your tweet analytics</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Tweet Analytics for @{handle}</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <TweetPerformance tweets={tweetData} metricLabels={metricLabels} />
        <Metrics tweets={tweetData} metricLabels={metricLabels} />
      </main>
    </div>
  )
}