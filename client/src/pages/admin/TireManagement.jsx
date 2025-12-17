import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { Card, PageHeader, Button } from '../../components/common';
import * as tiresAPI from '../../api/tires';
import { notify } from '../../utils/notifications';

export default function TireManagement() {
  const [tiresAttention, setTiresAttention] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attention, alertsData] = await Promise.all([
        tiresAPI.getTiresNeedingAttention(),
        tiresAPI.getTireAlerts()
      ]);
      setTiresAttention(attention);
      setAlerts(alertsData);
    } catch (error) {
      notify.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await tiresAPI.resolveTireAlert(alertId);
      notify.success('Alerte résolue');
      fetchData();
    } catch (error) {
      notify.error('Erreur');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };
    return colors[severity] || colors.info;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des Pneus"
        subtitle="Surveillance et maintenance des pneus"
        actionLabel="Ajouter inspection"
        actionIcon={Plus}
        onAction={() => {}}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Pneus nécessitant attention" subtitle={`${tiresAttention.length} pneu(s)`}>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : tiresAttention.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
              <p className="text-gray-600 dark:text-slate-400">Tous les pneus sont en bon état</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tiresAttention.map((tire) => (
                <div key={tire._id} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{tire.serial}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-300">Position: {tire.position}</p>
                      {tire.pressure && <p className="text-sm text-red-600">Pression: {tire.pressure} bar</p>}
                      {tire.depth && <p className="text-sm text-red-600">Profondeur: {tire.depth} mm</p>}
                    </div>
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Alertes actives" subtitle={`${alerts.length} alerte(s)`}>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
              <p className="text-gray-600 dark:text-slate-400">Aucune alerte</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert._id} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => handleResolveAlert(alert._id)}>
                      Résoudre
                    </Button>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    {alert.tireId?.serial} - {alert.vehicleId?.plateNumber}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
