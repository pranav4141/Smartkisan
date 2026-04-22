"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sprout, Droplets, FlaskConical, Bug, ArrowRight, CheckCircle2, TrendingUp, MapPin, AlertCircle, Beaker, Zap } from "lucide-react"
import { MOCK_CROP_ADVISORY } from "@/lib/mock-data"
import Image from "next/image"
import { useFarming } from "@/context/farming-context"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

export default function Advisory() {
  const { selectedCrop, setSelectedCrop, location, weather } = useFarming()

  const currentCropAdvisory = MOCK_CROP_ADVISORY.find(c => c.crop_name === selectedCrop) || MOCK_CROP_ADVISORY[0]

  // Location-based suitability check
  const isBihar = location.state.toLowerCase().includes("bihar")
  
  // Simulated soil health logic based on location
  const getSoilHealth = () => {
    if (isBihar) {
      return {
        ph: 6.8,
        nitrogen: 65,
        phosphorus: 45,
        potassium: 80,
        type: "Alluvial",
        richness: "High in Potassium, Moderate Nitrogen",
        advice: "Ideal for heavy feeders. Ensure Nitrogen top-dressing during vegetative phase."
      }
    }
    return {
      ph: 7.2,
      nitrogen: 50,
      phosphorus: 40,
      potassium: 60,
      type: "Loamy/Sandy",
      richness: "Balanced, slightly Alkaline",
      advice: "Maintain organic matter to improve water retention and nutrient availability."
    }
  }

  const soil = getSoilHealth()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
            <Sprout className="h-8 w-8 text-green-700" /> Personalized Crop Advisory
          </h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4" />
            <span>Climate for {location.display}: <strong>{weather.temp}°C, {weather.humidity}% Humidity</strong></span>
          </div>
        </div>
        {isBihar && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 gap-1 px-3 py-1">
            <TrendingUp className="h-3 w-3" /> Regional Priority: North Bihar
          </Badge>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Recommended Crops Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-2 flex items-center gap-2">
            Suggested Crops <TrendingUp className="h-3 w-3 text-green-600" />
          </h3>
          {MOCK_CROP_ADVISORY.map((crop) => {
            const isNative = isBihar && crop.crop_name === "Makhana (Foxnut)"
            return (
              <Card 
                key={crop.id} 
                className={cn(
                  "cursor-pointer transition-all border-2 relative",
                  selectedCrop === crop.crop_name ? "border-primary bg-primary/5 shadow-md" : "hover:border-primary/50"
                )}
                onClick={() => setSelectedCrop(crop.crop_name)}
              >
                {isNative && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    NATIVE
                  </div>
                )}
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden shrink-0 relative">
                    <Image
                      src={`https://picsum.photos/seed/${crop.crop_name}/48/48`}
                      alt={crop.crop_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-sm">{crop.crop_name}</p>
                    <p className="text-[10px] text-muted-foreground">{crop.season}</p>
                  </div>
                  {selectedCrop === crop.crop_name ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Advisory Detail */}
        <div className="lg:col-span-3 space-y-6">
          {isBihar && selectedCrop === "Makhana (Foxnut)" ? (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-4 items-start">
              <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-orange-800 text-sm">Perfect Regional Match!</h4>
                <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                  The soil and stagnant water conditions in <strong>{location.city}</strong> are ideal for Makhana cultivation. 
                  North Bihar contributes to 90% of global production—transitioning to this crop is highly recommended for maximum profit.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex gap-4 items-start">
              <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-800 text-sm">Climate Suitable</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Current weather in {location.city} ({weather.temp}°C) supports standard {selectedCrop} growth cycles.
                </p>
              </div>
            </div>
          )}

          {/* Expected Soil Health Analysis */}
          <Card className="border-primary/20 bg-white shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-primary" /> Expected Soil Health
                  </CardTitle>
                  <CardDescription>Based on regional survey data for {location.city}</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-primary border-primary/30">
                  PH: {soil.ph}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Nutrient Progress Bars */}
                <div className="md:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Nitrogen (N)</span>
                      <span className={cn(soil.nitrogen < 40 ? "text-destructive" : "text-primary")}>
                        {soil.nitrogen < 40 ? "Low" : soil.nitrogen > 70 ? "Rich" : "Moderate"}
                      </span>
                    </div>
                    <Progress value={soil.nitrogen} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Phosphorus (P)</span>
                      <span className="text-primary">Moderate</span>
                    </div>
                    <Progress value={soil.phosphorus} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Potassium (K)</span>
                      <span className="text-green-600 font-bold">Optimal</span>
                    </div>
                    <Progress value={soil.potassium} className="h-2" />
                  </div>
                </div>

                {/* Soil Summary */}
                <div className="space-y-4 bg-muted/30 p-4 rounded-xl border border-dashed">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Zap className="h-4 w-4 text-orange-500" /> Quick Insight
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dominant Type</p>
                    <p className="text-sm font-bold">{soil.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{soil.richness}</p>
                    <p className="text-[11px] leading-relaxed italic text-foreground/70">
                      "{soil.advice}"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 overflow-hidden">
            <div className="h-40 bg-primary/10 relative overflow-hidden">
               <Image
                src={`https://picsum.photos/seed/${selectedCrop}/1200/300`}
                alt={`${selectedCrop} fields`}
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 p-8 flex items-end">
                <div>
                   <h2 className="text-3xl font-bold text-foreground">{selectedCrop} Guide</h2>
                   <p className="text-sm text-muted-foreground mt-1 max-w-xl">{currentCropAdvisory.description}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-bold text-primary">
                  <FlaskConical className="h-5 w-5" /> Fertilizer Regimen
                </div>
                <ul className="space-y-2 text-sm">
                  {currentCropAdvisory.advice?.fertilizer_details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5 shrink-0 text-[10px] h-4">Stage {i+1}</Badge>
                      <span className="text-foreground/80">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 border-l pl-8">
                <div className="flex items-center gap-2 font-bold text-blue-600">
                  <Droplets className="h-5 w-5" /> Irrigation Strategy
                </div>
                <ul className="space-y-2 text-sm">
                   {currentCropAdvisory.advice?.irrigation_details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold text-blue-700 whitespace-nowrap">{i+1} :</span>
                      <span className="text-foreground/80">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 border-l pl-8">
                <div className="flex items-center gap-2 font-bold text-amber-600">
                  <Bug className="h-5 w-5" /> Pest Control
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">
                  For <strong>{selectedCrop}</strong>, monitor for region-specific pests. Use preventative organic sprays or consult local experts.
                </p>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-[11px] text-amber-800">
                  <strong>Alert:</strong> Current humidity of {weather.humidity}% may increase fungal risk this week.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
