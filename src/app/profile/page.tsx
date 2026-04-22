"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Landmark, 
  Sprout, 
  Layers, 
  Droplets, 
  Settings, 
  Edit2,
  ExternalLink,
  Loader2,
  Save,
  Plus
} from "lucide-react"
import { MOCK_USER } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useFarming } from "@/context/farming-context"

export default function Profile() {
  const { farms, setFarms, devices, location } = useFarming()
  const { toast } = useToast()
  const [userData, setUserData] = useState(MOCK_USER)
  const [editData, setEditData] = useState({ ...MOCK_USER })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  const [isAddFarmDialogOpen, setIsAddFarmDialogOpen] = useState(false)
  const [newFarm, setNewFarm] = useState({ name: "", area: "", soil_type: "Loamy" })

  const handleSaveProfile = () => {
    setUserData(editData)
    setIsEditDialogOpen(false)
    toast({
      title: "Profile Updated",
      description: "Your personal information has been successfully saved.",
    })
  }

  const handleAddFarm = () => {
    if (!newFarm.name || !newFarm.area) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both a name and area for the new farm plot.",
      })
      return
    }

    const farmId = `f${farms.length + 1}`
    const farmToAdd = {
      id: farmId,
      name: newFarm.name,
      area: newFarm.area.includes("Acres") ? newFarm.area : `${newFarm.area} Acres`,
      soil_type: newFarm.soil_type,
      location: location.display
    }

    setFarms([...farms, farmToAdd])
    setNewFarm({ name: "", area: "", soil_type: "Loamy" })
    setIsAddFarmDialogOpen(false)
    toast({
      title: "Farm Added",
      description: `${newFarm.name} has been successfully registered to your account.`,
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex gap-6 items-center">
          <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
            <AvatarImage src={`https://picsum.photos/seed/${userData.name}/200/200`} />
            <AvatarFallback className="text-2xl bg-primary text-white">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-headline">{userData.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Badge variant="secondary" className="font-mono">{userData.id}</Badge>
              <span className="text-sm flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 
                {location.loading ? (
                  <span className="flex items-center gap-1">
                    Detecting... <Loader2 className="h-3 w-3 animate-spin" />
                  </span>
                ) : (
                  location.display
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit2 className="h-4 w-4" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your farmer profile here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">Phone</Label>
                  <Input
                    id="phone"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="h-4 w-4" /> Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg"><Phone className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{userData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg"><Mail className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg"><Calendar className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-medium">{userData.joined_date}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-muted rounded-lg"><Landmark className="h-4 w-4 text-orange-600" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Kisan Bank Account</p>
                  <p className="font-medium">{userData.kisan_credit_card}</p>
                </div>
              </div>
              <Button variant="link" className="p-0 h-auto text-xs gap-1">
                View connected bank accounts <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center space-y-2">
                <Layers className="h-8 w-8 text-primary mx-auto" />
                <p className="text-sm text-muted-foreground font-medium">Total Land</p>
                <p className="text-2xl font-bold">{farms.reduce((acc, f) => acc + parseFloat(f.area), 0).toFixed(1)} Acres</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-6 text-center space-y-2">
                <Droplets className="h-8 w-8 text-blue-600 mx-auto" />
                <p className="text-sm text-muted-foreground font-medium">IoT Devices</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-100">
              <CardContent className="p-6 text-center space-y-2">
                <Sprout className="h-8 w-8 text-green-700 mx-auto" />
                <p className="text-sm text-muted-foreground font-medium">Active Plots</p>
                <p className="text-2xl font-bold">{farms.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Managed Farms</CardTitle>
                <CardDescription>Detailed list of your registered agricultural plots</CardDescription>
              </div>
              <Dialog open={isAddFarmDialogOpen} onOpenChange={setIsAddFarmDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Add Farm
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Register New Farm Plot</DialogTitle>
                    <DialogDescription>
                      Enter the details of your new agricultural plot.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="farm-name" className="text-right">Name</Label>
                      <Input
                        id="farm-name"
                        placeholder="e.g., South Orchard"
                        value={newFarm.name}
                        onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="farm-area" className="text-right">Area</Label>
                      <Input
                        id="farm-area"
                        placeholder="e.g., 1.5"
                        type="number"
                        value={newFarm.area}
                        onChange={(e) => setNewFarm({ ...newFarm, area: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="soil-type" className="text-right">Soil Type</Label>
                      <Select 
                        value={newFarm.soil_type} 
                        onValueChange={(value) => setNewFarm({ ...newFarm, soil_type: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Loamy">Loamy</SelectItem>
                          <SelectItem value="Clay">Clay</SelectItem>
                          <SelectItem value="Sandy">Sandy</SelectItem>
                          <SelectItem value="Silt">Silt</SelectItem>
                          <SelectItem value="Peaty">Peaty</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddFarm} className="gap-2">
                      <Plus className="h-4 w-4" /> Add Plot
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {farms.map((farm) => (
                <div key={farm.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center text-primary">
                      <Layers className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold">{farm.name}</h4>
                      <p className="text-xs text-muted-foreground">{farm.area} • {farm.soil_type} Soil</p>
                    </div>
                  </div>
                  <Badge variant="outline">Plot ID: {farm.id}</Badge>
                </div>
              ))}
              
              <Button 
                variant="ghost" 
                className="w-full border-dashed border-2 py-8 rounded-xl text-muted-foreground hover:text-primary hover:border-primary"
                onClick={() => setIsAddFarmDialogOpen(true)}
              >
                + Add New Farm Plot
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Primary Crops</CardTitle>
              <CardDescription>Main crops you cultivate across your farms</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {userData.primary_crops.map((crop) => (
                <Badge key={crop} className="px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20" variant="secondary">
                  {crop}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
