import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Textarea } from "./ui/textarea";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MoreVertical,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  invoices,
  expenses,
  accounts,
  journalEntries,
  financialReports,
} from "../data/mock-data";
import type {
  Invoice,
  Expense,
  Account,
  JournalEntry,
  FinancialReport,
} from "../data/mock-data";
import { useLanguage } from "../contexts/language";

export function FinanceModule() {
  const { t } = useLanguage();
  const [financeTab, setFinanceTab] = useState("overview");

  // Invoice states
  const [invoiceList, setInvoiceList] = useState<Invoice[]>(invoices);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [deleteInvoiceTarget, setDeleteInvoiceTarget] = useState<Invoice | null>(
    null
  );

  // Expense states
  const [expenseList, setExpenseList] = useState<Expense[]>(expenses);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [deleteExpenseTarget, setDeleteExpenseTarget] = useState<Expense | null>(
    null
  );

  // Account states
  const [accountList, setAccountList] = useState<Account[]>(accounts);

  // Journal entry states
  const [journalList, setJournalList] = useState<JournalEntry[]>(journalEntries);
  const [journalDialogOpen, setJournalDialogOpen] = useState(false);

  // Forms
  const emptyInvoiceForm = {
    invoiceNumber: "",
    customerId: "",
    customerName: "",
    amount: "",
    tax: "",
    total: "",
    issueDate: "",
    dueDate: "",
    status: "Draft" as Invoice["status"],
    description: "",
    paymentMethod: undefined as Invoice["paymentMethod"],
    currency: "AED",
  };

  const emptyExpenseForm = {
    expenseNumber: "",
    description: "",
    amount: "",
    category: "Maintenance" as Expense["category"],
    vendor: "",
    date: "",
    status: "Pending" as Expense["status"],
    vehicleId: "",
    currency: "AED",
  };

  const [invoiceForm, setInvoiceForm] = useState(emptyInvoiceForm);
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate totals
  const totalRevenue = invoiceList
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalExpenseAmount = expenseList
    .filter((exp) => exp.status === "Paid")
    .reduce((sum, exp) => sum + exp.amount, 0);

  const netIncome = totalRevenue - totalExpenseAmount;
  const totalAssets = accountList
    .filter((acc) => acc.type === "Asset")
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalLiabilities = accountList
    .filter((acc) => acc.type === "Liability")
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  // Chart data
  const revenueData = [
    { month: "Jan", revenue: 45000, expenses: 8000 },
    { month: "Feb", revenue: 52000, expenses: 9500 },
    { month: "Mar", revenue: 48000, expenses: 8200 },
    { month: "Apr", revenue: 61000, expenses: 10000 },
    { month: "May", revenue: 65000, expenses: 12000 },
    { month: "Jun", revenue: 75000, expenses: 12000 },
  ];

  const expenseCategoryData = expenseList.reduce(
    (acc, exp) => {
      const existing = acc.find((item) => item.name === exp.category);
      if (existing) {
        existing.value += exp.amount;
      } else {
        acc.push({ name: exp.category, value: exp.amount });
      }
      return acc;
    },
    [] as { name: string; value: number }[]
  );

  const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#8b5cf6",
  ];

  const invoiceStatusColor: Record<Invoice["status"], string> = {
    Draft: "bg-gray-500",
    Sent: "bg-blue-500",
    Paid: "bg-green-500",
    Overdue: "bg-red-500",
    Cancelled: "bg-gray-400",
  };

  const expenseStatusColor: Record<Expense["status"], string> = {
    Pending: "bg-yellow-500",
    Approved: "bg-blue-500",
    Paid: "bg-green-500",
    Cancelled: "bg-gray-400",
  };

  // Invoice handlers
  const handleAddInvoice = () => {
    setEditingInvoiceId(null);
    setInvoiceForm(emptyInvoiceForm);
    setInvoiceDialogOpen(true);
  };

  const handleSaveInvoice = async () => {
    if (
      !invoiceForm.invoiceNumber ||
      !invoiceForm.customerName ||
      !invoiceForm.amount
    ) {
      toast.error(t("Please fill in all required fields"));
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newInvoice: Invoice = {
      id: editingInvoiceId || `INV${Date.now()}`,
      ...invoiceForm,
      amount: parseFloat(invoiceForm.amount),
      tax: parseFloat(invoiceForm.tax),
      total: parseFloat(invoiceForm.total),
    };

    if (editingInvoiceId) {
      setInvoiceList((prev) =>
        prev.map((inv) => (inv.id === editingInvoiceId ? newInvoice : inv))
      );
      toast.success(t("Invoice updated successfully"));
    } else {
      setInvoiceList((prev) => [newInvoice, ...prev]);
      toast.success(t("Invoice created successfully"));
    }

    setInvoiceDialogOpen(false);
    setIsLoading(false);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoiceId(invoice.id);
    setInvoiceForm({
      invoiceNumber: invoice.invoiceNumber,
      customerId: "",
      customerName: invoice.customerName,
      amount: invoice.amount.toString(),
      tax: invoice.tax.toString(),
      total: invoice.total.toString(),
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      description: invoice.description,
      paymentMethod: invoice.paymentMethod,
      currency: invoice.currency,
    });
    setInvoiceDialogOpen(true);
  };

  const handleDeleteInvoice = async () => {
    if (!deleteInvoiceTarget) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setInvoiceList((prev) =>
      prev.filter((inv) => inv.id !== deleteInvoiceTarget.id)
    );
    setDeleteInvoiceTarget(null);
    toast.success(t("Invoice deleted successfully"));
    setIsLoading(false);
  };

  // Expense handlers
  const handleAddExpense = () => {
    setEditingExpenseId(null);
    setExpenseForm(emptyExpenseForm);
    setExpenseDialogOpen(true);
  };

  const handleSaveExpense = async () => {
    if (!expenseForm.description || !expenseForm.amount) {
      toast.error(t("Please fill in all required fields"));
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newExpense: Expense = {
      id: editingExpenseId || `EXP${Date.now()}`,
      expenseNumber: expenseForm.expenseNumber || `EXP-${Date.now()}`,
      ...expenseForm,
      amount: parseFloat(expenseForm.amount),
    };

    if (editingExpenseId) {
      setExpenseList((prev) =>
        prev.map((exp) => (exp.id === editingExpenseId ? newExpense : exp))
      );
      toast.success(t("Expense updated successfully"));
    } else {
      setExpenseList((prev) => [newExpense, ...prev]);
      toast.success(t("Expense created successfully"));
    }

    setExpenseDialogOpen(false);
    setIsLoading(false);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setExpenseForm({
      expenseNumber: expense.expenseNumber,
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      vendor: expense.vendor || "",
      date: expense.date,
      status: expense.status,
      vehicleId: expense.vehicleId || "",
      currency: expense.currency,
    });
    setExpenseDialogOpen(true);
  };

  const handleDeleteExpense = async () => {
    if (!deleteExpenseTarget) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setExpenseList((prev) =>
      prev.filter((exp) => exp.id !== deleteExpenseTarget.id)
    );
    setDeleteExpenseTarget(null);
    toast.success(t("Expense deleted successfully"));
    setIsLoading(false);
  };

  const handleChangeInvoiceStatus = async (
    invoiceId: string,
    newStatus: Invoice["status"]
  ) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setInvoiceList((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
      )
    );

    toast.success(t("Invoice status updated"));
    setIsLoading(false);
  };

  const handleApproveExpense = async (expenseId: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setExpenseList((prev) =>
      prev.map((exp) =>
        exp.id === expenseId ? { ...exp, status: "Approved" } : exp
      )
    );

    toast.success(t("Expense approved"));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Tabs value={financeTab} onValueChange={setFinanceTab}>
        <TabsList>
          <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
          <TabsTrigger value="invoices">{t("Invoices")}</TabsTrigger>
          <TabsTrigger value="expenses">{t("Expenses")}</TabsTrigger>
          <TabsTrigger value="accounts">{t("Chart of Accounts")}</TabsTrigger>
          <TabsTrigger value="journal">{t("Journal Entries")}</TabsTrigger>
          <TabsTrigger value="reports">{t("Financial Reports")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("Total Revenue")}
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    AED {totalRevenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("Total Expenses")}
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    AED {totalExpenseAmount.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("Net Income")}
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    AED {netIncome.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("Total Assets")}
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    AED {totalAssets.toLocaleString()}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t("Revenue vs Expenses")}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    name="Expenses"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">{t("Expense Categories")}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Balance Sheet Overview */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">{t("Balance Sheet Summary")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("Total Assets")}
                </p>
                <p className="text-2xl font-bold mt-2">
                  AED {totalAssets.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("Total Liabilities")}
                </p>
                <p className="text-2xl font-bold mt-2">
                  AED {totalLiabilities.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("Equity")}
                </p>
                <p className="text-2xl font-bold mt-2">
                  AED {(totalAssets - totalLiabilities).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{t("Invoices")}</h3>
            <Button onClick={handleAddInvoice}>
              <Plus className="w-4 h-4 mr-2" />
              {t("New Invoice")}
            </Button>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Invoice #")}</TableHead>
                  <TableHead>{t("Customer")}</TableHead>
                  <TableHead>{t("Amount")}</TableHead>
                  <TableHead>{t("Tax")}</TableHead>
                  <TableHead>{t("Total")}</TableHead>
                  <TableHead>{t("Due Date")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead>{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceList.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>
                      AED {invoice.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      AED {invoice.tax.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold">
                      AED {invoice.total.toLocaleString()}
                    </TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge className={invoiceStatusColor[invoice.status]}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            {t("Edit")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {invoice.status !== "Paid" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleChangeInvoiceStatus(invoice.id, "Sent")
                                }
                              >
                                <Send className="w-4 h-4 mr-2" />
                                {t("Send")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleChangeInvoiceStatus(invoice.id, "Paid")
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {t("Mark as Paid")}
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteInvoiceTarget(invoice)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t("Delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Invoice Dialog */}
          <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingInvoiceId ? t("Edit Invoice") : t("New Invoice")}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Invoice Number")}</Label>
                    <Input
                      value={invoiceForm.invoiceNumber}
                      onChange={(e) =>
                        setInvoiceForm((prev) => ({
                          ...prev,
                          invoiceNumber: e.target.value,
                        }))
                      }
                      placeholder="INV-2026-001"
                    />
                  </div>
                  <div>
                    <Label>{t("Customer Name")}</Label>
                    <Input
                      value={invoiceForm.customerName}
                      onChange={(e) =>
                        setInvoiceForm((prev) => ({
                          ...prev,
                          customerName: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>{t("Description")}</Label>
                  <Textarea
                    value={invoiceForm.description}
                    onChange={(e) =>
                      setInvoiceForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Invoice details"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>{t("Amount")}</Label>
                    <Input
                      type="number"
                      value={invoiceForm.amount}
                      onChange={(e) =>
                        setInvoiceForm((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>{t("Tax (%)")}</Label>
                    <Input
                      type="number"
                      value={invoiceForm.tax}
                      onChange={(e) =>
                        setInvoiceForm((prev) => ({
                          ...prev,
                          tax: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>{t("Total")}</Label>
                    <Input
                      type="number"
                      value={invoiceForm.total}
                      onChange={(e) =>
                        setInvoiceForm((prev) => ({
                          ...prev,
                          total: e.target.value,
                        }))
                      }
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Issue Date")}</Label>
                    <Input
                      type="date"
                      value={invoiceForm.issueDate}
                      onChange={(e) =>
                        setInvoiceForm((prev) => ({
                          ...prev,
                          issueDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>{t("Due Date")}</Label>
                    <Input
                      type="date"
                      value={invoiceForm.dueDate}
                      onChange={(e) =>
                        setInvoiceForm((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Status")}</Label>
                    <Select
                      value={invoiceForm.status}
                      onValueChange={(value) =>
                        setInvoiceForm((prev) => ({
                          ...prev,
                          status: value as Invoice["status"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">{t("Draft")}</SelectItem>
                        <SelectItem value="Sent">{t("Sent")}</SelectItem>
                        <SelectItem value="Paid">{t("Paid")}</SelectItem>
                        <SelectItem value="Overdue">
                          {t("Overdue")}
                        </SelectItem>
                        <SelectItem value="Cancelled">
                          {t("Cancelled")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("Payment Method")}</Label>
                    <Select
                      value={invoiceForm.paymentMethod || ""}
                      onValueChange={(value) =>
                        setInvoiceForm((prev) => ({
                          ...prev,
                          paymentMethod: value as Invoice["paymentMethod"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">{t("Cash")}</SelectItem>
                        <SelectItem value="Card">{t("Card")}</SelectItem>
                        <SelectItem value="Bank Transfer">
                          {t("Bank Transfer")}
                        </SelectItem>
                        <SelectItem value="Cheque">{t("Cheque")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setInvoiceDialogOpen(false)}
                >
                  {t("Cancel")}
                </Button>
                <Button onClick={handleSaveInvoice} disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t("Save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Invoice Confirmation */}
          <AlertDialog
            open={!!deleteInvoiceTarget}
            onOpenChange={(open) => !open && setDeleteInvoiceTarget(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("Delete Invoice")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    "Are you sure you want to delete this invoice? This action cannot be undone."
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteInvoice}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t("Delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{t("Expenses")}</h3>
            <Button onClick={handleAddExpense}>
              <Plus className="w-4 h-4 mr-2" />
              {t("New Expense")}
            </Button>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Exp. #")}</TableHead>
                  <TableHead>{t("Description")}</TableHead>
                  <TableHead>{t("Category")}</TableHead>
                  <TableHead>{t("Amount")}</TableHead>
                  <TableHead>{t("Date")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead>{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseList.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-mono text-sm">
                      {expense.expenseNumber}
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{expense.category}</Badge>
                    </TableCell>
                    <TableCell>AED {expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>
                      <Badge className={expenseStatusColor[expense.status]}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleEditExpense(expense)}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            {t("Edit")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {expense.status === "Pending" && (
                            <DropdownMenuItem
                              onClick={() => handleApproveExpense(expense.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {t("Approve")}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteExpenseTarget(expense)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t("Delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Expense Dialog */}
          <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingExpenseId ? t("Edit Expense") : t("New Expense")}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Description")}</Label>
                    <Input
                      value={expenseForm.description}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Expense description"
                    />
                  </div>
                  <div>
                    <Label>{t("Category")}</Label>
                    <Select
                      value={expenseForm.category}
                      onValueChange={(value) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          category: value as Expense["category"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maintenance">
                          {t("Maintenance")}
                        </SelectItem>
                        <SelectItem value="Fuel">{t("Fuel")}</SelectItem>
                        <SelectItem value="Insurance">
                          {t("Insurance")}
                        </SelectItem>
                        <SelectItem value="Toll">{t("Toll")}</SelectItem>
                        <SelectItem value="Salary">{t("Salary")}</SelectItem>
                        <SelectItem value="Utilities">
                          {t("Utilities")}
                        </SelectItem>
                        <SelectItem value="Other">{t("Other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Amount")}</Label>
                    <Input
                      type="number"
                      value={expenseForm.amount}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>{t("Vendor")}</Label>
                    <Input
                      value={expenseForm.vendor}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          vendor: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Date")}</Label>
                    <Input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>{t("Status")}</Label>
                    <Select
                      value={expenseForm.status}
                      onValueChange={(value) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          status: value as Expense["status"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">{t("Pending")}</SelectItem>
                        <SelectItem value="Approved">
                          {t("Approved")}
                        </SelectItem>
                        <SelectItem value="Paid">{t("Paid")}</SelectItem>
                        <SelectItem value="Cancelled">
                          {t("Cancelled")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setExpenseDialogOpen(false)}
                >
                  {t("Cancel")}
                </Button>
                <Button onClick={handleSaveExpense} disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t("Save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Expense Confirmation */}
          <AlertDialog
            open={!!deleteExpenseTarget}
            onOpenChange={(open) => !open && setDeleteExpenseTarget(null)}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("Delete Expense")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t(
                    "Are you sure you want to delete this expense? This action cannot be undone."
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteExpense}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t("Delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        {/* Chart of Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4">
          <h3 className="font-semibold">{t("Chart of Accounts")}</h3>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Code")}</TableHead>
                  <TableHead>{t("Account Name")}</TableHead>
                  <TableHead>{t("Type")}</TableHead>
                  <TableHead>{t("Balance")}</TableHead>
                  <TableHead>{t("Description")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountList.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-mono font-semibold">
                      {account.code}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {account.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{account.type}</Badge>
                    </TableCell>
                    <TableCell
                      className={`font-semibold ${
                        account.balance >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      AED {account.balance.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {account.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Journal Entries Tab */}
        <TabsContent value="journal" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{t("Journal Entries")}</h3>
          </div>

          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Entry #")}</TableHead>
                  <TableHead>{t("Date")}</TableHead>
                  <TableHead>{t("Description")}</TableHead>
                  <TableHead>{t("Debit Account")}</TableHead>
                  <TableHead>{t("Credit Account")}</TableHead>
                  <TableHead>{t("Amount")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journalList.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">
                      {entry.entryNumber}
                    </TableCell>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-sm">
                      {accountList.find((a) => a.id === entry.debitAccount)
                        ?.name || entry.debitAccount}
                    </TableCell>
                    <TableCell className="text-sm">
                      {accountList.find((a) => a.id === entry.creditAccount)
                        ?.name || entry.creditAccount}
                    </TableCell>
                    <TableCell className="font-semibold">
                      AED {entry.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          entry.status === "Posted"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }
                      >
                        {entry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Financial Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <h3 className="font-semibold">{t("Financial Reports")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {financialReports.map((report) => (
              <Card key={report.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold">{report.type}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t("Period")}: {report.period}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("Total Revenue")}
                    </span>
                    <span className="font-semibold">
                      AED {report.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("Total Expenses")}
                    </span>
                    <span className="font-semibold">
                      AED {report.totalExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {t("Net Income")}
                    </span>
                    <span className="font-semibold text-green-600">
                      AED {report.netIncome.toLocaleString()}
                    </span>
                  </div>

                  {report.type === "Balance Sheet" && (
                    <>
                      <div className="border-t pt-3">
                        <p className="text-sm font-semibold mb-2">
                          {t("Balance Sheet")}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              {t("Total Assets")}
                            </span>
                            <span className="font-semibold">
                              AED {report.totalAssets?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              {t("Total Liabilities")}
                            </span>
                            <span className="font-semibold">
                              AED {report.totalLiabilities?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              {t("Total Equity")}
                            </span>
                            <span className="font-semibold text-blue-600">
                              AED {report.totalEquity?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
