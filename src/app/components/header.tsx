import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Logo } from "./logo";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Crown, Sun, Moon, Globe, Menu, X, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/language";
import { useAuth } from "../contexts/auth";

export function Header() {
  const navigate = useNavigate();
  const { lang, toggleLang, t } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    toast.success(t(newTheme === 'dark' ? 'Dark mode activated' : 'Light mode activated'));
  };

  const handleToggleLanguage = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    toggleLang();
    toast.success(next === 'en' ? 'Language changed to English' : 'تم التغيير إلى العربية');
  };

  const handleNavigation = (section: string) => {
    setMobileMenuOpen(false);

    if (section === 'rent') {
      navigate('/');
    } else if (section === 'vehicles') {
      navigate('/vehicles');
    } else {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        toast.info(`${t(section.charAt(0).toUpperCase() + section.slice(1))} ${lang === 'en' ? 'section coming soon!' : 'قريبًا!'}`);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/20 shadow-lg transition-colors">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Logo />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => handleNavigation('rent')} className="hover:text-[#EF4444] transition-colors dark:text-white">{t('Rent')}</button>
              <button onClick={() => handleNavigation('vehicles')} className="hover:text-[#1E40AF] transition-colors dark:text-white">{t('Vehicles')}</button>
              <button onClick={() => handleNavigation('leasing')} className="hover:text-[#EF4444] transition-colors dark:text-white">{t('Leasing')}</button>
              <button onClick={() => handleNavigation('corporate')} className="hover:text-[#1E40AF] transition-colors dark:text-white">{t('Corporate')}</button>
              <button onClick={() => handleNavigation('offers')} className="hover:text-[#EF4444] transition-colors dark:text-white">{t('Offers')}</button>
              <button onClick={() => handleNavigation('about')} className="hover:text-[#1E40AF] transition-colors dark:text-white">{t('About')}</button>
            </nav>

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-[#EF4444]/10 to-[#1E40AF]/10 border-[#EF4444]/20 hidden sm:flex items-center gap-1"
              >
                <Crown className="w-3 h-3 text-[#EF4444]" />
                {t('M-Gold Member')}
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                title={t(theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode')}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleLanguage}
                title={t(lang === 'en' ? 'Switch to Arabic' : 'Switch to English')}
                className="relative"
              >
                <Globe className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold bg-[#1E40AF] text-white rounded-sm px-1 leading-tight">
                  {lang === 'en' ? 'EN' : 'AR'}
                </span>
              </Button>

              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Button variant="outline" size="sm" asChild className="hidden md:inline-flex">
                      <Link to="/admin">{t('Admin')}</Link>
                    </Button>
                  ) : (
                    <Button
                      className="hidden md:inline-flex bg-gradient-to-r from-[#EF4444] to-[#1E40AF] hover:from-[#DC2626] hover:to-[#1E3A8A] text-white"
                      size="sm"
                      asChild
                    >
                      <Link to="/login">
                        <LogIn className="w-4 h-4 mr-2" />
                        {t('Login')}
                      </Link>
                    </Button>
                  )}
                </>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-white/20 dark:border-slate-700/20 pt-4">
              <button onClick={() => handleNavigation('rent')} className="block w-full text-left py-2 hover:text-[#EF4444] transition-colors dark:text-white">{t('Rent')}</button>
              <button onClick={() => handleNavigation('vehicles')} className="block w-full text-left py-2 hover:text-[#1E40AF] transition-colors dark:text-white">{t('Vehicles')}</button>
              <button onClick={() => handleNavigation('leasing')} className="block w-full text-left py-2 hover:text-[#EF4444] transition-colors dark:text-white">{t('Leasing')}</button>
              <button onClick={() => handleNavigation('corporate')} className="block w-full text-left py-2 hover:text-[#1E40AF] transition-colors dark:text-white">{t('Corporate')}</button>
              <button onClick={() => handleNavigation('offers')} className="block w-full text-left py-2 hover:text-[#EF4444] transition-colors dark:text-white">{t('Offers')}</button>
              <button onClick={() => handleNavigation('about')} className="block w-full text-left py-2 hover:text-[#1E40AF] transition-colors dark:text-white">{t('About')}</button>
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Button variant="outline" size="sm" asChild className="w-full mt-2">
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>{t('Admin')}</Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full mt-2 bg-gradient-to-r from-[#EF4444] to-[#1E40AF] hover:from-[#DC2626] hover:to-[#1E3A8A] text-white"
                      size="sm"
                      asChild
                    >
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <LogIn className="w-4 h-4 mr-2" />
                        {t('Login')}
                      </Link>
                    </Button>
                  )}
                </>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
