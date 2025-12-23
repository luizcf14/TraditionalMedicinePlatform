import React, { useState, useEffect } from 'react';
import { Screen, User } from '../types';
import { apiFetch } from '../services/api';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen, patientId?: string, appointmentId?: string) => void;
  onLogout: () => void;
  user: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, currentScreen, onNavigate, onLogout, user }) => {
  // ... (existing code)

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{ patients: any[], plants: any[], treatments: any[] }>({ patients: [], plants: [], treatments: [] });

  // Debounce Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const res = await apiFetch(`/api/search?q=${searchQuery}`);
          const data = await res.json();
          if (data.success) {
            setResults({
              patients: data.patients || [],
              plants: data.plants || [],
              treatments: data.treatments || []
            });
            setShowResults(true);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults({ patients: [], plants: [], treatments: [] });
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (type: 'patient' | 'pharmacy', id: string) => {
    setShowResults(false);
    setSearchQuery('');
    if (type === 'patient') {
      onNavigate(Screen.PATIENT_RECORD, id);
    } else {
      onNavigate(Screen.PHARMACY);
    }
  };


  // SKIP TO FOOTER REPLACEMENT
  // Note: Since I cannot actually skip in replacement, I will target the exact block for the footer.
  // Let's split this into two replacements if needed, or just replace the whole Layout definition start and footer.

  // If login screen, render without layout
  if (currentScreen === Screen.LOGIN) {
    return <>{children}</>;
  }

  const navItems = [
    { icon: 'dashboard', label: 'Painel Principal', screen: Screen.DASHBOARD },
    { icon: 'groups', label: 'Pacientes', screen: Screen.PATIENT_LIST },
    { icon: 'calendar_month', label: 'Agenda', screen: Screen.AGENDA }, // Mock
    { icon: 'spa', label: 'Farmácia Viva', screen: Screen.PHARMACY }, // Mock
    { icon: 'settings', label: 'Configurações', screen: Screen.SETTINGS }, // Mock
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light text-text-main font-sans">
      {/* Sidebar */}
      <aside className="w-64 h-full hidden md:flex flex-col border-r border-border-light bg-surface-light shrink-0 z-20">
        <div className="h-full flex flex-col justify-between p-4">
          <div className="flex flex-col gap-4">
            {/* Logo */}
            <div className="flex gap-3 items-center px-2 py-2">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-xl size-10 shadow-sm border border-primary/20"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD55_dcfL2qLFH3HBBM117qo4jkY2tutW_pTBsB0KJl1iPiCKn2jSfFE2JtoA6DlHKQECszJ2ycAxxNRbm5hCs4ZVHSqSDCyTeC7QtGsJpjJGWFWNoBgQ0ipcgHlCWYVfjdbHXBDuPkF3-2vF80IR30M-6j3bFGRaBjPxNCdu5B-xAX89iN015YCU8Ecfpxzo-obyfOSxtB2eeczfwvDmUbalpGdA0pmGSw2JjHP-Rhg9lL0t_fNrfJFr5TskRbY90tu4U20BVsrbk")' }}
              />
              <div className="flex flex-col">
                <h1 className="text-text-main text-base font-bold leading-normal tracking-tight">Bahsé Ahpose</h1>
                <p className="text-primary-dark text-xs font-medium leading-normal">Medicina Tradicional</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 mt-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate(item.screen)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${currentScreen === item.screen
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-text-muted hover:bg-background-light hover:text-text-main'
                    }`}
                >
                  <span className={`material-symbols-outlined ${currentScreen === item.screen ? 'fill-1' : ''}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* User Profile Footer */}
          <div className="px-2 py-4 border-t border-border-light">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-light cursor-pointer transition-colors" onClick={onLogout}>
              {user?.image ? (
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full size-8 ring-2 ring-primary/30"
                  style={{ backgroundImage: `url("${user.image}")` }}
                />
              ) : (
                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold ring-2 ring-primary/30">
                  {user?.name?.substring(0, 2).toUpperCase() || 'Dr'}
                </div>
              )}
              <div className="flex flex-col overflow-hidden">
                <p className="text-text-main text-sm font-medium leading-none truncate">{user?.name || 'Profissional'}</p>
                <p className="text-text-muted text-xs font-normal leading-normal truncate mt-1">{user?.specialty || user?.role || 'Clinico Geral'}</p>
              </div>
              <span className="material-symbols-outlined text-text-muted ml-auto text-[20px]">logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-border-light bg-surface-light px-6 py-3 z-10 shrink-0">
          <div className="flex items-center gap-8 w-full max-w-xl">
            <button className="md:hidden text-text-main">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden md:flex flex-col w-full h-10 group relative">
              <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-background-light focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
                <div className="text-text-muted flex items-center justify-center pl-4 rounded-l-lg">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-transparent border-none h-full placeholder:text-text-muted px-4 text-sm font-normal focus:ring-0"
                  placeholder="Buscar pacientes, ervas, tratamentos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchQuery.length >= 2) setShowResults(true); }}
                />
                {isSearching && (
                  <div className="pr-4 flex items-center">
                    <span className="material-symbols-outlined animate-spin text-primary text-sm">progress_activity</span>
                  </div>
                )}
              </div>

              {/* Search Dropdown - Only show if we have results or query > 2 */}
              {showResults && searchQuery.length >= 2 && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border-light overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
                >
                  {/* Patients Section */}
                  {results.patients.length > 0 && (
                    <div className="p-2">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider px-3 py-2">Pacientes</h4>
                      {results.patients.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleResultClick('patient', p.id)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                        >
                          {p.image ? (
                            <div className="size-8 rounded-full bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${p.image})` }} />
                          ) : (
                            <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                              {p.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-text-main truncate text-ellipsis w-full">{p.name}</span>
                            <span className="text-xs text-text-muted">{p.village}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Plants Section */}
                  {results.plants.length > 0 && (
                    <div className="p-2 border-t border-border-light">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider px-3 py-2">Plantas Medicinais</h4>
                      {results.plants.map(p => (
                        <button
                          key={p.id}
                          onClick={() => handleResultClick('pharmacy', p.id)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                        >
                          {p.image ? (
                            <div className="size-8 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${p.image})` }} />
                          ) : (
                            <div className="size-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-sm">eco</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-text-main">{p.name}</span>
                            <span className="text-xs text-text-muted italic">{p.scientificName}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Treatments Section */}
                  {results.treatments.length > 0 && (
                    <div className="p-2 border-t border-border-light">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider px-3 py-2">Tratamentos</h4>
                      {results.treatments.map(t => (
                        <button
                          key={t.id}
                          onClick={() => handleResultClick('pharmacy', t.id)}
                          className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-sm">spa</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-text-main">{t.name}</span>
                            <span className="text-xs text-text-muted truncate max-w-[200px]">{t.indications}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {results.patients.length === 0 && results.plants.length === 0 && results.treatments.length === 0 && !isSearching && (
                    <div className="p-6 text-center text-text-muted text-sm">
                      Nenhum resultado encontrado.
                    </div>
                  )}
                </div>
              )}

              {/* Backdrop to close dropdown */}
              {showResults && (
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowResults(false)} />
              )}

            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-text-muted hover:bg-background-light rounded-full transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1.5 right-2 size-2 bg-red-500 rounded-full border-2 border-surface-light"></span>
            </button>
            <div className="h-8 w-[1px] bg-border-light hidden md:block"></div>
            <div className="md:hidden size-8 rounded-full bg-primary/20"></div>
            <div className="hidden md:block">
              <span className="text-sm font-semibold text-text-main">Bahsé Ahpose v1.0</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-20 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
