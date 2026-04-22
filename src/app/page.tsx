"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Droplets, 
  CloudSun, 
  MapPin, 
  Thermometer, 
  ArrowRight, 
  ScanLine, 
  TrendingUp, 
  Users, 
  Sprout, 
  Loader2,
  DollarSign,
  TrendingDown,
  Sparkles,
  BarChart as BarChartIcon,
  Cloud,
  CloudRain,
  Sun,
  CloudLightning
} from "lucide-react"
import { MOCK_USER } from "@/lib/mock-data"
import Link from "next/link"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useFarming } from "@/context/farming-context"

const chartConfig = {
  profit: {
    label: "Profit",
    color: "hsl(var(--primary))",
  },
  loss: {
    label: "Loss",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

const getWeatherIcon = (code: number) => {
  if (code === 0) return Sun;
  if (code <= 3) return CloudSun;
  if (code <= 48) return Cloud;
  if (code <= 67) return CloudRain;
  if (code <= 82) return CloudRain;
  if (code >= 95) return CloudLightning;
  return Sun;
};

export default function Dashboard() {
  const { farms, devices, finance, selectedCrop, location, weather, t } = useFarming()

  const ConditionIcon = getWeatherIcon(weather.weatherCode);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">{t.namaste}, {MOCK_USER.name}</h1>
          <div className="text-muted-foreground flex items-center gap-1 mt-1 text-sm">
            <MapPin className="h-4 w-4" /> 
            {location.loading ? (
              <span className="flex items-center gap-1">
                Detecting location... <Loader2 className="h-3 w-3 animate-spin" />
              </span>
            ) : (
              location.display
            )}
          </div>
        </div>
        <div className="bg-white/50 backdrop-blur rounded-xl border p-4 flex gap-6">
          <div className="flex flex-col min-w-[80px]">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.temp}</span>
            <span className="text-xl font-bold flex items-center gap-1">
              {weather.loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : (
                <><Thermometer className="h-4 w-4 text-orange-500" /> {weather.temp}°C</>
              )}
            </span>
          </div>
          <div className="flex flex-col border-l pl-6 min-w-[80px]">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.humidity}</span>
            <span className="text-xl font-bold flex items-center gap-1">
              {weather.loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : (
                <><Droplets className="h-4 w-4 text-blue-500" /> {weather.humidity}%</>
              )}
            </span>
          </div>
          <div className="flex flex-col border-l pl-6 min-w-[100px]">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.weather}</span>
            <span className="text-xl font-bold flex items-center gap-1">
              {weather.loading ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : (
                <><ConditionIcon className="h-4 w-4 text-primary" /> {weather.condition}</>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid: Devices and Farm */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Status */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t.irrigationDevices}</CardTitle>
              <CardDescription>Real-time status of your SIM-based controllers</CardDescription>
            </div>
            <Link href="/irrigation" className="text-primary hover:underline text-sm font-medium flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((device) => (
                <div key={device.id} className="border rounded-xl p-4 flex justify-between items-center hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${device.status === 'ON' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.sim_number}</p>
                    </div>
                  </div>
                  <Badge variant={device.status === 'ON' ? 'default' : 'secondary'}>
                    {device.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Farm Overview */}
        <Card>
          <CardHeader>
            <CardTitle>{t.yourFarms}</CardTitle>
            <CardDescription>Total Managed Area: {farms.reduce((acc, f) => acc + parseFloat(f.area), 0).toFixed(1)} Acres</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {farms.map((farm) => (
              <div key={farm.id} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-medium text-sm">{farm.name}</p>
                    <p className="text-xs text-muted-foreground">{farm.area} • {farm.soil_type}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] h-5">ID: {farm.id}</Badge>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-[10px] text-right text-muted-foreground">Moisture Level: 75%</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" /> {t.financialOverview}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.totalProfit}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{finance.total_profit}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <ArrowRight className="h-3 w-3 rotate-[-45deg]" /> {finance.net_growth} from last season
              </p>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{t.totalLoss}</p>
                  <p className="text-2xl font-bold text-destructive mt-1">{finance.total_loss}</p>
                </div>
                <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                  <TrendingDown className="h-5 w-5" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Includes seeds & maintenance</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-1 lg:col-span-2 overflow-hidden border-blue-100 bg-blue-50/30">
            <CardContent className="p-0 flex h-full">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-blue-800 font-bold uppercase tracking-wider">{t.prediction} ({selectedCrop})</p>
                </div>
                <p className="text-sm text-blue-900/80 leading-relaxed font-medium">
                  {finance.prediction}
                </p>
              </div>
              <div className="w-24 bg-blue-100/50 flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-primary" /> Seasonal Profit & Loss Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ChartContainer config={chartConfig} className="h-full w-full">
                <BarChart data={finance.history}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="profit" fill="var(--color-profit)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="loss" fill="var(--color-loss)" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/disease-detection" className="group">
          <Card className="h-full group-hover:border-primary/50 transition-all group-hover:shadow-md">
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <ScanLine className="h-6 w-6" />
              </div>
              <h3 className="font-bold">{t.diseaseDetection}</h3>
              <p className="text-xs text-muted-foreground">Scan crops for instant diagnosis and treatment advice</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/market" className="group">
          <Card className="h-full group-hover:border-primary/50 transition-all group-hover:shadow-md">
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-bold">{t.marketPrices}</h3>
              <p className="text-xs text-muted-foreground">Live mandi prices and trends for your harvested crops</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/community" className="group">
          <Card className="h-full group-hover:border-primary/50 transition-all group-hover:shadow-md">
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold">{t.community}</h3>
              <p className="text-xs text-muted-foreground">Connect with local experts and share your experiences</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/advisory" className="group">
          <Card className="h-full group-hover:border-primary/50 transition-all group-hover:shadow-md">
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-700 group-hover:scale-110 transition-transform">
                <Sprout className="h-6 w-6" />
              </div>
              <h3 className="font-bold">{t.cropAdvisory}</h3>
              <p className="text-xs text-muted-foreground">Personalized schedules for planting and fertilizing</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
