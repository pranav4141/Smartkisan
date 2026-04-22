"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageSquare, ThumbsUp, Send, Image as ImageIcon, Sparkles, Loader2 } from "lucide-react"
import { summarizeCommunityPosts } from "@/ai/flows/summarize-community-posts"
import { MOCK_POSTS } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function Community() {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [newPost, setNewPost] = useState("")
  const [summarizing, setSummarizing] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const { toast } = useToast()

  const handlePost = () => {
    if (!newPost.trim()) return
    const post = {
      id: Date.now().toString(),
      author: "Rajesh Kumar (You)",
      text: newPost,
      comments: [],
      likes: 0,
      created_at: "Just now"
    }
    setPosts([post, ...posts])
    setNewPost("")
    toast({ title: "Post shared with the community!" })
  }

  const getSummary = async (post: typeof MOCK_POSTS[0]) => {
    setSummarizing(true)
    try {
      const res = await summarizeCommunityPosts({
        postText: post.text,
        commentTexts: post.comments
      })
      setSummary(res.summary)
    } catch (err) {
      console.error(err)
    } finally {
      setSummarizing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
          <Users className="h-8 w-8 text-orange-600" /> Farmer Community
        </h1>
        <p className="text-muted-foreground">Share knowledge, ask questions, and grow together.</p>
      </header>

      {/* Post Creator */}
      <Card className="border-primary/20 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
              <AvatarFallback>RK</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="What's on your mind? Share a farming tip or ask a question..."
              className="resize-none min-h-[100px] border-none focus-visible:ring-0 bg-muted/30 text-lg"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center border-t pt-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <ImageIcon className="h-4 w-4 mr-2" /> Add Image
            </Button>
            <Button onClick={handlePost} disabled={!newPost.trim()}>
              <Send className="h-4 w-4 mr-2" /> Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary Banner */}
      {summary && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 flex gap-3 items-start">
            <Sparkles className="h-5 w-5 text-orange-500 shrink-0 mt-1" />
            <div className="space-y-1">
              <h4 className="font-bold text-orange-800 text-sm">Discussion Summary</h4>
              <p className="text-sm text-orange-700 italic">"{summary}"</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setSummary(null)}>✕</Button>
          </CardContent>
        </Card>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage src={`https://picsum.photos/seed/${post.author}/40/40`} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{post.author}</CardTitle>
                <CardDescription>{post.created_at}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => getSummary(post)}
                disabled={summarizing}
              >
                {summarizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span className="hidden sm:inline">Summarize</span>
              </Button>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{post.text}</p>
            </CardContent>
            <CardFooter className="bg-muted/30 py-3 flex gap-6">
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp className="h-4 w-4" /> {post.likes} Likes
              </button>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="h-4 w-4" /> {post.comments.length} Comments
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}