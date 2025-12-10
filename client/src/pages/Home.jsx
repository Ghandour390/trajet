

import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    { icon: '🚛', title: 'Gestion des Véhicules', desc: 'Suivi complet de votre flotte' },
    { icon: '📍', title: 'Gestion des Trajets', desc: 'Planification et suivi en temps réel' },
    { icon: '📄', title: 'Documents', desc: 'Centralisation des documents techniques' },
    { icon: '🔧', title: 'Maintenance', desc: 'Planification et historique' },
    { icon: '👥', title: 'Gestion Chauffeurs', desc: 'Affectation et suivi des équipes' },
    { icon: '📊', title: 'Rapports', desc: 'Statistiques et analyses détaillées' }
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#0B4F6C]">TrajetCamen</div>
          <div className="flex gap-3">
            <Link to="/login" className="px-6 py-2 text-[#0B4F6C] hover:text-[#1976A5] font-semibold transition">
              Connexion
            </Link>
            <Link to="/register" className="px-6 py-2 bg-[#FF8A00] hover:bg-[#e67a00] text-white rounded-lg font-semibold transition">
              S'inscrire
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0B4F6C] via-[#1976A5] to-[#009688] text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
            🚀 Solution N°1 au Maroc
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
            TrajetCamen
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Optimisez votre flotte avec une solution intelligente et moderne
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#FF8A00] hover:bg-[#e67a00] text-white px-10 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Démarrer gratuitement
            </button>
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-2 border-white/30 px-10 py-4 rounded-xl font-semibold transition-all">
              Voir la démo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[#009688] font-semibold text-sm uppercase tracking-wider">Fonctionnalités</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 text-[#263238]">Tout ce dont vous avez besoin</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Une plateforme complète pour gérer efficacement votre flotte</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#009688]/20 hover:-translate-y-2">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-[#263238] group-hover:text-[#0B4F6C] transition-colors">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-[#0B4F6C] to-[#1976A5] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-extrabold text-white mb-3">500+</div>
              <div className="text-gray-200 font-medium">Véhicules gérés</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-extrabold text-white mb-3">1000+</div>
              <div className="text-gray-200 font-medium">Trajets complétés</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-extrabold text-white mb-3">98%</div>
              <div className="text-gray-200 font-medium">Satisfaction client</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-5xl font-extrabold text-white mb-3">24/7</div>
              <div className="text-gray-200 font-medium">Support disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-gradient-to-r from-[#FF8A00] to-[#e67a00] rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Prêt à transformer votre gestion ?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">Rejoignez des centaines d'entreprises qui optimisent leur flotte avec TrajetCamen</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#FF8A00] hover:bg-gray-100 px-10 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Demander une démo
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold transition-all">
              Contactez-nous
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
