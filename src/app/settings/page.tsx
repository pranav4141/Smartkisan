"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { 
  Settings as SettingsIcon, 
  Languages, 
  Moon, 
  Sun, 
  MessageSquare, 
  Bell, 
  ShieldCheck, 
  HelpCircle,
  Save,
  Loader2,
  Monitor
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useFarming } from "@/context/farming-context"
import { Language } from "@/lib/translations"

export default function Settings() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useFarming()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState("")

  // Avoid hydration mismatch by only rendering theme-dependent UI after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveSettings = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: t.saveSettings,
        description: "Your preferences have been updated successfully.",
      })
    }, 1000)
  }

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setFeedback("")
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your valuable feedback! We'll look into it.",
      })
    }, 1500)
  }

  if (!mounted) return null

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" /> {t.settings}
        </h1>
        <p className="text-muted-foreground mt-2">Personalize your SmartKisan experience and provide feedback.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Sidebar (Local) */}
        <div className="md:col-span-1 space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-2">
            <Languages className="h-4 w-4" /> {t.settings}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <Bell className="h-4 w-4" /> Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Privacy & Security
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
            <HelpCircle className="h-4 w-4" /> Support
          </Button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Language & Regional */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" /> {t.language}
              </CardTitle>
              <CardDescription>Select your preferred language for the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">{t.language}</Label>
                <Select value={language} onValueChange={(val: Language) => setLanguage(val)}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi (हिन्दी)</SelectItem>
                    <SelectItem value="punjabi">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                    <SelectItem value="bengali">Bengali (বাংলা)</SelectItem>
                    <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Local Unit System</Label>
                  <p className="text-xs text-muted-foreground">Use Acres/Quintals instead of Hectares/Kilograms</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-500" /> {t.appearance}
              </CardTitle>
              <CardDescription>Customize how SmartKisan looks on your device.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={theme} 
                onValueChange={(val) => setTheme(val)} 
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="light" id="light" className="sr-only" />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <Sun className="mb-3 h-6 w-6" />
                    Light
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="dark" id="dark" className="sr-only" />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <Moon className="mb-3 h-6 w-6" />
                    Dark
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="system" id="system" className="sr-only" />
                  <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                  >
                    <Monitor className="mb-3 h-6 w-6" />
                    System
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Customer Feedback */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> {t.feedback}
              </CardTitle>
              <CardDescription>Tell us how we can improve SmartKisan for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <Textarea 
                  placeholder="Share your experience or report a problem..." 
                  className="min-h-[120px] bg-background"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <Button type="submit" className="w-full" disabled={loading || !feedback.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
            <CardFooter className="text-[11px] text-muted-foreground text-center">
              Your feedback helps us build a better tool for the global farming community.
            </CardFooter>
          </Card>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveSettings} size="lg" className="gap-2 px-8" disabled={loading}>
              <Save className="h-4 w-4" /> {t.saveSettings}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
