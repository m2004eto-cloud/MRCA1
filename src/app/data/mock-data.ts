export interface Vehicle {
  id: string;
  name: string;
  category: 'SUV' | 'Luxury' | 'Sedan' | 'Electric';
  image: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  fuel: 'EV' | 'Hybrid' | 'Gas';
  features: string[];
  transmission: string;
  seats: number;
  loyaltyPoints: number;
}

export interface FleetVehicle {
  id: string;
  model: string;
  licensePlate: string;
  location: string;
  status: 'Active' | 'Booked' | 'Maintenance';
  salikStatus: 'Synced' | 'Pending' | 'Error';
  fines: number;
  lat: number;
  lng: number;
}

export interface Booking {
  id: string;
  customerName: string;
  vehicle: string;
  pickupDate: string;
  returnDate: string;
  status: 'Pending' | 'Active' | 'Completed';
  totalAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  tax: number;
  total: number;
  issueDate: string;
  dueDate: string;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  bookingId?: string;
  description: string;
  paymentMethod?: 'Cash' | 'Card' | 'Bank Transfer' | 'Cheque';
  currency: string;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  description: string;
  amount: number;
  category: 'Maintenance' | 'Fuel' | 'Insurance' | 'Toll' | 'Salary' | 'Utilities' | 'Other';
  vendor?: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Paid' | 'Cancelled';
  vehicleId?: string;
  receiptUrl?: string;
  approvedBy?: string;
  currency: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  code: string;
  balance: number;
  currency: string;
  description: string;
  createdDate: string;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: 'Draft' | 'Posted';
  reference?: string;
  currency: string;
}

export interface FinancialReport {
  id: string;
  type: 'Income Statement' | 'Balance Sheet' | 'Cash Flow' | 'Trial Balance';
  period: string;
  generatedDate: string;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  totalAssets?: number;
  totalLiabilities?: number;
  totalEquity?: number;
}

export const vehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Tesla Model Y',
    category: 'Electric',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
    dailyRate: 299,
    weeklyRate: 1799,
    monthlyRate: 6999,
    fuel: 'EV',
    features: ['Sunroof', 'GPS', 'Autopilot', '4x4'],
    transmission: 'Automatic',
    seats: 5,
    loyaltyPoints: 500,
  },
  {
    id: '2',
    name: 'BMW 7 Series',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    dailyRate: 499,
    weeklyRate: 2999,
    monthlyRate: 11999,
    fuel: 'Gas',
    features: ['Sunroof', 'GPS', 'Massage Seats', 'Premium Sound'],
    transmission: 'Automatic',
    seats: 5,
    loyaltyPoints: 750,
  },
  {
    id: '3',
    name: 'Land Rover Defender',
    category: 'SUV',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    dailyRate: 399,
    weeklyRate: 2399,
    monthlyRate: 9499,
    fuel: 'Gas',
    features: ['Sunroof', 'GPS', '4x4', 'Off-road Package'],
    transmission: 'Automatic',
    seats: 7,
    loyaltyPoints: 600,
  },
  {
    id: '4',
    name: 'Mercedes S-Class',
    category: 'Luxury',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
    dailyRate: 549,
    weeklyRate: 3299,
    monthlyRate: 12999,
    fuel: 'Hybrid',
    features: ['Sunroof', 'GPS', 'Chauffeur Mode', 'Premium Sound'],
    transmission: 'Automatic',
    seats: 5,
    loyaltyPoints: 800,
  },
  {
    id: '5',
    name: 'Audi e-tron GT',
    category: 'Electric',
    image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800&q=80',
    dailyRate: 449,
    weeklyRate: 2699,
    monthlyRate: 10499,
    fuel: 'EV',
    features: ['Sunroof', 'GPS', 'Sport Mode', 'Premium Sound'],
    transmission: 'Automatic',
    seats: 4,
    loyaltyPoints: 700,
  },
  {
    id: '6',
    name: 'Toyota Camry',
    category: 'Sedan',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
    dailyRate: 149,
    weeklyRate: 899,
    monthlyRate: 3499,
    fuel: 'Hybrid',
    features: ['GPS', 'Bluetooth', 'Backup Camera'],
    transmission: 'Automatic',
    seats: 5,
    loyaltyPoints: 250,
  },
  {
    id: '7',
    name: 'Range Rover Sport',
    category: 'SUV',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    dailyRate: 599,
    weeklyRate: 3599,
    monthlyRate: 14299,
    fuel: 'Gas',
    features: ['Sunroof', 'GPS', '4x4', 'Premium Sound', 'Air Suspension'],
    transmission: 'Automatic',
    seats: 7,
    loyaltyPoints: 900,
  },
  {
    id: '8',
    name: 'Porsche Taycan',
    category: 'Electric',
    image: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=800&q=80',
    dailyRate: 649,
    weeklyRate: 3899,
    monthlyRate: 15499,
    fuel: 'EV',
    features: ['GPS', 'Sport Mode', 'Premium Sound', 'Performance Package'],
    transmission: 'Automatic',
    seats: 4,
    loyaltyPoints: 1000,
  },
];

export const fleetVehicles: FleetVehicle[] = [
  {
    id: 'F001',
    model: 'Tesla Model Y',
    licensePlate: 'DXB-A-12345',
    location: 'Dubai Marina',
    status: 'Active',
    salikStatus: 'Synced',
    fines: 0,
    lat: 25.0657,
    lng: 55.1364,
  },
  {
    id: 'F002',
    model: 'BMW 7 Series',
    licensePlate: 'DXB-B-67890',
    location: 'Downtown Dubai',
    status: 'Booked',
    salikStatus: 'Synced',
    fines: 0,
    lat: 25.1972,
    lng: 55.2744,
  },
  {
    id: 'F003',
    model: 'Land Rover Defender',
    licensePlate: 'AUH-C-45678',
    location: 'Abu Dhabi Airport',
    status: 'Active',
    salikStatus: 'Pending',
    fines: 200,
    lat: 24.4330,
    lng: 54.6510,
  },
  {
    id: 'F004',
    model: 'Mercedes S-Class',
    licensePlate: 'DXB-D-23456',
    location: 'Jumeirah Beach',
    status: 'Active',
    salikStatus: 'Synced',
    fines: 0,
    lat: 25.2048,
    lng: 55.2708,
  },
  {
    id: 'F005',
    model: 'Audi e-tron GT',
    licensePlate: 'SHJ-E-78901',
    location: 'Sharjah City',
    status: 'Maintenance',
    salikStatus: 'Error',
    fines: 0,
    lat: 25.3463,
    lng: 55.4209,
  },
  {
    id: 'F006',
    model: 'Toyota Camry',
    licensePlate: 'DXB-F-34567',
    location: 'Dubai Mall',
    status: 'Booked',
    salikStatus: 'Synced',
    fines: 0,
    lat: 25.1986,
    lng: 55.2790,
  },
  {
    id: 'F007',
    model: 'Range Rover Sport',
    licensePlate: 'DXB-G-89012',
    location: 'Palm Jumeirah',
    status: 'Active',
    salikStatus: 'Synced',
    fines: 0,
    lat: 25.1124,
    lng: 55.1390,
  },
  {
    id: 'F008',
    model: 'Porsche Taycan',
    licensePlate: 'AUH-H-56789',
    location: 'Yas Island',
    status: 'Active',
    salikStatus: 'Synced',
    fines: 600,
    lat: 24.4672,
    lng: 54.6067,
  },
];

export const bookings: Booking[] = [
  {
    id: 'B001',
    customerName: 'Ahmed Al Maktoum',
    vehicle: 'Tesla Model Y',
    pickupDate: '2026-06-10',
    returnDate: '2026-06-15',
    status: 'Active',
    totalAmount: 1495,
  },
  {
    id: 'B002',
    customerName: 'Sarah Johnson',
    vehicle: 'BMW 7 Series',
    pickupDate: '2026-06-08',
    returnDate: '2026-06-12',
    status: 'Active',
    totalAmount: 1996,
  },
  {
    id: 'B003',
    customerName: 'Mohammed Hassan',
    vehicle: 'Toyota Camry',
    pickupDate: '2026-06-09',
    returnDate: '2026-06-16',
    status: 'Pending',
    totalAmount: 1043,
  },
  {
    id: 'B004',
    customerName: 'Emily Chen',
    vehicle: 'Range Rover Sport',
    pickupDate: '2026-06-07',
    returnDate: '2026-06-14',
    status: 'Completed',
    totalAmount: 4193,
  },
];

export const invoices: Invoice[] = [
  {
    id: 'INV001',
    invoiceNumber: 'INV-2026-001',
    customerId: 'CUST001',
    customerName: 'Ahmed Al Maktoum',
    amount: 1495,
    tax: 224.25,
    total: 1719.25,
    issueDate: '2026-06-10',
    dueDate: '2026-07-10',
    status: 'Paid',
    bookingId: 'B001',
    description: 'Tesla Model Y - 5 days rental (10 Jun - 15 Jun)',
    paymentMethod: 'Card',
    currency: 'AED',
  },
  {
    id: 'INV002',
    invoiceNumber: 'INV-2026-002',
    customerId: 'CUST002',
    customerName: 'Sarah Johnson',
    amount: 1996,
    tax: 299.4,
    total: 2295.4,
    issueDate: '2026-06-08',
    dueDate: '2026-07-08',
    status: 'Paid',
    bookingId: 'B002',
    description: 'BMW 7 Series - 4 days rental (8 Jun - 12 Jun)',
    paymentMethod: 'Bank Transfer',
    currency: 'AED',
  },
  {
    id: 'INV003',
    invoiceNumber: 'INV-2026-003',
    customerId: 'CUST003',
    customerName: 'Mohammed Hassan',
    amount: 1043,
    tax: 156.45,
    total: 1199.45,
    issueDate: '2026-06-09',
    dueDate: '2026-07-09',
    status: 'Sent',
    bookingId: 'B003',
    description: 'Toyota Camry - 7 days rental (9 Jun - 16 Jun)',
    currency: 'AED',
  },
  {
    id: 'INV004',
    invoiceNumber: 'INV-2026-004',
    customerId: 'CUST004',
    customerName: 'Emily Chen',
    amount: 4193,
    tax: 629,
    total: 4822,
    issueDate: '2026-06-07',
    dueDate: '2026-07-07',
    status: 'Paid',
    bookingId: 'B004',
    description: 'Range Rover Sport - 7 days rental (7 Jun - 14 Jun)',
    paymentMethod: 'Card',
    currency: 'AED',
  },
  {
    id: 'INV005',
    invoiceNumber: 'INV-2026-005',
    customerId: 'CUST005',
    customerName: 'Fatima Al Mansouri',
    amount: 2997,
    tax: 449.55,
    total: 3446.55,
    issueDate: '2026-05-30',
    dueDate: '2026-06-30',
    status: 'Overdue',
    description: 'Mercedes S-Class - 5 days rental',
    currency: 'AED',
  },
];

export const expenses: Expense[] = [
  {
    id: 'EXP001',
    expenseNumber: 'EXP-2026-001',
    description: 'Regular maintenance - Tesla Model Y',
    amount: 500,
    category: 'Maintenance',
    vendor: 'Dubai Auto Service',
    date: '2026-06-05',
    status: 'Paid',
    vehicleId: 'F001',
    approvedBy: 'Finance Manager',
    currency: 'AED',
  },
  {
    id: 'EXP002',
    expenseNumber: 'EXP-2026-002',
    description: 'Fuel - Range Rover Sport',
    amount: 350,
    category: 'Fuel',
    vendor: 'ADNOC Fuel Station',
    date: '2026-06-08',
    status: 'Paid',
    vehicleId: 'F007',
    currency: 'AED',
  },
  {
    id: 'EXP003',
    expenseNumber: 'EXP-2026-003',
    description: 'Insurance premium - June 2026',
    amount: 8500,
    category: 'Insurance',
    vendor: 'Emirates Insurance',
    date: '2026-06-01',
    status: 'Paid',
    approvedBy: 'CFO',
    currency: 'AED',
  },
  {
    id: 'EXP004',
    expenseNumber: 'EXP-2026-004',
    description: 'Toll charges',
    amount: 280,
    category: 'Toll',
    date: '2026-06-09',
    status: 'Pending',
    currency: 'AED',
  },
  {
    id: 'EXP005',
    expenseNumber: 'EXP-2026-005',
    description: 'Staff salaries - June',
    amount: 45000,
    category: 'Salary',
    date: '2026-06-01',
    status: 'Approved',
    approvedBy: 'HR Manager',
    currency: 'AED',
  },
];

export const accounts: Account[] = [
  {
    id: 'ACC001',
    name: 'Cash and Bank',
    type: 'Asset',
    code: '1010',
    balance: 250000,
    currency: 'AED',
    description: 'Bank accounts and cash on hand',
    createdDate: '2026-01-01',
  },
  {
    id: 'ACC002',
    name: 'Accounts Receivable',
    type: 'Asset',
    code: '1200',
    balance: 3446.55,
    currency: 'AED',
    description: 'Customer receivables',
    createdDate: '2026-01-01',
  },
  {
    id: 'ACC003',
    name: 'Rental Fleet',
    type: 'Asset',
    code: '1500',
    balance: 1800000,
    currency: 'AED',
    description: 'Rental vehicle assets',
    createdDate: '2026-01-01',
  },
  {
    id: 'ACC004',
    name: 'Accumulated Depreciation',
    type: 'Liability',
    code: '1600',
    balance: -180000,
    currency: 'AED',
    description: 'Vehicle depreciation',
    createdDate: '2026-01-01',
  },
  {
    id: 'ACC005',
    name: 'Accounts Payable',
    type: 'Liability',
    code: '2100',
    balance: -45280,
    currency: 'AED',
    description: 'Vendor payables',
    createdDate: '2026-01-01',
  },
  {
    id: 'ACC006',
    name: 'Capital Stock',
    type: 'Equity',
    code: '3100',
    balance: 1500000,
    currency: 'AED',
    description: 'Owner capital',
    createdDate: '2026-01-01',
  },
  {
    id: 'ACC007',
    name: 'Rental Income',
    type: 'Revenue',
    code: '4100',
    balance: 75000,
    currency: 'AED',
    description: 'Vehicle rental revenue',
    createdDate: '2026-01-01',
  },
  {
    id: 'ACC008',
    name: 'Maintenance Expense',
    type: 'Expense',
    code: '5100',
    balance: -2000,
    currency: 'AED',
    description: 'Vehicle maintenance costs',
    createdDate: '2026-01-01',
  },
  {
    id: 'ACC009',
    name: 'Fuel Expense',
    type: 'Expense',
    code: '5200',
    balance: -1500,
    currency: 'AED',
    description: 'Fuel and energy costs',
    createdDate: '2026-01-01',
  },
  {
    id: 'ACC010',
    name: 'Insurance Expense',
    type: 'Expense',
    code: '5300',
    balance: -8500,
    currency: 'AED',
    description: 'Insurance premiums',
    createdDate: '2026-01-01',
  },
];

export const journalEntries: JournalEntry[] = [
  {
    id: 'JE001',
    entryNumber: 'JE-2026-001',
    date: '2026-06-10',
    description: 'Invoice paid - Ahmed Al Maktoum',
    debitAccount: 'ACC001',
    creditAccount: 'ACC002',
    amount: 1719.25,
    status: 'Posted',
    reference: 'INV-2026-001',
    currency: 'AED',
  },
  {
    id: 'JE002',
    entryNumber: 'JE-2026-002',
    date: '2026-06-08',
    description: 'Invoice paid - Sarah Johnson',
    debitAccount: 'ACC001',
    creditAccount: 'ACC002',
    amount: 2295.4,
    status: 'Posted',
    reference: 'INV-2026-002',
    currency: 'AED',
  },
  {
    id: 'JE003',
    entryNumber: 'JE-2026-003',
    date: '2026-06-05',
    description: 'Maintenance expense recorded',
    debitAccount: 'ACC008',
    creditAccount: 'ACC001',
    amount: 500,
    status: 'Posted',
    reference: 'EXP-2026-001',
    currency: 'AED',
  },
];

export const financialReports: FinancialReport[] = [
  {
    id: 'FR001',
    type: 'Income Statement',
    period: 'May 2026',
    generatedDate: '2026-05-31',
    totalRevenue: 65000,
    totalExpenses: 12000,
    netIncome: 53000,
  },
  {
    id: 'FR002',
    type: 'Balance Sheet',
    period: '2026-06-10',
    generatedDate: '2026-06-10',
    totalRevenue: 75000,
    totalExpenses: 12000,
    netIncome: 63000,
    totalAssets: 1870000,
    totalLiabilities: 45280,
    totalEquity: 1824720,
  },
];

// Authentication Module
export interface User {
  id: string;
  email: string;
  password: string; // Hashed in production
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'staff' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  avatar?: string;
  twoFactorEnabled: boolean;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'read' | 'create' | 'update' | 'delete';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
}

export interface LoginLog {
  id: string;
  userId: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  reason?: string;
}

export interface PasswordReset {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  used: boolean;
}

// Mock Users
export const users: User[] = [
  {
    id: 'USER001',
    email: 'admin@maximum.ae',
    password: 'hashed_admin_password_123', // Hashed in production
    firstName: 'Ahmed',
    lastName: 'Al Mansouri',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-01',
    lastLogin: '2026-06-11',
    phone: '+971501234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed',
    twoFactorEnabled: true,
  },
  {
    id: 'USER002',
    email: 'manager@maximum.ae',
    password: 'hashed_manager_password_456',
    firstName: 'Fatima',
    lastName: 'Al Maktoum',
    role: 'manager',
    status: 'active',
    createdAt: '2026-01-15',
    lastLogin: '2026-06-10',
    phone: '+971502345678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    twoFactorEnabled: false,
  },
  {
    id: 'USER003',
    email: 'staff@maximum.ae',
    password: 'hashed_staff_password_789',
    firstName: 'Mohammed',
    lastName: 'Al Hariri',
    role: 'staff',
    status: 'active',
    createdAt: '2026-02-01',
    lastLogin: '2026-06-11',
    phone: '+971503456789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed',
    twoFactorEnabled: false,
  },
  {
    id: 'USER004',
    email: 'customer@maximum.ae',
    password: 'hashed_customer_password_000',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'customer',
    status: 'active',
    createdAt: '2026-03-10',
    lastLogin: '2026-06-09',
    phone: '+971504567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    twoFactorEnabled: false,
  },
];

// Mock Permissions
export const permissions: Permission[] = [
  // Dashboard
  { id: 'PERM001', name: 'View Dashboard', description: 'Access main dashboard', resource: 'dashboard', action: 'read' },
  // Fleet
  { id: 'PERM002', name: 'View Fleet', description: 'View fleet vehicles', resource: 'fleet', action: 'read' },
  { id: 'PERM003', name: 'Create Vehicle', description: 'Add new vehicle', resource: 'fleet', action: 'create' },
  { id: 'PERM004', name: 'Edit Vehicle', description: 'Edit vehicle details', resource: 'fleet', action: 'update' },
  { id: 'PERM005', name: 'Delete Vehicle', description: 'Remove vehicle', resource: 'fleet', action: 'delete' },
  // Bookings
  { id: 'PERM006', name: 'View Bookings', description: 'View all bookings', resource: 'bookings', action: 'read' },
  { id: 'PERM007', name: 'Create Booking', description: 'Create new booking', resource: 'bookings', action: 'create' },
  { id: 'PERM008', name: 'Approve Booking', description: 'Approve pending booking', resource: 'bookings', action: 'update' },
  // Finance
  { id: 'PERM009', name: 'View Finance', description: 'Access finance module', resource: 'finance', action: 'read' },
  { id: 'PERM010', name: 'Create Invoice', description: 'Create new invoice', resource: 'finance', action: 'create' },
  { id: 'PERM011', name: 'Approve Expense', description: 'Approve expenses', resource: 'finance', action: 'update' },
  // Users
  { id: 'PERM012', name: 'View Users', description: 'View user list', resource: 'users', action: 'read' },
  { id: 'PERM013', name: 'Create User', description: 'Create new user', resource: 'users', action: 'create' },
  { id: 'PERM014', name: 'Edit User', description: 'Edit user details', resource: 'users', action: 'update' },
  { id: 'PERM015', name: 'Delete User', description: 'Remove user', resource: 'users', action: 'delete' },
  // Reports
  { id: 'PERM016', name: 'View Reports', description: 'Access reports', resource: 'reports', action: 'read' },
  { id: 'PERM017', name: 'Export Reports', description: 'Export report data', resource: 'reports', action: 'read' },
  // Settings
  { id: 'PERM018', name: 'View Settings', description: 'Access settings', resource: 'settings', action: 'read' },
  { id: 'PERM019', name: 'Modify Settings', description: 'Change system settings', resource: 'settings', action: 'update' },
];

// Mock Roles
export const roles: Role[] = [
  {
    id: 'ROLE001',
    name: 'Admin',
    description: 'Full system access',
    permissions: ['PERM001', 'PERM002', 'PERM003', 'PERM004', 'PERM005', 'PERM006', 'PERM007', 'PERM008', 'PERM009', 'PERM010', 'PERM011', 'PERM012', 'PERM013', 'PERM014', 'PERM015', 'PERM016', 'PERM017', 'PERM018', 'PERM019'],
  },
  {
    id: 'ROLE002',
    name: 'Manager',
    description: 'Fleet and booking management',
    permissions: ['PERM001', 'PERM002', 'PERM003', 'PERM004', 'PERM006', 'PERM007', 'PERM008', 'PERM009', 'PERM010', 'PERM016'],
  },
  {
    id: 'ROLE003',
    name: 'Staff',
    description: 'Limited operational access',
    permissions: ['PERM001', 'PERM002', 'PERM006', 'PERM009', 'PERM016'],
  },
  {
    id: 'ROLE004',
    name: 'Customer',
    description: 'Customer portal access',
    permissions: ['PERM001', 'PERM006', 'PERM007'],
  },
];

// Mock Sessions
export const authSessions: AuthSession[] = [
  {
    id: 'SESSION001',
    userId: 'USER001',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin_token_example',
    refreshToken: 'refresh_token_admin_12345',
    expiresAt: '2026-06-12',
    createdAt: '2026-06-11',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 Chrome/91.0',
  },
];

// Mock Login Logs
export const loginLogs: LoginLog[] = [
  {
    id: 'LOG001',
    userId: 'USER001',
    timestamp: '2026-06-11T14:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 Chrome/91.0',
    status: 'success',
  },
  {
    id: 'LOG002',
    userId: 'USER002',
    timestamp: '2026-06-10T09:15:00Z',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 Firefox/89.0',
    status: 'success',
  },
  {
    id: 'LOG003',
    userId: 'USER001',
    timestamp: '2026-06-09T18:45:00Z',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 Safari/14.1',
    status: 'failed',
    reason: 'Invalid credentials',
  },
];
