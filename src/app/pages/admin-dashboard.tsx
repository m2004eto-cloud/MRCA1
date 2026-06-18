import { useState, useRef } from "react";
import { Logo } from "../components/logo";
import { FinanceModule } from "../components/finance-module";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Textarea } from "../components/ui/textarea";
import { fleetVehicles, bookings } from "../data/mock-data";
import type { FleetVehicle, Vehicle } from "../data/mock-data";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Car,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Settings,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  Loader2,
  Search,
  Download,
  RefreshCw,
  Plus,
  Upload,
  ImageIcon,
  X,
  Eye,
  Pencil,
  Trash2,
  Archive,
  TrendingUp
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useLanguage } from "../contexts/language";
import { useAuth } from "../contexts/auth";
import { LogOut, User as UserIcon } from "lucide-react";

export function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    toast.success(t("Logged out successfully"));
  };
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [documentReviewOpen, setDocumentReviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const [fleet, setFleet] = useState<FleetVehicle[]>(fleetVehicles);
  const [newVehicleOpen, setNewVehicleOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FleetVehicle | null>(null);
  const [salikEditOpen, setSalikEditOpen] = useState(false);
  const [editingSalikVehicle, setEditingSalikVehicle] = useState<FleetVehicle | null>(null);
  const isEditMode = editingVehicleId !== null;

  const vehicleImageInputRef = useRef<HTMLInputElement>(null);

  const emptyVehicleForm = {
    image: "",
    model: "",
    category: "Sedan" as Vehicle["category"],
    licensePlate: "",
    location: "",
    status: "Active" as FleetVehicle["status"],
    seats: "5",
    transmission: "Automatic",
    fuel: "Gas" as Vehicle["fuel"],
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    loyaltyPoints: "",
    features: "",
  };
  const [vehicleForm, setVehicleForm] = useState(emptyVehicleForm);

  const updateForm = (field: keyof typeof emptyVehicleForm, value: string) => {
    setVehicleForm(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(t('Please select a valid image file'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('Image must be smaller than 5MB'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateForm('image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const isFormValid =
    vehicleForm.model.trim() !== "" &&
    vehicleForm.licensePlate.trim() !== "" &&
    vehicleForm.location.trim() !== "" &&
    vehicleForm.dailyRate.trim() !== "";

  const handleAddVehicle = async () => {
    if (!isFormValid) {
      toast.error(t('Please fill in all required fields'));
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isEditMode) {
      setFleet(prev => prev.map(v =>
        v.id === editingVehicleId
          ? {
              ...v,
              model: vehicleForm.model.trim(),
              licensePlate: vehicleForm.licensePlate.trim(),
              location: vehicleForm.location.trim(),
              status: vehicleForm.status,
            }
          : v
      ));
      setIsSaving(false);
      setNewVehicleOpen(false);
      setEditingVehicleId(null);
      setVehicleForm(emptyVehicleForm);
      toast.success(t('Vehicle updated successfully'), {
        description: `${vehicleForm.model.trim()} • ${vehicleForm.licensePlate.trim()}`,
      });
      return;
    }

    const newVehicle: FleetVehicle = {
      id: `F${String(fleet.length + 1).padStart(3, '0')}`,
      model: vehicleForm.model.trim(),
      licensePlate: vehicleForm.licensePlate.trim(),
      location: vehicleForm.location.trim(),
      status: vehicleForm.status,
      salikStatus: 'Synced',
      fines: 0,
      lat: 25.2048,
      lng: 55.2708,
    };

    setFleet(prev => [...prev, newVehicle]);
    setIsSaving(false);
    setNewVehicleOpen(false);
    setVehicleForm(emptyVehicleForm);
    toast.success(t('Vehicle added successfully'), {
      description: `${newVehicle.model} • ${newVehicle.licensePlate}`,
    });
  };

  const handleEditVehicle = (vehicle: FleetVehicle) => {
    setEditingVehicleId(vehicle.id);
    setVehicleForm({
      ...emptyVehicleForm,
      model: vehicle.model,
      licensePlate: vehicle.licensePlate,
      location: vehicle.location,
      status: vehicle.status,
    });
    // Defer opening so the dropdown menu can finish closing (avoids Radix focus conflict)
    setTimeout(() => setNewVehicleOpen(true), 0);
  };

  const handleNewVehicleOpenChange = (open: boolean) => {
    setNewVehicleOpen(open);
    if (!open) {
      setEditingVehicleId(null);
      setVehicleForm(emptyVehicleForm);
    }
  };

  const handleArchiveVehicle = (vehicle: FleetVehicle) => {
    setFleet(prev => prev.map(v =>
      v.id === vehicle.id ? { ...v, status: 'Maintenance' } : v
    ));
    toast.success(t('Vehicle archived'), {
      description: `${vehicle.model} • ${vehicle.licensePlate}`,
    });
  };

  const handleDeleteVehicle = () => {
    if (!deleteTarget) return;
    setFleet(prev => prev.filter(v => v.id !== deleteTarget.id));
    toast.success(t('Vehicle deleted'), {
      description: `${deleteTarget.model} • ${deleteTarget.licensePlate}`,
    });
    setDeleteTarget(null);
  };

  const stats = {
    totalFleet: fleet.length,
    activeFleet: fleet.filter(v => v.status === 'Active').length,
    pendingBookings: bookings.filter(b => b.status === 'Pending').length,
    todayCheckins: 3,
    salikAlerts: fleet.filter(v => v.salikStatus !== 'Synced').length,
    totalFines: fleet.reduce((acc, v) => acc + v.fines, 0),
  };

  const handleViewVehicle = (vehicle: any) => {
    setSelectedItem(vehicle);
    setVehicleDialogOpen(true);
  };

  const handleManageBooking = (booking: any) => {
    setSelectedItem(booking);
    setBookingDialogOpen(true);
  };

  const handleApproveBooking = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setBookingDialogOpen(false);
    toast.success(t('Booking approved successfully'));
  };

  const handleRejectBooking = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setBookingDialogOpen(false);
    toast.error(t('Booking rejected'));
  };

  const handleSyncSalik = async (vehicle?: any) => {
    if (vehicle) {
      setSelectedItem(vehicle);
      setSyncDialogOpen(true);
    }
  };

  const handleConfirmSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSyncing(false);
    setSyncDialogOpen(false);
    toast.success(t('Salik data synced successfully'), {
      description: t('Latest toll charges have been updated'),
    });
  };

  const handleReviewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setDocumentReviewOpen(true);
  };

  const handleApproveDocument = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setDocumentReviewOpen(false);
    toast.success(t('Document approved'));
  };

  const handleRejectDocument = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setDocumentReviewOpen(false);
    toast.error(t('Document rejected'));
  };

  const handleEditSalik = (vehicle: FleetVehicle) => {
    setEditingSalikVehicle(vehicle);
    setSalikEditOpen(true);
  };

  const handleSaveSalik = async () => {
    if (!editingSalikVehicle) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setFleet(prev => prev.map(v =>
      v.id === editingSalikVehicle.id
        ? { ...v, salikStatus: 'Synced' }
        : v
    ));
    setIsLoading(false);
    setSalikEditOpen(false);
    toast.success(t('Salik data updated successfully'));
  };

  const handleSyncNow = async (vehicle: FleetVehicle) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFleet(prev => prev.map(v =>
      v.id === vehicle.id
        ? { ...v, salikStatus: 'Synced' }
        : v
    ));
    setIsLoading(false);
    toast.success(t('Salik data synced successfully'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 backdrop-blur-xl bg-white/90 border-r border-white/20 shadow-xl z-50">
        <div className="p-6 border-b border-white/20">
          <Logo />
        </div>
        
        <nav className="p-4">
          <div className="space-y-1">
            <Button
              variant={activeTab === "dashboard" ? "secondary" : "ghost"}
              className={`w-full justify-start ${activeTab === "dashboard" ? 'bg-gradient-to-r from-[#EF4444]/10 to-[#1E40AF]/10' : ''}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              {t('Dashboard')}
            </Button>

            <Button
              variant={activeTab === "fleet" ? "secondary" : "ghost"}
              className={`w-full justify-start ${activeTab === "fleet" ? 'bg-gradient-to-r from-[#EF4444]/10 to-[#1E40AF]/10' : ''}`}
              onClick={() => setActiveTab("fleet")}
            >
              <Car className="w-4 h-4 mr-3" />
              {t('Fleet')}
            </Button>

            <Button
              variant={activeTab === "bookings" ? "secondary" : "ghost"}
              className={`w-full justify-start ${activeTab === "bookings" ? 'bg-gradient-to-r from-[#EF4444]/10 to-[#1E40AF]/10' : ''}`}
              onClick={() => setActiveTab("bookings")}
            >
              <Calendar className="w-4 h-4 mr-3" />
              {t('Bookings')}
            </Button>

            <Button
              variant={activeTab === "salik" ? "secondary" : "ghost"}
              className={`w-full justify-start ${activeTab === "salik" ? 'bg-gradient-to-r from-[#EF4444]/10 to-[#1E40AF]/10' : ''}`}
              onClick={() => setActiveTab("salik")}
            >
              <DollarSign className="w-4 h-4 mr-3" />
              {t('Salik & Fines')}
            </Button>

            <Button
              variant={activeTab === "customers" ? "secondary" : "ghost"}
              className={`w-full justify-start ${activeTab === "customers" ? 'bg-gradient-to-r from-[#EF4444]/10 to-[#1E40AF]/10' : ''}`}
              onClick={() => setActiveTab("customers")}
            >
              <Users className="w-4 h-4 mr-3" />
              {t('Customers')}
            </Button>

            <Button
              variant={activeTab === "finance" ? "secondary" : "ghost"}
              className={`w-full justify-start ${activeTab === "finance" ? 'bg-gradient-to-r from-[#EF4444]/10 to-[#1E40AF]/10' : ''}`}
              onClick={() => setActiveTab("finance")}
            >
              <TrendingUp className="w-4 h-4 mr-3" />
              {t('Finance')}
            </Button>

            <Button
              variant={activeTab === "reports" ? "secondary" : "ghost"}
              className={`w-full justify-start ${activeTab === "reports" ? 'bg-gradient-to-r from-[#EF4444]/10 to-[#1E40AF]/10' : ''}`}
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="w-4 h-4 mr-3" />
              {t('Reports')}
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Settings className="w-4 h-4 mr-3" />
              {t('Settings')}
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/20 space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                {t('Back to Site')}
              </Link>
            </Button>

            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('Logout')}
            </Button>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="px-3 py-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="text-xs">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-gradient-to-r from-[#EF4444]/20 to-[#1E40AF]/20 text-[#1E40AF]">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="mb-2 bg-gradient-to-r from-[#EF4444] to-[#1E40AF] bg-clip-text text-transparent">
            {t('MAXIMUM FLEET MANAGER')}
          </h1>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t('Total Active Fleet')}</span>
                  <Car className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div className="text-3xl">{stats.activeFleet}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('of')} {stats.totalFleet} {t('total')}</p>
              </Card>

              <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t('Pending Bookings')}</span>
                  <Calendar className="w-5 h-5 text-[#1E40AF]" />
                </div>
                <div className="text-3xl">{stats.pendingBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('awaiting approval')}</p>
              </Card>

              <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t("Today's Check-ins")}</span>
                  <Clock className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div className="text-3xl">{stats.todayCheckins}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('vehicles scheduled')}</p>
              </Card>

              <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t('Salik & Fines Alerts')}</span>
                  <AlertCircle className="w-5 h-5 text-[#1E40AF]" />
                </div>
                <div className="text-3xl text-[#EF4444]">{stats.salikAlerts}</div>
                <p className="text-xs text-muted-foreground mt-1">{t('Real-time syncing')}</p>
              </Card>
            </div>

            {/* Fleet Map */}
            <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#EF4444]" />
                {t('Fleet GPS Tracking - UAE')}
              </h3>
              <div className="h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center border border-slate-300/50 relative overflow-hidden">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#1E40AF] rounded-full animate-pulse"></div>
                  <div className="absolute top-2/3 left-2/3 w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></div>
                  <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#1E40AF] rounded-full animate-pulse"></div>
                </div>
                
                <div className="text-center text-muted-foreground z-10">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-[#EF4444]" />
                  <p className="mb-1">{t('Interactive GPS Map')}</p>
                  <p className="text-sm">{t('Real-time fleet tracking across Dubai, Abu Dhabi, Sharjah')}</p>
                  <div className="mt-4 flex items-center gap-4 justify-center text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {t('Active')}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      {t('Booked')}
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {t('Maintenance')}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
                <h3 className="mb-4">{t('Recent Bookings')}</h3>
                <div className="space-y-3">
                  {bookings.slice(0, 4).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-sm text-muted-foreground">{booking.vehicle}</p>
                      </div>
                      <Badge variant={
                        booking.status === 'Active' ? 'default' :
                        booking.status === 'Pending' ? 'secondary' :
                        'outline'
                      }>
                        {t(booking.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
                <h3 className="mb-4">{t('Document Validation Queue')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                    <div>
                      <p className="font-medium">Ahmed Al Maktoum</p>
                      <p className="text-sm text-muted-foreground">{t('License & Emirates ID')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewDocument({ name: 'Ahmed Al Maktoum', type: 'License & Emirates ID' })}
                      >
                        {t('Review')}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">{t('International License')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewDocument({ name: 'Sarah Johnson', type: 'International License' })}
                      >
                        {t('Review')}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "fleet" && (
          <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3>{t('Fleet Management')}</h3>
              <Button
                className="bg-gradient-to-r from-[#EF4444] to-[#1E40AF] text-white"
                onClick={() => {
                  setVehicleForm(emptyVehicleForm);
                  setNewVehicleOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('New Vehicle')}
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Model')}</TableHead>
                  <TableHead>{t('License Plate')}</TableHead>
                  <TableHead>{t('Location')}</TableHead>
                  <TableHead>{t('Status')}</TableHead>
                  <TableHead>{t('Salik')}</TableHead>
                  <TableHead>{t('Fines')}</TableHead>
                  <TableHead>{t('Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fleet.map(vehicle => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell className="font-mono text-sm">{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.location}</TableCell>
                    <TableCell>
                      <Badge variant={
                        vehicle.status === 'Active' ? 'default' :
                        vehicle.status === 'Booked' ? 'secondary' :
                        'outline'
                      }>
                        {t(vehicle.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {vehicle.salikStatus === 'Synced' ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{t('Synced')}</span>
                          </>
                        ) : vehicle.salikStatus === 'Pending' ? (
                          <>
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="text-sm">{t('Pending')}</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm">{t('Error')}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicle.fines > 0 ? (
                        <span className="text-[#EF4444]">AED {vehicle.fines}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleViewVehicle(vehicle)}
                          aria-label={t('View')}
                          title={t('View')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              aria-label={t('Edit')}
                              title={t('Edit')}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              {t('Edit Details')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleArchiveVehicle(vehicle)}
                              disabled={vehicle.status === 'Maintenance'}
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              {t('Archive')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-[#EF4444] focus:text-[#EF4444]"
                              onClick={() => setTimeout(() => setDeleteTarget(vehicle), 0)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t('Delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {activeTab === "bookings" && (
          <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
            <h3 className="mb-4">{t('Booking Management')}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('ID')}</TableHead>
                  <TableHead>{t('Customer')}</TableHead>
                  <TableHead>{t('Vehicle')}</TableHead>
                  <TableHead>{t('Pick-up')}</TableHead>
                  <TableHead>{t('Return')}</TableHead>
                  <TableHead>{t('Amount')}</TableHead>
                  <TableHead>{t('Status')}</TableHead>
                  <TableHead>{t('Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map(booking => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.vehicle}</TableCell>
                    <TableCell>{booking.pickupDate}</TableCell>
                    <TableCell>{booking.returnDate}</TableCell>
                    <TableCell>AED {booking.totalAmount}</TableCell>
                    <TableCell>
                      <Badge variant={
                        booking.status === 'Active' ? 'default' :
                        booking.status === 'Pending' ? 'secondary' :
                        'outline'
                      }>
                        {t(booking.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleManageBooking(booking)}
                      >
                        {t('Manage')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {activeTab === "salik" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t('Total Fines')}</span>
                  <DollarSign className="w-5 h-5 text-[#EF4444]" />
                </div>
                <div className="text-3xl">AED {stats.totalFines}</div>
              </Card>

              <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t('Pending Syncs')}</span>
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-3xl">{fleet.filter(v => v.salikStatus === 'Pending').length}</div>
              </Card>

              <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t('Sync Errors')}</span>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-3xl">{fleet.filter(v => v.salikStatus === 'Error').length}</div>
              </Card>
            </div>

            <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
              <h3 className="mb-4">{t('Salik & Fines Overview')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('Real-time syncing from RTA Account')}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('Vehicle')}</TableHead>
                    <TableHead>{t('License Plate')}</TableHead>
                    <TableHead>{t('Salik Status')}</TableHead>
                    <TableHead>{t('Outstanding Fines')}</TableHead>
                    <TableHead>{t('Last Sync')}</TableHead>
                    <TableHead>{t('Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fleet.filter(v => v.fines > 0 || v.salikStatus !== 'Synced').map(vehicle => (
                    <TableRow key={vehicle.id}>
                      <TableCell>{vehicle.model}</TableCell>
                      <TableCell className="font-mono text-sm">{vehicle.licensePlate}</TableCell>
                      <TableCell>
                        <span className={vehicle.fines > 0 ? "text-[#EF4444]" : "text-muted-foreground"}>
                          AED {vehicle.fines > 0 ? vehicle.fines : "000"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {vehicle.fines > 0 ? (
                          <span className="text-[#EF4444]">AED {vehicle.fines}</span>
                        ) : (
                          <span className="text-muted-foreground">AED 000</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t('2 hours ago')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            title={t('Edit')}
                            onClick={() => handleEditSalik(vehicle)}
                            disabled={isLoading}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title={t('Sync Now')}
                            onClick={() => handleSyncNow(vehicle)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {activeTab === "customers" && (
          <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
            <h3 className="mb-4">{t('Customer Management')}</h3>
            <p className="text-muted-foreground">{t('Customer database and management tools will be displayed here.')}</p>
          </Card>
        )}

        {activeTab === "finance" && (
          <FinanceModule />
        )}

        {activeTab === "reports" && (
          <Card className="backdrop-blur-xl bg-white/90 border-white/20 p-6">
            <h3 className="mb-4">{t('Reports & Analytics')}</h3>
            <p className="text-muted-foreground">{t('Revenue reports, booking analytics, and performance metrics will be displayed here.')}</p>
          </Card>
        )}
      </main>

      {/* Add / Edit Vehicle Dialog */}
      <Dialog open={newVehicleOpen} onOpenChange={handleNewVehicleOpenChange}>
        <DialogContent className="backdrop-blur-xl bg-white/95 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? t('Edit Vehicle') : t('Add New Vehicle')}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? t('Update the vehicle details below.')
                : t('Enter the vehicle details to add it to the fleet.')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">{t('Basic Information')}</h4>

              {/* Vehicle Image Upload */}
              <div className="space-y-2 mb-4">
                <Label>{t('Vehicle Image')}</Label>
                <input
                  ref={vehicleImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleVehicleImageChange}
                />
                {vehicleForm.image ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border group">
                    <img
                      src={vehicleForm.image || "/placeholder.svg"}
                      alt={t('Vehicle preview')}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => vehicleImageInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        {t('Change')}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => updateForm('image', '')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        {t('Remove')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => vehicleImageInputRef.current?.click()}
                    className="w-full h-44 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors bg-muted/30"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 font-medium">
                      <Upload className="w-4 h-4" />
                      {t('Upload Image')}
                    </div>
                    <span className="text-xs">{t('PNG or JPG, up to 5MB')}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">{t('Model')} *</Label>
                  <Input
                    id="model"
                    placeholder="Tesla Model Y"
                    value={vehicleForm.model}
                    onChange={(e) => updateForm('model', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">{t('Category')}</Label>
                  <Select value={vehicleForm.category} onValueChange={(v) => updateForm('category', v)}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedan">{t('Sedan')}</SelectItem>
                      <SelectItem value="SUV">{t('SUV')}</SelectItem>
                      <SelectItem value="Luxury">{t('Luxury')}</SelectItem>
                      <SelectItem value="Electric">{t('Electric')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">{t('License Plate')} *</Label>
                  <Input
                    id="licensePlate"
                    placeholder="DXB-A-12345"
                    value={vehicleForm.licensePlate}
                    onChange={(e) => updateForm('licensePlate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t('Location')} *</Label>
                  <Input
                    id="location"
                    placeholder="Dubai Marina"
                    value={vehicleForm.location}
                    onChange={(e) => updateForm('location', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{t('Status')}</Label>
                  <Select value={vehicleForm.status} onValueChange={(v) => updateForm('status', v)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">{t('Active')}</SelectItem>
                      <SelectItem value="Booked">{t('Booked')}</SelectItem>
                      <SelectItem value="Maintenance">{t('Maintenance')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">{t('Specifications')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats">{t('Seats')}</Label>
                  <Select value={vehicleForm.seats} onValueChange={(v) => updateForm('seats', v)}>
                    <SelectTrigger id="seats">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['2', '4', '5', '7', '8'].map(s => (
                        <SelectItem key={s} value={s}>{s} {t('Seats')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transmission">{t('Transmission')}</Label>
                  <Select value={vehicleForm.transmission} onValueChange={(v) => updateForm('transmission', v)}>
                    <SelectTrigger id="transmission">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Automatic">{t('Automatic')}</SelectItem>
                      <SelectItem value="Manual">{t('Manual')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuel">{t('Fuel Type')}</Label>
                  <Select value={vehicleForm.fuel} onValueChange={(v) => updateForm('fuel', v)}>
                    <SelectTrigger id="fuel">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gas">{t('Gas')}</SelectItem>
                      <SelectItem value="Hybrid">{t('Hybrid')}</SelectItem>
                      <SelectItem value="EV">{t('EV')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="features">{t('Features')}</Label>
                <Textarea
                  id="features"
                  placeholder={t('Sunroof, GPS, Autopilot, 4x4')}
                  value={vehicleForm.features}
                  onChange={(e) => updateForm('features', e.target.value)}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">{t('Separate features with commas')}</p>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">{t('Pricing & Rewards')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">{t('Daily Rate (AED)')} *</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    min="0"
                    placeholder="299"
                    value={vehicleForm.dailyRate}
                    onChange={(e) => updateForm('dailyRate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyRate">{t('Weekly Rate (AED)')}</Label>
                  <Input
                    id="weeklyRate"
                    type="number"
                    min="0"
                    placeholder="1799"
                    value={vehicleForm.weeklyRate}
                    onChange={(e) => updateForm('weeklyRate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRate">{t('Monthly Rate (AED)')}</Label>
                  <Input
                    id="monthlyRate"
                    type="number"
                    min="0"
                    placeholder="6999"
                    value={vehicleForm.monthlyRate}
                    onChange={(e) => updateForm('monthlyRate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loyaltyPoints">{t('Loyalty Points')}</Label>
                  <Input
                    id="loyaltyPoints"
                    type="number"
                    min="0"
                    placeholder="500"
                    value={vehicleForm.loyaltyPoints}
                    onChange={(e) => updateForm('loyaltyPoints', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleNewVehicleOpenChange(false)}
              disabled={isSaving}
            >
              {t('Cancel')}
            </Button>
            <Button
              className="bg-gradient-to-r from-[#EF4444] to-[#1E40AF] text-white"
              onClick={handleAddVehicle}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditMode ? t('Save Changes') : t('Add Vehicle')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Vehicle Confirmation */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="backdrop-blur-xl bg-white/95">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Delete this vehicle?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('This will permanently remove')} {deleteTarget?.model} ({deleteTarget?.licensePlate}) {t('from the fleet. This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#EF4444] text-white hover:bg-[#EF4444]/90"
              onClick={handleDeleteVehicle}
            >
              {t('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Vehicle Details Dialog */}
      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent className="backdrop-blur-xl bg-white/95 max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('Vehicle Details')}</DialogTitle>
            <DialogDescription>
              {selectedItem?.model} • {selectedItem?.licensePlate}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Model')}</Label>
                  <p className="font-medium">{selectedItem.model}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('License Plate')}</Label>
                  <p className="font-medium font-mono">{selectedItem.licensePlate}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Location')}</Label>
                  <p className="font-medium">{selectedItem.location}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Status')}</Label>
                  <Badge variant={selectedItem.status === 'Active' ? 'default' : 'secondary'}>
                    {t(selectedItem.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Salik Status')}</Label>
                  <Badge variant={selectedItem.salikStatus === 'Synced' ? 'default' : 'destructive'}>
                    {t(selectedItem.salikStatus)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Outstanding Fines')}</Label>
                  <p className={selectedItem.fines > 0 ? 'font-medium text-[#EF4444]' : 'font-medium'}>
                    {selectedItem.fines > 0 ? `AED ${selectedItem.fines}` : t('None')}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4">
                <h4 className="font-medium mb-2">{t('Quick Actions')}</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('View on Map')}
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    {t('View History')}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVehicleDialogOpen(false)}>
              {t('Close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Management Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="backdrop-blur-xl bg-white/95 max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('Manage Booking')}</DialogTitle>
            <DialogDescription>
              {t('Booking ID:')} {selectedItem?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Customer Name')}</Label>
                  <p className="font-medium">{selectedItem.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Vehicle')}</Label>
                  <p className="font-medium">{selectedItem.vehicle}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Pick-up Date')}</Label>
                  <p className="font-medium">{selectedItem.pickupDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Return Date')}</Label>
                  <p className="font-medium">{selectedItem.returnDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Total Amount')}</Label>
                  <p className="font-medium text-[#1E40AF]">AED {selectedItem.totalAmount}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('Status')}</Label>
                  <Badge variant={selectedItem.status === 'Active' ? 'default' : 'secondary'}>
                    {t(selectedItem.status)}
                  </Badge>
                </div>
              </div>

              {selectedItem.status === 'Pending' && (
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    {t('This booking is awaiting approval. Review the details and approve or reject.')}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBookingDialogOpen(false)}
              disabled={isLoading}
            >
              {t('Close')}
            </Button>
            {selectedItem?.status === 'Pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleRejectBooking}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t('Reject')}
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#EF4444] to-[#1E40AF]"
                  onClick={handleApproveBooking}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t('Approve')}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Salik Sync Confirmation Dialog */}
      <AlertDialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <AlertDialogContent className="backdrop-blur-xl bg-white/95">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Sync Salik Data')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('This will fetch the latest toll charges and fines from RTA Account for')}{' '}
              {selectedItem?.model} ({selectedItem?.licensePlate}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSyncing}>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-gradient-to-r from-[#EF4444] to-[#1E40AF]"
              onClick={(e) => {
                e.preventDefault();
                handleConfirmSync();
              }}
              disabled={isSyncing}
            >
              {isSyncing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSyncing ? t('Syncing...') : t('Sync Now')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Document Review Dialog */}
      <Dialog open={documentReviewOpen} onOpenChange={setDocumentReviewOpen}>
        <DialogContent className="backdrop-blur-xl bg-white/95 max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('Document Review')}</DialogTitle>
            <DialogDescription>
              {selectedDocument?.name} • {selectedDocument?.type}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg h-96 flex items-center justify-center border border-slate-300">
              <div className="text-center text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <p>{t('Document Preview')}</p>
                <p className="text-sm">{t(selectedDocument?.type ?? '')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">{t('Document Type')}</Label>
                <p className="font-medium">{t(selectedDocument?.type ?? '')}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">{t('Customer Name')}</Label>
                <p className="font-medium">{selectedDocument?.name}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDocumentReviewOpen(false)}
              disabled={isLoading}
            >
              {t('Close')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectDocument}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('Reject')}
            </Button>
            <Button
              className="bg-gradient-to-r from-[#EF4444] to-[#1E40AF]"
              onClick={handleApproveDocument}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('Approve')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Salik Edit Dialog */}
      <Dialog open={salikEditOpen} onOpenChange={setSalikEditOpen}>
        <DialogContent className="backdrop-blur-xl bg-white/95 max-w-md">
          <DialogHeader>
            <DialogTitle>{t('Edit Salik Status')}</DialogTitle>
            <DialogDescription>
              {editingSalikVehicle && `${editingSalikVehicle.model} • ${editingSalikVehicle.licensePlate}`}
            </DialogDescription>
          </DialogHeader>

          {editingSalikVehicle && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t('Current Status')}</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <Badge variant={
                    editingSalikVehicle.salikStatus === 'Synced' ? 'default' :
                    editingSalikVehicle.salikStatus === 'Pending' ? 'secondary' :
                    'destructive'
                  }>
                    {t(editingSalikVehicle.salikStatus)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('Outstanding Fines')}</Label>
                <div className="p-3 bg-muted rounded-lg text-sm font-mono">
                  {editingSalikVehicle.fines > 0 ? (
                    <span className="text-[#EF4444]">AED {editingSalikVehicle.fines}</span>
                  ) : (
                    <span className="text-muted-foreground">AED 000</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('Last Sync')}</Label>
                <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                  {t('2 hours ago')}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSalikEditOpen(false)}
              disabled={isLoading}
            >
              {t('Cancel')}
            </Button>
            <Button
              className="bg-gradient-to-r from-[#EF4444] to-[#1E40AF]"
              onClick={handleSaveSalik}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t('Update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
