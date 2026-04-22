"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TrendingUp, Search, Sparkles, Loader2, ArrowUpRight, ArrowDownRight, Minus, AlertCircle } from "lucide-react"
import { summarizeMarketPrices } from "@/ai/flows/summarize-market-prices"
import { MOCK_MARKET_DATA } from "@/lib/mock-data"
import { format } from "date-fns"

export default function MarketPrices() {
  const [searchTerm, setSearchTerm] = useState("")
  const [summary, setSummary] = useState<string | null>(null)
  const [summarizing, setSummarizing] = useState(false)

  const filteredData = useMemo(() => {
    if (!searchTerm) return MOCK_MARKET_DATA;
    return MOCK_MARKET_DATA.filter(m => 
      m.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.market_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleSummarize = async () => {
    if (filteredData.length === 0) {
      setSummary("No data found to summarize. Try searching for another crop like 'Wheat' or 'Potato'.")
      return
    }
    
    setSummarizing(true)
    try {
      const result = await summarizeMarketPrices({
        cropName: searchTerm || "All Crops",
        marketData: filteredData.map(d => ({
          ...d,
          updated_at: d.updated_at
        }))
      })
      setSummary(result.summary)
    } catch (err) {
      console.error(err)
    } finally {
      setSummarizing(false)
    }
  }

  // Initial summary on load
  useEffect(() => {
    handleSummarize()
  }, [])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-secondary" /> Market Price Tracker
          </h1>
          <p className="text-muted-foreground">Live mandi rates and AI trends across Bihar markets. Prices are in ₹ per Quintal (100kg).</p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crop (e.g. Potato, Wheat)..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleSummarize} disabled={summarizing}>
            {summarizing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get AI Insight"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-secondary/5 border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-secondary">
              <Sparkles className="h-5 w-5" /> AI Market Insight
            </CardTitle>
            <CardDescription>Trends for "{searchTerm || "All Crops"}"</CardDescription>
          </CardHeader>
          <CardContent>
            {summarizing ? (
              <div className="space-y-3">
                <div className="h-4 w-full bg-secondary/10 animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-secondary/10 animate-pulse rounded" />
                <div className="h-4 w-full bg-secondary/10 animate-pulse rounded" />
                <div className="h-20 w-full bg-secondary/10 animate-pulse rounded" />
              </div>
            ) : summary ? (
              <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap italic">
                "{summary}"
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Search and click "Get AI Insight" to see trends.</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Mandi Rates</CardTitle>
            <CardDescription>Latest updates from Bihar mandis</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crop</TableHead>
                    <TableHead>Market (Mandi)</TableHead>
                    <TableHead>Price (₹/Qtl)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.crop_name}</TableCell>
                      <TableCell>{item.market_name}, {item.state}</TableCell>
                      <TableCell className="font-bold">₹{item.price_per_quintal}</TableCell>
                      <TableCell>
                        {item.price_per_quintal > 2500 ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs"><ArrowUpRight className="h-3 w-3" /> Peak</span>
                        ) : item.price_per_quintal < 1500 ? (
                          <span className="flex items-center gap-1 text-amber-600 text-xs"><ArrowDownRight className="h-3 w-3" /> Affordable</span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500 text-xs"><Minus className="h-3 w-3" /> Standard</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {format(new Date(item.updated_at), 'MMM dd, HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2 opacity-20" />
                <p>No rates found for "{searchTerm}".</p>
                <p className="text-xs">Try searching for Potato, Tomato, Mango, or Wheat.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
