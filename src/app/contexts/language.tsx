import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "ar";

const dictionary: Record<string, string> = {
  // Header / nav
  "Rent": "استئجار",
  "Vehicles": "المركبات",
  "Leasing": "التأجير",
  "Corporate": "الشركات",
  "Offers": "العروض",
  "About": "من نحن",
  "Admin": "الإدارة",
  "Rent a Car": "تأجير السيارات",
  "MAXIMUM": "ماكسيموم",
  "M-Gold Member": "عضو ذهبي",
  "points": "نقطة",
  "M-Gold: 2,450 points": "ذهبي: ٢٤٥٠ نقطة",
  "Switch to dark mode": "التبديل إلى الوضع الداكن",
  "Switch to light mode": "التبديل إلى الوضع الفاتح",
  "Switch to Arabic": "التبديل إلى العربية",
  "Switch to English": "التبديل إلى الإنجليزية",

  // Landing page
  "UAE's Premier Car Rental Service": "خدمة تأجير السيارات الأولى في الإمارات",
  "Premium Car.": "سيارة فاخرة.",
  "Maximum Experience.": "تجربة قصوى.",
  "Drive the finest vehicles across Dubai, Abu Dhabi, and beyond. Luxury, comfort, and reliability in every journey.":
    "قد أفضل المركبات في دبي وأبوظبي وما بعدها. فخامة وراحة وموثوقية في كل رحلة.",
  "Daily": "يومي",
  "Weekly": "أسبوعي",
  "Monthly": "شهري",
  "Why Choose Maximum?": "لماذا تختار ماكسيموم؟",
  "Full Insurance": "تأمين شامل",
  "Comprehensive coverage included with every rental. Drive with complete peace of mind.":
    "تغطية شاملة مدرجة مع كل استئجار. قد بسلام تام.",
  "Premium Fleet": "أسطول فاخر",
  "Latest models from Tesla, BMW, Mercedes, and more. Experience luxury on every drive.":
    "أحدث الموديلات من تسلا، بي إم دبليو، مرسيدس وغيرها. اختبر الفخامة في كل قيادة.",
  "24/7 Support": "دعم على مدار الساعة",
  "Round-the-clock assistance whenever you need it. We're always here for you.":
    "مساعدة على مدار الساعة عند الحاجة. نحن دائمًا هنا من أجلك.",
  "Loyalty Rewards": "مكافآت الولاء",
  "Earn M-Gold points with every rental. Unlock exclusive benefits and discounts.":
    "اكسب نقاط M-Gold مع كل استئجار. افتح مزايا وخصومات حصرية.",
  "Ready to Hit the Road?": "هل أنت مستعد للانطلاق؟",
  "Book your perfect vehicle now and experience the Maximum difference.":
    "احجز سيارتك المثالية الآن واختبر فرق ماكسيموم.",
  "Browse Our Fleet": "تصفح أسطولنا",

  // Booking widget
  "Location": "الموقع",
  "Date & Time": "التاريخ والوقت",
  "Dynamic Inventory": "مخزون ديناميكي",
  "API-driven pricing": "تسعير عبر واجهة برمجة التطبيقات",
  "Pick-up Location": "موقع الاستلام",
  "Dubai Marina, Downtown Dubai, Airport...": "مرسى دبي، وسط مدينة دبي، المطار...",
  "Interactive Map View": "عرض الخريطة التفاعلية",
  "UAE Locations": "مواقع الإمارات",
  "Continue to Date Selection": "متابعة لاختيار التاريخ",
  "Pick-up Date": "تاريخ الاستلام",
  "Return Date": "تاريخ الإرجاع",
  "Pick-up Time": "وقت الاستلام",
  "Return Time": "وقت الإرجاع",
  "Select date": "اختر التاريخ",
  "Back": "رجوع",
  "Search Vehicles": "ابحث عن المركبات",

  // Vehicle selection page
  "Select Your Vehicle": "اختر مركبتك",
  "premium vehicles available": "مركبة فاخرة متاحة",
  "Filters": "الفلاتر",
  "Category": "الفئة",
  "Fuel Type": "نوع الوقود",
  "Features": "المميزات",
  "Daily Price Range": "نطاق السعر اليومي",
  "Clear All Filters": "مسح كل الفلاتر",
  "Filters cleared": "تم مسح الفلاتر",
  "SUV": "دفع رباعي",
  "Luxury": "فاخرة",
  "Sedan": "سيدان",
  "Electric": "كهربائية",
  "EV": "كهربائي",
  "Hybrid": "هجين",
  "Gas": "بنزين",
  "Sunroof": "فتحة سقف",
  "GPS": "GPS",
  "4x4": "دفع رباعي",
  "Per Day": "في اليوم",
  "Per Week": "في الأسبوع",
  "Per Month": "في الشهر",
  "per day": "في اليوم",
  "per week": "في الأسبوع",
  "per month": "في الشهر",
  "Seats": "مقاعد",
  "Insurance included • Free delivery • 24/7 support":
    "التأمين مشمول • توصيل مجاني • دعم على مدار الساعة",
  "Book Now": "احجز الآن",
  "pts": "نقطة",
  "No vehicles found": "لم يتم العثور على مركبات",
  "Try adjusting your filters": "حاول تعديل الفلاتر",
  "Complete Your Booking": "أكمل حجزك",
  "Full Name *": "الاسم الكامل *",
  "Email Address *": "البريد الإلكتروني *",
  "Phone Number *": "رقم الهاتف *",
  "Included with your booking:": "مشمول مع حجزك:",
  "Comprehensive insurance coverage": "تغطية تأمينية شاملة",
  "Free delivery & pickup": "توصيل واستلام مجاني",
  "24/7 roadside assistance": "مساعدة على الطريق على مدار الساعة",
  "M-Gold loyalty points": "نقاط ولاء M-Gold",
  "Cancel": "إلغاء",
  "Confirming...": "جارٍ التأكيد...",
  "Confirm Booking": "تأكيد الحجز",
  "Please fill in all required fields": "يرجى ملء جميع الحقول المطلوبة",
  "Booking confirmed for": "تم تأكيد الحجز لـ",
  "You'll receive confirmation at": "ستتلقى التأكيد على",

  // Admin dashboard
  "Dashboard": "لوحة التحكم",
  "Fleet": "الأسطول",
  "Bookings": "الحجوزات",
  "Salik & Fines": "سالك والمخالفات",
  "Customers": "العملاء",
  "Reports": "التقارير",
  "Settings": "الإعدادات",
  "Back to Site": "العودة إلى الموقع",
  "MAXIMUM FLEET MANAGER": "مدير أسطول ماكسيموم",
  "Total Active Fleet": "إجمالي الأسطول النشط",
  "of": "من",
  "total": "الإجمالي",
  "Pending Bookings": "الحجوزات المعلقة",
  "awaiting approval": "بانتظار الموافقة",
  "Today's Check-ins": "تسجيلات الوصول اليوم",
  "vehicles scheduled": "مركبات مجدولة",
  "Salik & Fines Alerts": "تنبيهات سالك والمخالفات",
  "Real-time syncing": "مزامنة فورية",
  "Fleet GPS Tracking - UAE": "تتبع الأسطول عبر GPS - الإمارات",
  "Interactive GPS Map": "خريطة GPS تفاعلية",
  "Real-time fleet tracking across Dubai, Abu Dhabi, Sharjah":
    "تتبع الأسطول في الوقت الفعلي عبر دبي وأبوظبي والشارقة",
  "Active": "نشط",
  "Booked": "محجوز",
  "Maintenance": "صيانة",
  "Recent Bookings": "الحجوزات الأخيرة",
  "Document Validation Queue": "قائمة التحقق من المستندات",
  "License & Emirates ID": "الرخصة والهوية الإماراتية",
  "International License": "رخصة دولية",
  "Review": "مراجعة",
  "Fleet Management": "إدارة الأسطول",
  "Model": "الموديل",
  "License Plate": "لوحة السيارة",
  "Status": "الحالة",
  "Salik": "سالك",
  "Fines": "المخالفات",
  "Actions": "الإجراءات",
  "Synced": "متزامن",
  "Pending": "معلق",
  "Error": "خطأ",
  "View": "عرض",
  "Booking Management": "إدارة الحجوزات",
  "ID": "المعرف",
  "Customer": "العميل",
  "Vehicle": "المركبة",
  "Pick-up": "الاستلام",
  "Return": "الإرجاع",
  "Amount": "المبلغ",
  "Manage": "إدارة",
  "Total Fines": "إجمالي المخالفات",
  "Pending Syncs": "مزامنات معلقة",
  "Sync Errors": "أخطاء المزامنة",
  "Salik & Fines Overview": "نظرة عامة على سالك والمخالفات",
  "Real-time syncing from RTA Account": "مزامنة فورية من حساب هيئة الطرق والمواصلات",
  "Salik Status": "حالة سالك",
  "Outstanding Fines": "مخالفات مستحقة",
  "Last Sync": "آخر مزامنة",
  "Sync Now": "مزامنة الآن",
  "2 hours ago": "قبل ساعتين",
  "Customer Management": "إدارة العملاء",
  "Customer database and management tools will be displayed here.":
    "ستظهر هنا قاعدة بيانات العملاء وأدوات الإدارة.",
  "Reports & Analytics": "التقارير والتحليلات",
  "Revenue reports, booking analytics, and performance metrics will be displayed here.":
    "ستظهر هنا تقارير الإيرادات وتحليلات الحجز ومقاييس الأداء.",
  "Vehicle Details": "تفاصيل المركبة",
  "Close": "إغلاق",
  "Quick Actions": "إجراءات سريعة",
  "View on Map": "عرض على الخريطة",
  "View History": "عرض السجل",
  "None": "لا يوجد",
  "Manage Booking": "إدارة الحجز",
  "Booking ID:": "معرف الحجز:",
  "Customer Name": "اسم العميل",
  "Pick-up Date": "تاريخ الاستلام",
  "Return Date": "تاريخ الإرجاع",
  "Total Amount": "المبلغ الإجمالي",
  "This booking is awaiting approval. Review the details and approve or reject.":
    "هذا الحجز بانتظار الموافقة. راجع التفاصيل ووافق أو ارفض.",
  "Reject": "رفض",
  "Approve": "موافقة",
  "Sync Salik Data": "مزامنة بيانات سالك",
  "Syncing...": "جارٍ المزامنة...",
  "Document Review": "مراجعة المستند",
  "Document Preview": "معاينة المستند",
  "Document Type": "نوع المستند",
  "This will fetch the latest toll charges and fines from RTA Account for": "سيتم جلب أحدث رسوم الطرق والمخالفات من حساب هيئة الطرق والمواصلات لـ",
  "Booking approved successfully": "تمت الموافقة على الحجز بنجاح",
  "Booking rejected": "تم رفض الحجز",
  "Salik data synced successfully": "تمت مزامنة بيانات سالك بنجاح",
  "Latest toll charges have been updated": "تم تحديث أحدث رسوم الطرق",
  "Document approved": "تمت الموافقة على المستند",
  "Document rejected": "تم رفض المستند",
  "Language changed to English": "تم تغيير اللغة إلى الإنجليزية",
  "Language changed to Arabic": "تم تغيير اللغة إلى العربية",
  "Dark mode activated": "تم تفعيل الوضع الداكن",
  "Light mode activated": "تم تفعيل الوضع الفاتح",

  // Finance module
  "Finance": "المالية",
  "Overview": "نظرة عامة",
  "Invoices": "الفواتير",
  "Expenses": "المصروفات",
  "Chart of Accounts": "دليل الحسابات",
  "Journal Entries": "قيود اليومية",
  "Financial Reports": "التقارير المالية",
  "Total Revenue": "إجمالي الإيرادات",
  "Total Expenses": "إجمالي المصروفات",
  "Net Income": "صافي الدخل",
  "Total Assets": "إجمالي الأصول",
  "Total Liabilities": "إجمالي الخصوم",
  "Equity": "حقوق الملكية",
  "Revenue vs Expenses": "الإيرادات مقابل المصروفات",
  "Expense Categories": "فئات المصروفات",
  "Balance Sheet Summary": "ملخص الميزانية العمومية",
  "New Invoice": "فاتورة جديدة",
  "Invoice #": "رقم الفاتورة",
  "Tax": "الضريبة",
  "Due Date": "تاريخ الاستحقاق",
  "Edit Invoice": "تعديل الفاتورة",
  "Delete Invoice": "حذف الفاتورة",
  "Are you sure you want to delete this invoice? This action cannot be undone.": "هل أنت متأكد من رغبتك في حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.",
  "Invoice created successfully": "تم إنشاء الفاتورة بنجاح",
  "Invoice updated successfully": "تم تحديث الفاتورة بنجاح",
  "Invoice deleted successfully": "تم حذف الفاتورة بنجاح",
  "Invoice Number": "رقم الفاتورة",
  "Issue Date": "تاريخ الإصدار",
  "Payment Method": "طريقة الدفع",
  "Draft": "مسودة",
  "Sent": "مرسلة",
  "Paid": "مدفوعة",
  "Overdue": "متأخرة",
  "Cancelled": "ملغاة",
  "Send": "إرسال",
  "Mark as Paid": "وضع علامة كمدفوعة",
  "New Expense": "مصروف جديد",
  "Exp. #": "رقم المصروف",
  "Expense created successfully": "تم إنشاء المصروف بنجاح",
  "Expense updated successfully": "تم تحديث المصروف بنجاح",
  "Expense deleted successfully": "تم حذف المصروف بنجاح",
  "Edit Expense": "تعديل المصروف",
  "Delete Expense": "حذف المصروف",
  "Are you sure you want to delete this expense? This action cannot be undone.": "هل أنت متأكد من رغبتك في حذف هذا المصروف؟ لا يمكن التراجع عن هذا الإجراء.",
  "Maintenance": "الصيانة",
  "Fuel": "الوقود",
  "Insurance": "التأمين",
  "Toll": "الرسوم",
  "Salary": "الراتب",
  "Utilities": "المرافق",
  "Vendor": "المورد",
  "Approve": "الموافقة",
  "Expense approved": "تمت الموافقة على المصروف",
  "Account Name": "اسم الحساب",
  "Balance": "الرصيد",
  "Asset": "أصل",
  "Liability": "التزام",
  "Revenue": "إيراد",
  "Expense": "مصروف",
  "Entry #": "رقم القيد",
  "Debit Account": "حساب الخصم",
  "Credit Account": "حساب الائتمان",
  "Posted": "مسجل",
  "Period": "الفترة",
  "Income Statement": "بيان الدخل",
  "Balance Sheet": "الميزانية العمومية",
  "Cash Flow": "التدفق النقدي",
  "Trial Balance": "ميزان المراجعة",
  "Code": "الرمز",
};

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Lang | null;
    const initial = saved === "ar" ? "ar" : "en";
    setLangState(initial);
    document.documentElement.lang = initial;
    document.documentElement.dir = initial === "ar" ? "rtl" : "ltr";
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("language", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  const t = (key: string) => {
    if (lang === "en") return key;
    return dictionary[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: "en" as Lang,
      setLang: () => {},
      toggleLang: () => {},
      t: (k: string) => k,
    };
  }
  return ctx;
}
