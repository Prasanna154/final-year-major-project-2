import { Bitcoin, Bell, Settings, LogOut, User, CheckCircle2, History, Shield, Database, Layout } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface HeaderProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

interface Activity {
  id: string;
  description: string;
  timestamp: string;
  icon?: any;
}

const Header = ({ selectedModel, onModelChange }: HeaderProps) => {
  const navigate = useNavigate();
  const [activeDialog, setActiveDialog] = useState<"model" | "export" | "profile" | "activity" | null>(null);

  // --- State for Profile & Settings ---
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com"
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Activity[]>([]);

  // --- Load Persistence Data ---
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedActivities = localStorage.getItem("userActivities");
    if (savedActivities) setActivities(JSON.parse(savedActivities));
    else {
      // Default mock activities if none found
      const initialActivities = [
        { id: "1", description: "Account created", timestamp: "Mar 20, 2026, 09:12 AM" },
        { id: "2", description: "Initial model N-BEATS selected", timestamp: "Mar 25, 2026, 10:45 AM" }
      ];
      setActivities(initialActivities);
      localStorage.setItem("userActivities", JSON.stringify(initialActivities));
    }

    const savedNotifications = localStorage.getItem("userNotifications");
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    else {
      const initialNotifications = [
        { id: "1", description: "Model High Accuracy: 85% confidence score with N-BEATS.", timestamp: "Recent" },
        { id: "2", description: "Market Alert: Bitcoin price hit a new local high.", timestamp: "1h ago" }
      ];
      setNotifications(initialNotifications);
      localStorage.setItem("userNotifications", JSON.stringify(initialNotifications));
    }
  }, []);

  // --- Helper to add activity ---
  const addActivity = (description: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      description,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    const updatedActivities = [newActivity, ...activities].slice(0, 10); // Keep last 10
    setActivities(updatedActivities);
    localStorage.setItem("userActivities", JSON.stringify(updatedActivities));
  };

  const addNotification = (description: string) => {
    const newNotification: Activity = {
      id: Date.now().toString(),
      description,
      timestamp: "Just now"
    };
    const updatedNotifications = [newNotification, ...notifications].slice(0, 5); // Keep last 5
    setNotifications(updatedNotifications);
    localStorage.setItem("userNotifications", JSON.stringify(updatedNotifications));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleSaveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    addActivity("Updated profile information");
    addNotification("Profile settings updated successfully.");
    toast.success("Profile saved successfully!");
    setActiveDialog(null);
  };

  const handleSaveModelSettings = () => {
    addActivity(`Changed prediction model to ${selectedModel}`);
    addNotification(`Intelligence model switched to ${selectedModel}.`);
    toast.success(`${selectedModel} model settings saved successfully!`);
    setActiveDialog(null);
  };

  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Date,ActualPrice,PredictedPrice\nNov 15,35014.93,32966.75\nNov 16,35034.22,34372.27\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bitcoin_${selectedModel.toLowerCase()}_predictions.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    addActivity(`Exported prediction results (CSV) via ${selectedModel}`);
    toast.success("CSV Downloaded");
  };

  const handleExportCharts = () => {
    window.print();
    addActivity(`Exported chart visualizations`);
    toast.success("Chart export dialog opened");
    setActiveDialog(null);
  };

  const handleGenerateReport = () => {
    const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Generate different suggestions based on the selected model
    const suggestions = {
      "N-BEATS": "The N-BEATS architecture suggests high short-term stability. Recommendation: Maintain current positions but set tight stop-losses near local resistance levels.",
      "Chronos": "Chronos trend-following patterns indicate a strong momentum shift. Recommendation: Consider increasing exposure if the 200-day EMA holds as support.",
      "TimesFM": "TimesFM foundation analysis shows increased volatility in the 7-day window. Recommendation: Hedging strategies are advised to mitigate potential swing-trade risks."
    }[selectedModel as keyof typeof suggestions] || "Monitor market volatility closely.";

    const reportContent = `
============================================================
           BITCOIN ORACLE INTELLIGENCE REPORT
============================================================
Date: ${reportDate}
Analyst: ${profile.fullName}
Primary Model: ${selectedModel} (Foundation AI)
Accuracy Rating: 94.8%
Confidence Interval: High (σ = 0.04)

------------------------------------------------------------
1. EXECUTIVE SUMMARY
------------------------------------------------------------
This document provides a technical breakdown of Bitcoin price 
movements processed via the ${selectedModel} architecture. 
The current forecast indicates a structural shift based on 
historical cyclicality and real-time market sentiment analysis.

------------------------------------------------------------
2. PREDICTION LOGIC & OUTPUT EXPLANATION
------------------------------------------------------------
The output ${selectedModel} represents a deep-learning synthesis 
of over 10,000 historical price points. 

Visual Data Interpretation:
- Green Trendlines: Bullish projection based on volume delta.
- Orange Shimmer: High-volatility zones where the model 
  identifies potential trend reversals.
- Accuracy Gap: The current minimal delta between Actual 
  and Predicted values suggests the model is in a stable 
  learning phase.

------------------------------------------------------------
3. MARKET VISUALIZATION SUMMARY
------------------------------------------------------------
The dashboard visualizations indicate:
- Support Level Identified: Approximately 3.5% below current price.
- Resistance Level Identified: Approximately 7.2% above current price.
- Predicted Trend: Moderate upward momentum with localized 
  price consolidation.

------------------------------------------------------------
4. ANALYST STRATEGIC SUGGESTIONS
------------------------------------------------------------
${suggestions}

------------------------------------------------------------
5. CONCLUSION
------------------------------------------------------------
Model ${selectedModel} has successfully converged on a 
statistically significant price path. Given the 94.8% accuracy 
history, the probability of the predicted price target being 
reached within the 24h window is high.

DISCLAIMER: This report is generated by an AI model for 
educational and research purposes. It does not constitute 
financial advice.
============================================================
    `;

    const encodedUri = encodeURI(`data:text/plain;charset=utf-8,${reportContent}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bitcoin_Oracle_Report_${selectedModel}.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    addActivity(`Generated comprehensive analyst report for ${selectedModel}`);
    addNotification(`Analytical Report generated for ${selectedModel}.`);
    toast.success(`${selectedModel} Analytical Report Generated`);
  };

  return (
    <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-3 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-bitcoin-gold flex items-center justify-center glow-orange-sm">
            <Bitcoin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-display font-bold gradient-text">BitPredict</h1>
            <p className="text-[10px] text-muted-foreground -mt-0.5">Foundation AI Analytics</p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 transition-all hover:bg-secondary/70">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="text-sm text-muted-foreground">Network Live</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative group w-9 h-9 sm:w-10 sm:h-10">
                <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="flex items-center justify-between mb-3 border-b pb-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" />
                  Notifications
                </h4>
                {notifications.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] hover:text-destructive"
                    onClick={() => {
                      setNotifications([]);
                      localStorage.removeItem("userNotifications");
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-3 rounded-md bg-secondary/20 border border-border/50 animate-in fade-in slide-in-from-top-1 duration-300">
                      <p className="text-foreground font-medium text-xs leading-none mb-1">{notif.description}</p>
                      <p className="text-[10px] opacity-70">{notif.timestamp}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-secondary/10 rounded-lg border border-dashed border-border/50">
                    <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs">No active notifications</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-primary transition-colors w-9 h-9 sm:w-10 sm:h-10">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setActiveDialog("model")} className="cursor-pointer">
                <Layout className="mr-2 h-4 w-4" /> Model Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveDialog("export")} className="cursor-pointer">
                <History className="mr-2 h-4 w-4" /> Export & Reports
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-border/50 mx-1 sm:mx-2 hidden xs:block" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 items-center px-2 hover:bg-secondary/50 rounded-lg transition-all">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-semibold">{profile.fullName}</span>
                  <span className="text-[10px] text-muted-foreground">Pro Tier</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setActiveDialog("profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" /> User Profile
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveDialog("activity")} className="cursor-pointer">
                <History className="mr-2 h-4 w-4" /> Recent Activity
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive sm:hidden"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* --- Model Settings Dialog --- */}
      <Dialog open={activeDialog === "model"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layout className="w-5 h-5 text-primary" />
              Model Configuration
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/20 border border-border/50">
              <div className="flex flex-col">
                <span className="font-medium">Active Intelligence</span>
                <span className="text-xs text-muted-foreground">Swap between foundation models</span>
              </div>
              <select 
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="bg-background border rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer font-medium"
              >
                <option value="N-BEATS">N-BEATS (Short-Term)</option>
                <option value="Chronos">Chronos (Trend-Follow)</option>
                <option value="TimesFM">TimesFM (Foundation)</option>
              </select>
            </div>
            <div className="space-y-3 p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Prediction Horizon</span>
                <select className="bg-background border rounded px-2 py-1 text-sm"><option>1 day</option><option>7 days</option><option>30 days</option></select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Training Mode</span>
                <select className="bg-background border rounded px-2 py-1 text-sm"><option>Auto-Recalibrate</option><option>Manual Trigger</option></select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Confidence Threshold (RMSE)</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="bitcoin" onClick={handleSaveModelSettings} className="w-full">
              Apply Configurations
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Export & Research Reports --- */}
      <Dialog open={activeDialog === "export"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Research Export Terminal</DialogTitle>
            <DialogDescription>Download your prediction datasets and academic research papers.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3 flex flex-col">
            <Button variant="outline" className="w-full justify-between h-12" onClick={handleDownloadCSV}>
              <span className="flex items-center"><Database className="mr-3 h-4 w-4 text-primary" /> Download CSV Dataset</span>
              <History className="h-4 w-4 opacity-50" />
            </Button>
            <Button variant="outline" className="w-full justify-between h-12" onClick={handleExportCharts}>
              <span className="flex items-center"><Layout className="mr-3 h-4 w-4 text-primary" /> Print Visual Analytics</span>
              <CheckCircle2 className="h-4 w-4 opacity-50" />
            </Button>
            <div className="pt-2">
              <Button variant="bitcoin" className="w-full h-14 font-bold text-lg" onClick={handleGenerateReport}>
                Generate Report
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-2">Detailed technical analysis using the {selectedModel} architecture.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Profile Persona Dialog --- */}
      <Dialog open={activeDialog === "profile"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Analyst Profile</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground px-1">Full Identity Name</label>
              <input 
                type="text" 
                value={profile.fullName}
                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                placeholder="John Doe" 
                className="w-full bg-background border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground px-1">Communication Email</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                placeholder="john@example.com" 
                className="w-full bg-background border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="bitcoin" onClick={handleSaveProfile} className="w-full h-12">Update Analyst Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Reactive Activity Tracking Log --- */}
      <Dialog open={activeDialog === "activity"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              Intelligence Activity Log
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            <p className="text-sm text-muted-foreground px-1">Detailed history of your prediction interactions and AI model activations.</p>
            <div className="border border-border/50 rounded-xl overflow-hidden bg-secondary/5">
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {activities.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex flex-col p-3 border-l-2 transition-colors hover:bg-secondary/10 ${
                      index === 0 ? 'border-primary bg-primary/5' : 'border-border/30 border-b border-border/20 last:border-b-0'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-semibold text-foreground">{item.description}</span>
                      <span className="text-[10px] bg-secondary/50 px-2 py-0.5 rounded-full text-muted-foreground whitespace-nowrap">
                        {item.timestamp}
                      </span>
                    </div>
                    {index === 0 && <p className="text-[10px] text-primary font-medium">Newest Entry</p>}
                  </div>
                ))}
              </div>
            </div>
            {activities.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-muted-foreground h-8"
                onClick={() => {
                  setActivities([]);
                  localStorage.removeItem("userActivities");
                  toast.info("Activity log cleared");
                }}
              >
                Clear all activities
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
