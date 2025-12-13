import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Truck, MapPin, FileText, Wrench, Users, BarChart3, 
  Moon, Sun, Menu, X, ArrowRight, Check, Star, ChevronRight
} from 'lucide-react';

export default function Home() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: Truck, title: 'Gestion des Véhicules', desc: 'Suivi complet de votre flotte avec alertes en temps réel' },
    { icon: MapPin, title: 'Gestion des Trajets', desc: 'Planification intelligente et suivi GPS en direct' },
    { icon: FileText, title: 'Documents', desc: 'Centralisation sécurisée des documents techniques' },
    { icon: Wrench, title: 'Maintenance', desc: 'Planification préventive et historique complet' },
    { icon: Users, title: 'Gestion Chauffeurs', desc: 'Affectation optimisée et suivi des performances' },
    { icon: BarChart3, title: 'Rapports', desc: 'Statistiques détaillées et tableaux de bord personnalisés' }
  ];

  const testimonials = [
    { name: 'Ahmed M.', role: 'Directeur Logistique', company: 'TransMaroc', text: 'TrajetCamen a révolutionné notre gestion de flotte. Gain de temps considérable!' },
    { name: 'Fatima Z.', role: 'Responsable Transport', company: 'LogiExpress', text: 'Interface intuitive et support réactif. Je recommande vivement.' },
    { name: 'Youssef K.', role: 'CEO', company: 'FleetPro', text: 'ROI visible dès le premier mois. Excellent investissement.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                TrajetCamen
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 dark:text-gray-300 hover:text-primary-600' : 'text-white/80 hover:text-white'}`}>
                Fonctionnalités
              </a>
              <a href="#stats" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 dark:text-gray-300 hover:text-primary-600' : 'text-white/80 hover:text-white'}`}>
                Statistiques
              </a>
              <a href="#testimonials" className={`font-medium transition-colors ${scrolled ? 'text-gray-600 dark:text-gray-300 hover:text-primary-600' : 'text-white/80 hover:text-white'}`}>
                Témoignages
              </a>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  scrolled 
                    ? 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {isDark ? (
                  <Sun size={20} className={scrolled ? 'text-yellow-500' : 'text-yellow-400'} />
                ) : (
                  <Moon size={20} className={scrolled ? 'text-slate-600' : 'text-white'} />
                )}
              </button>
              <Link 
                to="/login" 
                className={`px-5 py-2.5 font-semibold rounded-xl transition-all ${
                  scrolled 
                    ? 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Connexion
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2.5 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-secondary-500/30 hover:shadow-xl hover:scale-105"
              >
                S'inscrire
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 animate-fade-in">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-700 dark:text-gray-200">Fonctionnalités</a>
              <a href="#stats" className="block py-2 text-gray-700 dark:text-gray-200">Statistiques</a>
              <a href="#testimonials" className="block py-2 text-gray-700 dark:text-gray-200">Témoignages</a>
              <div className="pt-3 border-t border-gray-200 dark:border-slate-700 flex flex-col gap-2">
                <Link to="/login" className="py-2.5 text-center text-primary-600 dark:text-primary-400 font-semibold">
                  Connexion
                </Link>
                <Link to="/register" className="py-2.5 text-center bg-secondary-500 text-white rounded-xl font-semibold">
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 pt-24 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/10 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-white/90">🚀 Solution N°1 au Maroc</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <span className="text-white">Gérez votre flotte</span>
              <br />
              <span className="bg-gradient-to-r from-secondary-400 via-secondary-500 to-secondary-400 bg-clip-text text-transparent">
                intelligemment
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl md:text-2xl mb-10 text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
              Optimisez votre flotte avec une solution moderne, intuitive et puissante pour votre entreprise
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Link 
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-2xl font-semibold transition-all shadow-xl shadow-secondary-500/30 hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Démarrer gratuitement
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Voir la démo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-slate-400 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2">
                <Check size={18} className="text-green-400" />
                <span className="text-sm">Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} className="text-green-400" />
                <span className="text-sm">Support 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={18} className="text-green-400" />
                <span className="text-sm">Données sécurisées</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight size={24} className="text-white/50 rotate-90" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-white dark:bg-slate-900 transition-colors">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
              Fonctionnalités
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Une plateforme complète pour gérer efficacement votre flotte de véhicules
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group relative bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 sm:py-28 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Des chiffres qui parlent
            </h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Rejoignez des centaines d'entreprises qui nous font confiance
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'Véhicules gérés' },
              { value: '1000+', label: 'Trajets complétés' },
              { value: '98%', label: 'Satisfaction client' },
              { value: '24/7', label: 'Support disponible' }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">{stat.value}</div>
                <div className="text-primary-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 sm:py-28 bg-gray-50 dark:bg-slate-900 transition-colors">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-full text-sm font-semibold mb-4">
              Témoignages
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Ce que disent nos clients
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-secondary-500 via-secondary-600 to-secondary-500 rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
                Prêt à transformer votre gestion ?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Rejoignez des centaines d'entreprises qui optimisent leur flotte avec TrajetCamen
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register"
                  className="px-8 py-4 bg-white text-secondary-600 hover:bg-gray-100 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Demander une démo
                </Link>
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-2xl font-bold transition-all">
                  Contactez-nous
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">TrajetCamen</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2024 TrajetCamen. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
