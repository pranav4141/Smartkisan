"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScanLine, Upload, Loader2, CheckCircle2, AlertCircle, Info, ShieldCheck, ListChecks, HelpCircle } from "lucide-react"
import { detectPlantDisease, type DetectPlantDiseaseOutput } from "@/ai/flows/detect-plant-disease"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

export default function DiseaseDetection() {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DetectPlantDiseaseOutput | null>(null)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const runAnalysis = async () => {
    if (!image) return
    setLoading(true)
    try {
      const output = await detectPlantDisease({ photoDataUri: image })
      setResult(output)
      toast({
        title: "Analysis Complete",
        description: `Detection: ${output.detectedDisease}`,
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not process image. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
          <ScanLine className="h-8 w-8 text-primary" /> AI Plant Pathologist
        </h1>
        <p className="text-muted-foreground mt-2">Upload a photo for a deep-dive diagnosis including causes, prevention, and step-by-step fixes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Crop Image</CardTitle>
            <CardDescription>Upload a clear photo of the affected area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full aspect-video bg-muted rounded-2xl overflow-hidden border-2 border-dashed border-primary/20 flex items-center justify-center group">
              {image ? (
                <Image
                  src={image}
                  alt="Captured plant"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="text-center p-6">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                </div>
              )}
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
            {image && (
              <Button
                className="w-full h-12 text-lg"
                onClick={runAnalysis}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Running Diagnosis...
                  </>
                ) : (
                  "Analyze Health"
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="lg:sticky lg:top-8">
          <CardHeader>
            <CardTitle>Diagnosis & Treatment</CardTitle>
            <CardDescription>Structured assessment of crop health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 opacity-50 border rounded-xl border-dashed">
                <Info className="h-12 w-12" />
                <p>Upload and analyze an image to see results</p>
              </div>
            )}

            {loading && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-12 w-full bg-muted animate-pulse rounded-lg" />
                  <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                  <div className="h-20 w-full bg-muted animate-pulse rounded-lg" />
                </div>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
                {/* Result Header */}
                <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      {result.detectedDisease === 'Healthy' ? (
                        <CheckCircle2 className="h-8 w-8 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="h-8 w-8 text-amber-600 shrink-0" />
                      )}
                      <div>
                        <h3 className="font-bold text-2xl text-foreground">
                          {result.detectedDisease}
                        </h3>
                        <p className="text-sm text-muted-foreground">AI Pathology Assessment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{Math.round(result.confidenceScore * 100)}%</div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Surety</div>
                    </div>
                  </div>
                  <Progress value={result.confidenceScore * 100} className="h-1.5" />
                </div>

                {/* Causes */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500" /> Why this happened?
                  </h4>
                  <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl text-sm leading-relaxed text-blue-900">
                    {result.causes}
                  </div>
                </div>

                {/* Treatment Steps */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-green-600" /> Suitable Fixes
                  </h4>
                  <div className="space-y-2">
                    {result.treatmentSteps.map((step, i) => (
                      <div key={i} className="flex gap-3 items-start p-3 bg-muted/30 rounded-lg text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {i + 1}
                        </span>
                        <p className="text-foreground/90">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prevention */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-orange-500" /> Prevention Tips
                  </h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {result.preventionTips.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1 w-1 rounded-full bg-orange-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-[10px] text-muted-foreground border-t pt-4">
            * AI assessments are advisory. Consult a local expert or the KVK for critical agricultural decisions.
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
