"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, Monitor, Check } from "lucide-react"

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("system")
  const [fontSize, setFontSize] = useState("medium")
  const [reducedMotion, setReducedMotion] = useState(false)
  const [reducedTransparency, setReducedTransparency] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Customize how the app looks and feels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="justify-start"
              onClick={() => setTheme("light")}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
              {theme === "light" && <Check className="ml-auto h-4 w-4" />}
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="justify-start"
              onClick={() => setTheme("dark")}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
              {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              className="justify-start"
              onClick={() => setTheme("system")}
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
              {theme === "system" && <Check className="ml-auto h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size</Label>
          <Select value={fontSize} onValueChange={setFontSize}>
            <SelectTrigger id="fontSize">
              <SelectValue placeholder="Select font size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="x-large">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">Reduce the amount of animations in the interface</p>
            </div>
            <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={setReducedMotion} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-transparency">Reduced Transparency</Label>
              <p className="text-sm text-muted-foreground">Reduce the transparency effects in the interface</p>
            </div>
            <Switch id="reduced-transparency" checked={reducedTransparency} onCheckedChange={setReducedTransparency} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
