import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { Card, PageHeader, EmptyState } from '../../components/common';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { TripCard } from '../../components/chauffeur';
import { getMyTrips, selectMyTrips, selectTripsLoading } from '../../store/slices/tripsSlice';

/**
 * MyTrips Page
 * List of trips assigned to the current driver
 */
export default function MyTrips() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const trips = useSelector(selectMyTrips);
  const loading = useSelector(selectTripsLoading);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch trips on mount
  useEffect(() => {
    dispatch(getMyTrips());
  }, [dispatch]);

  // Filter trips
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || trip.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleTripClick = (trip) => {
    navigate(`/chauffeur/trips/${trip._id}`);
  };

  const statusOptions = [
    { value: '', label: 'Tous' },
    { value: 'planned', label: 'Planifié' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'completed', label: 'Terminé' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Mes Trajets"
        subtitle="Consultez et gérez vos trajets"
      />

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par origine ou destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Trips List */}
      {loading ? (
        <PageLoader message="Chargement des trajets..." />
      ) : filteredTrips.length === 0 ? (
        <Card>
          <EmptyState
            title="Aucun trajet trouvé"
            description="Vos trajets assignés apparaîtront ici"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip._id} trip={trip} onClick={handleTripClick} />
          ))}
        </div>
      )}
    </div>
  );
}
