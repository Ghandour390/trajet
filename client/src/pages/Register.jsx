import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, Phone, Truck, ArrowLeft } from 'lucide-react';
import { register, selectIsAuthenticated, selectAuthError, selectAuthLoading, clearError } from '../store/slices/authSlice';

export default function Register() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [validationError, setValidationError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Les mots de passe ne correspondent pas');
      return;
    }

    const { confirmPassword: _, ...userData } = formData;
    const cleanData = {
      firstname: userData.firstname.trim(),
      lastname: userData.lastname.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      phone: userData.phone.trim()
    };
    
    dispatch(register(cleanData));
  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />
      </div>

      {/* Register Card */}
      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/30 mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
          <p className="text-slate-400">Rejoignez TrajetCamen dès aujourd'hui</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 dark:border-slate-700/50 animate-fade-in">
          {displayError && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 animate-fade-in">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Firstname */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Prénom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-slate-700 rounded-xl
                      text-white placeholder-slate-500
                      focus:bg-white/10 dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                      outline-none transition-all duration-200"
                    placeholder="Mohamed"
                  />
                </div>
              </div>

              {/* Lastname */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-slate-700 rounded-xl
                      text-white placeholder-slate-500
                      focus:bg-white/10 dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                      outline-none transition-all duration-200"
                    placeholder="Alami"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-slate-700 rounded-xl
                    text-white placeholder-slate-500
                    focus:bg-white/10 dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                    outline-none transition-all duration-200"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-slate-700 rounded-xl
                    text-white placeholder-slate-500
                    focus:bg-white/10 dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                    outline-none transition-all duration-200"
                  placeholder="0612345678"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-slate-700 rounded-xl
                      text-white placeholder-slate-500
                      focus:bg-white/10 dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                      outline-none transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirmer</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-slate-700 rounded-xl
                      text-white placeholder-slate-500
                      focus:bg-white/10 dark:focus:bg-slate-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                      outline-none transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 
                hover:from-secondary-600 hover:to-secondary-700
                text-white rounded-xl font-semibold 
                transition-all duration-200 
                shadow-lg shadow-secondary-500/30 hover:shadow-xl hover:shadow-secondary-500/40
                transform hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création...
                </span>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-8 pt-6 border-t border-white/10 dark:border-slate-700">
            <p className="text-center text-slate-400">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center animate-fade-in">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
