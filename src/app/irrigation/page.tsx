
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { 
  Droplets, 
  Clock, 
  Calendar as CalendarIcon, 
  Power, 
  Signal, 
  History, 
  Plus, 
  Smartphone, 
  Trash2, 
  Sparkles, 
  CloudRain, 
  Sun, 
  Thermometer, 
  AlertTriangle,
  Wind,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { MOCK_LOGS, MOCK_FARMS } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useFarming } from "@/context/farming-context"

export default function Irrigation() {
  const { devices, setDevices, schedules, setSchedules, weather, selectedCrop, location } = useFarming()
  const [logs] = useState(MOCK_LOGS)
  const { toast } = useToast()

  // State for Add New Device
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
  const [newDevice, setNewDevice] = useState({ name: "", sim: "", farmId: MOCK_FARMS[0].id })

  // State for Create New Schedule
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false)
  const [newSchedule, setNewSchedule] = useState({ name: "", time: "", duration: "" })

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        const newStatus = d.status === "ON" ? "OFF" : "ON"
        toast({
          title: `Command Sent to ${d.name}`,
          description: `Device is now turning ${newStatus}`,
        })
        return { ...d, status: newStatus }
      }
      return d
    }))
  }

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.sim) {
      toast({ variant: "destructive", title: "Incomplete details", description: "Please fill in both Name and SIM number." })
      return
    }
    const device = {
      id: `d${devices.length + 1}`,
      name: newDevice.name,
      sim_number: newDevice.sim,
      farm_id: newDevice.farmId,
      status: "OFF" as const,
      last_active: "Just now"
    }
    setDevices([...devices, device])
    setNewDevice({ name: "", sim: "", farmId: MOCK_FARMS[0].id })
    setIsAddDeviceOpen(false)
    toast({ title: "Device Added", description: `${device.name} is now connected.` })
  }

  const handleAddSchedule = () => {
    if (!newSchedule.name || !newSchedule.time || !newSchedule.duration) {
      toast({ variant: "destructive", title: "Incomplete details", description: "Please provide all schedule details." })
      return
    }
    const schedule = {
      id: `s${schedules.length + 1}`,
      name: newSchedule.name,
      time: newSchedule.time,
      duration: `${newSchedule.duration} mins`,
      active: true,
      days: ["Daily"]
    }
    setSchedules([...schedules, schedule])
    setNewSchedule({ name: "", time: "", duration: "" })
    setIsAddScheduleOpen(false)
    toast({ title: "Schedule Created", description: `"${schedule.name}" has been enabled.` })
  }

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id))
    toast({ title: "Schedule Deleted" })
  }

  // Weather-based prescriptive advice logic
  const getIrrigationAdvice = () => {
    if (weather.loading) return { 
      title: "Analyzing...", 
      action: "Calculating...", 
      decision: "WAIT",
      tip: "Fetching hyper-local climate data...", 
      icon: Sparkles, 
      color: "text-primary",
      schedule: "Determining best window..."
    };
    
    const isRainy = weather.weatherCode >= 51;
    const isHot = (weather.temp || 0) > 32;
    const isHumid = (weather.humidity || 0) > 80;

    // Base duration depends on crop
    const baseDuration = selectedCrop === "Rice (Paddy)" ? 60 : selectedCrop === "Makhana (Foxnut)" ? 0 : 30;

    if (isRainy) {
      return {
        title: "Rain Detected",
        action: "Skip Watering",
        decision: "NO",
        tip: `Natural precipitation in ${location.city} is currently providing sufficient moisture for your ${selectedCrop}.`,
        betterment: "Skipping prevents root rot and nutrient leaching during active rainfall.",
        schedule: "Next check: Tomorrow morning",
        icon: XCircle,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100"
      };
    }

    if (isHot) {
      const suggestedDuration = baseDuration + 20;
      return {
        title: "Heat Stress Alert",
        action: "Urgent Watering",
        decision: "YES",
        tip: `Temperature is ${weather.temp}°C. Your ${selectedCrop} is losing moisture rapidly through evapotranspiration.`,
        betterment: "Watering before peak sun (10 AM) ensures plants are hydrated for the heat of the day.",
        schedule: `Cycle: Early Morning (5-7 AM) • ${suggestedDuration} mins`,
        icon: CheckCircle2,
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-100"
      };
    }

    if (isHumid) {
      const suggestedDuration = Math.max(15, baseDuration - 10);
      return {
        title: "High Humidity",
        action: "Light Watering",
        decision: "YES",
        tip: `Humidity is at ${weather.humidity}%. Soil stays damp longer, but surface needs refreshing.`,
        betterment: "Reduced volume prevents fungal growth in the humid canopy of your ${selectedCrop}.",
        schedule: `Cycle: Evening (6 PM) • ${suggestedDuration} mins`,
        icon: CheckCircle2,
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100"
      };
    }

    // Default: Optimal Conditions
    return {
      title: "Optimal Growth Climate",
      action: "Standard Watering",
      decision: "YES",
      tip: `Ideal conditions for ${selectedCrop} in ${location.city}.`,
      betterment: "Consistent hydration maintains steady growth and healthy cell structure.",
      schedule: `Cycle: 06:30 AM • ${baseDuration} mins`,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100"
    };
  };

  const advice = getIrrigationAdvice();
  const AdviceIcon = advice.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
            <Droplets className="h-8 w-8 text-primary" /> Irrigation Control
          </h1>
          <p className="text-muted-foreground">Manage your SIM-based controllers and automated schedules.</p>
        </div>
        
        <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add New Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Controller</DialogTitle>
              <DialogDescription>Register your SIM-based IoT pump or sprinkler controller.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="device-name">Device Name</Label>
                <Input 
                  id="device-name" 
                  placeholder="e.g. North Gate Pump" 
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-number">SIM Card Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="sim-number" 
                    placeholder="+91 XXXXX XXXXX" 
                    className="pl-9"
                    value={newDevice.sim}
                    onChange={(e) => setNewDevice({...newDevice, sim: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDevice}>Register Device</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Enhanced AI Weather-Based Advisor */}
      <Card className={`${advice.bg} ${advice.border} border-2 overflow-hidden shadow-lg`}>
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Left: Main Decision */}
            <div className={`p-8 lg:w-1/3 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r ${advice.border} bg-white/40`}>
              <div className={`mb-4 p-4 rounded-full ${advice.bg} border-2 ${advice.border}`}>
                <AdviceIcon className={`h-12 w-12 ${advice.color}`} />
              </div>
              <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest mb-1">Recommended Action</p>
              <h2 className={`text-3xl font-black ${advice.color}`}>{advice.action}</h2>
              <Badge variant="outline" className="mt-3 bg-white/80">{advice.title}</Badge>
            </div>

            {/* Right: Details & Betterment */}
            <div className="p-8 flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> Prescriptive Insight
                  </h3>
                  <p className="text-sm text-foreground/80 leading-relaxed italic">
                    "{advice.tip}"
                  </p>
                  <div className="p-4 bg-white/60 rounded-xl border border-dashed border-primary/20">
                    <h4 className="text-[10px] font-bold uppercase text-primary mb-1">Impact for {selectedCrop}</h4>
                    <p className="text-xs text-muted-foreground leading-snug">{advice.betterment}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" /> Optimal Schedule
                  </h3>
                  <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-md space-y-2">
                    <p className="text-[10px] uppercase font-bold opacity-80">Betterment Target Window</p>
                    <p className="text-xl font-bold">{advice.schedule}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground px-2">
                    <span className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> {weather.temp}°C</span>
                    <span className="flex items-center gap-1"><Droplets className="h-3 w-3" /> {weather.humidity}% Humidity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.map((device) => (
          <Card key={device.id} className="relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${device.status === 'ON' ? 'bg-primary' : 'bg-muted'}`} />
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CardTitle>{device.name}</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-normal">{device.sim_number}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Signal className="h-3 w-3 text-green-500" /> Connected • Active {device.last_active}
                </CardDescription>
              </div>
              <Switch
                checked={device.status === "ON"}
                onCheckedChange={() => toggleDevice(device.id)}
              />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-xl space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Moisture</p>
                <p className="text-xl font-bold">68%</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Water Level</p>
                <p className="text-xl font-bold">Normal</p>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/10 p-4 flex justify-between">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-xs">
                    <Clock className="h-3 w-3" /> Schedule
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Device Schedule: {device.name}</SheetTitle>
                    <SheetDescription>Configure specific runtime windows for this device.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {schedules.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                        <div>
                          <p className="font-bold text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.time} • {s.duration}</p>
                        </div>
                        <Switch checked={s.active} />
                      </div>
                    ))}
                    <Button variant="outline" className="w-full gap-2 mt-4" onClick={() => setIsAddScheduleOpen(true)}>
                      <Plus className="h-4 w-4" /> Custom Rule
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-xs">
                    <History className="h-3 w-3" /> Logs
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Activity Logs: {device.name}</SheetTitle>
                    <SheetDescription>Recent operations and telemetry for this controller.</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {logs.filter(l => l.device_id === device.id).map(log => (
                      <div key={log.id} className="border-l-2 border-primary pl-4 py-1">
                        <p className="text-sm font-bold">{log.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(log.timestamp), 'MMM dd, HH:mm')} • via {log.source}
                        </p>
                      </div>
                    ))}
                    {logs.filter(l => l.device_id === device.id).length === 0 && (
                      <p className="text-center text-muted-foreground text-sm py-8">No recent activity logs.</p>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-headline flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" /> Global Schedules
          </h2>
          <Dialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-3 w-3" /> Create New Schedule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Watering Schedule</DialogTitle>
                <DialogDescription>Set a recurring time for your automated pumps.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="sched-name">Schedule Name</Label>
                  <Input 
                    id="sched-name" 
                    placeholder="e.g. Afternoon Refresh" 
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sched-time">Start Time</Label>
                    <Input 
                      id="sched-time" 
                      type="time" 
                      value={newSchedule.time}
                      onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sched-duration">Duration (Mins)</Label>
                    <Input 
                      id="sched-duration" 
                      type="number" 
                      placeholder="45"
                      value={newSchedule.duration}
                      onChange={(e) => setNewSchedule({...newSchedule, duration: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddSchedule}>Save Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${schedule.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{schedule.name}</p>
                    <p className="text-xs text-muted-foreground">{schedule.time} • {schedule.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={schedule.active ? "default" : "secondary"}>{schedule.active ? "Active" : "Paused"}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteSchedule(schedule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card 
            className="border-dashed flex items-center justify-center p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsAddScheduleOpen(true)}
          >
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create new schedule
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
