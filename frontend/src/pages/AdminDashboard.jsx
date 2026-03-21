import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth.js';
import binService from '../services/binService.js';
import vehicleService from '../services/vehicleService.js';
import complaintService from '../services/complaintService.js';
import routeService from '../services/routeService.js';
import './AdminDashboard.css';

const mockDashboardData = {
  totalComplaints: 142,
  openComplaints: 18,
  activeVehicles: 56,
  completedPickups: 1240,
  completionRate: 78,
  recentActivity: [
    {
      id: 'act-1',
      time: '10:45 AM',
      title: 'Vehicle KA-01-EF-2342 Dispatched',
      detail: 'Assigned to Route: Bangalore South - Jayanagar Circle.',
      note: 'Crew: R. Kumar, S. Patil',
      tone: 'success',
    },
    {
      id: 'act-2',
      time: '09:30 AM',
      title: 'Complaint #8821 Resolved',
      detail: 'Illegal dumping reported at Indiranagar 100ft road cleared.',
      note: '',
      tone: 'info',
    },
    {
      id: 'act-3',
      time: '08:15 AM',
      title: 'Hazardous Leak Detected',
      detail: 'Electronic waste bin at Koramangala Hub reached critical mass.',
      note: '',
      tone: 'danger',
    },
  ],
  alerts: [
    {
      id: 'al-1',
      level: 'Escalation',
      age: '2h ago',
      title: 'Water logging at HSR Layout Site B',
      detail: 'Requires immediate pump deployment.',
      tone: 'escalation',
    },
    {
      id: 'al-2',
      level: 'Urgent',
      age: '4h ago',
      title: 'Bio-medical waste mixed at Ward 12',
      detail: 'Supervisor alert triggered.',
      tone: 'urgent',
    },
  ],
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardData, setDashboardData] = useState(mockDashboardData);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bins, vehiclesAnalytics, complaints, routesAnalytics] = await Promise.all([
          binService.getBinAnalytics(),
          vehicleService.getVehicleAnalytics(),
          complaintService.getComplaintAnalytics(),
          routeService.getRouteAnalytics(),
        ]);

        setDashboardData((prev) => ({
          ...prev,
          totalComplaints: complaints?.totalComplaints ?? prev.totalComplaints,
          openComplaints: complaints?.pendingComplaints ?? prev.openComplaints,
          activeVehicles: vehiclesAnalytics?.activeVehicles ?? prev.activeVehicles,
          completedPickups: routesAnalytics?.completedRoutes ?? prev.completedPickups,
          completionRate: Number.parseFloat(String(routesAnalytics?.completionRate || prev.completionRate)) || prev.completionRate,
          recentActivity:
            (Array.isArray(routesAnalytics?.recentRoutes) && routesAnalytics.recentRoutes.length > 0
              ? routesAnalytics.recentRoutes.slice(0, 3).map((route, index) => ({
                  id: route._id || `dyn-${index}`,
                  time: route.updatedAt ? new Date(route.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
                  title: `${route.routeId || 'Route'} ${route.status === 'completed' ? 'Completed' : 'Updated'}`,
                  detail: route.notes || 'Operational update recorded.',
                  note: route.vehicleId?.registrationNumber ? `Vehicle: ${route.vehicleId.registrationNumber}` : '',
                  tone: route.status === 'completed' ? 'success' : 'info',
                }))
              : prev.recentActivity),
          alerts: bins?.binsNeedingCollection
            ? [
                {
                  id: 'live-1',
                  level: 'Escalation',
                  age: 'Live',
                  title: `${bins.binsNeedingCollection} bins need collection`,
                  detail: 'Dispatch balancing recommended for high-fill zones.',
                  tone: 'escalation',
                },
                ...prev.alerts.slice(0, 1),
              ]
            : prev.alerts,
        }));
      } catch {
        setDashboardData(mockDashboardData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const adminName = useMemo(() => {
    const name = user?.name || 'Admin';
    return name.split(' ')[0];
  }, [user]);

  const activityItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return dashboardData.recentActivity;
    }

    return dashboardData.recentActivity.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.detail.toLowerCase().includes(query) ||
        item.note.toLowerCase().includes(query)
      );
    });
  }, [dashboardData.recentActivity, searchTerm]);

  if (loading) {
    return (
      <div className="admin-loading-shell">
        <div className="admin-loading-panel">
          <div className="admin-loader" />
          <p>Loading operations dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-topnav">
        <div className="admin-brand">EcoManage Admin</div>

        <nav className="admin-nav-links">
          <button type="button" className="admin-nav-link admin-nav-link--active">Analytics</button>
          <button type="button" className="admin-nav-link" onClick={() => navigate('/admin/vehicles')}>Logistics</button>
          <button type="button" className="admin-nav-link" onClick={() => navigate('/admin/complaints')}>Compliance</button>
          <button type="button" className="admin-nav-link">Reports</button>
        </nav>

        <div className="admin-nav-actions">
          <label className="admin-search-wrap" aria-label="Search data">
            <input
              type="search"
              className="admin-search"
              placeholder="Search data..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <button type="button" className="admin-icon-btn" aria-label="Notifications">N</button>
          <button type="button" className="admin-icon-btn" aria-label="Settings">S</button>
          <button type="button" className="admin-avatar" aria-label="Admin profile">A</button>
        </div>
      </header>

      <main className="admin-content">
        <section className="admin-hero">
          <div className="admin-hero-content">
            <p className="admin-hero-label">Morning Update</p>
            <h1>Namaste, {adminName}. Operational Overview for today: Bangalore Zone.</h1>
            <p className="admin-hero-text">
              Efficiency is up 12% across 14 municipal wards today. Real-time logistics tracking is stable.
            </p>
          </div>
          <div className="admin-hero-glow" />
        </section>

        <section className="admin-kpi-grid">
          <article className="admin-kpi-card">
            <div className="admin-kpi-head">
              <span className="admin-kpi-icon">C</span>
              <span className="admin-kpi-badge admin-kpi-badge--danger">+4%</span>
            </div>
            <p>Total Complaints</p>
            <h3>{dashboardData.totalComplaints}</h3>
          </article>

          <article className="admin-kpi-card">
            <div className="admin-kpi-head">
              <span className="admin-kpi-icon">O</span>
              <span className="admin-kpi-badge admin-kpi-badge--ok">Active</span>
            </div>
            <p>Open Complaints</p>
            <h3>{dashboardData.openComplaints}</h3>
          </article>

          <article className="admin-kpi-card">
            <div className="admin-kpi-head">
              <span className="admin-kpi-icon">V</span>
            </div>
            <p>Active Vehicles</p>
            <h3>{dashboardData.activeVehicles}</h3>
          </article>

          <article className="admin-kpi-card">
            <div className="admin-kpi-head">
              <span className="admin-kpi-icon">P</span>
              <span className="admin-kpi-badge admin-kpi-badge--ok">92% Target</span>
            </div>
            <p>Completed Pickups</p>
            <h3>{dashboardData.completedPickups}</h3>
          </article>
        </section>

        <section className="admin-operations">
          <h2>Operations Control</h2>
          <div className="admin-action-grid">
            <button type="button" className="admin-action-card" onClick={() => navigate('/admin/complaints')}>
              <span>M</span>
              <b>Manage Complaints</b>
            </button>
            <button type="button" className="admin-action-card" onClick={() => navigate('/admin/vehicles')}>
              <span>V</span>
              <b>Manage Vehicles</b>
            </button>
            <button type="button" className="admin-action-card" onClick={() => navigate('/admin/vehicles')}>
              <span>R</span>
              <b>Manage Routes</b>
            </button>
            <button type="button" className="admin-action-card" onClick={() => navigate('/admin/education')}>
              <span>E</span>
              <b>Manage Education</b>
            </button>
          </div>
        </section>

        <section className="admin-main-grid">
          <div className="admin-activity-col">
            <div className="admin-section-head">
              <h2>Recent Activity</h2>
              <button type="button" onClick={() => navigate('/admin/complaints')}>View All Log</button>
            </div>

            <div className="admin-timeline">
              {activityItems.length === 0 && <p className="admin-empty">No activity matching your search.</p>}
              {activityItems.map((item) => (
                <article key={item.id} className="admin-timeline-item">
                  <div className={`admin-dot admin-dot--${item.tone}`}>{item.tone === 'danger' ? '!' : '*'}</div>
                  <div className="admin-timeline-content">
                    <p className="admin-timeline-time">{item.time}</p>
                    <h4>{item.title}</h4>
                    <p>{item.detail}</p>
                    {item.note && <div className="admin-note">{item.note}</div>}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="admin-side-col">
            <article className="admin-alert-card">
              <h3>Priority Alerts</h3>
              <div className="admin-alert-list">
                {dashboardData.alerts.map((alert) => (
                  <div key={alert.id} className={`admin-alert-item admin-alert-item--${alert.tone}`}>
                    <div className="admin-alert-head">
                      <span>{alert.level}</span>
                      <span>{alert.age}</span>
                    </div>
                    <b>{alert.title}</b>
                    <p>{alert.detail}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-health-card">
              <h3>System Health</h3>
              <div className="admin-health-row">
                <span>API Gateway</span>
                <b>Online</b>
              </div>
              <div className="admin-health-row">
                <span>Regional DB</span>
                <b>Online</b>
              </div>
              <div className="admin-health-row">
                <span>GPS Tracking</span>
                <b>Online</b>
              </div>
              <p className="admin-health-sync">Last sync: 2 minutes ago</p>
            </article>

            <article className="admin-progress-card">
              <h3>Waste Reduction Progress</h3>
              <div className="admin-progress-track">
                <span style={{ width: `${Math.min(100, Math.max(0, dashboardData.completionRate))}%` }} />
              </div>
              <div className="admin-progress-meta">
                <b>{dashboardData.completionRate}% Target Reached</b>
                <span>1,200 Tons</span>
              </div>
            </article>
          </aside>
        </section>
      </main>

      <footer className="admin-footer">
        <div className="admin-footer-links">
          <button type="button">Privacy Policy</button>
          <button type="button">Compliance Standards</button>
          <button type="button">Government Circulars</button>
          <button type="button">Contact Support</button>
        </div>
        <p>© 2024 EcoManage India. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
