import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth.js';
import routeService from '../services/routeService.js';
import AdminEducationManagement from '../components/AdminEducationManagement.jsx';
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AdminDashboard.css';

const DEFAULT_CHENNAI_CENTER = [13.0827, 80.2707];

const createTruckIcon = (label, color, isEnabled = true) =>
  L.divIcon({
    className: 'admin-truck-icon-wrap',
    html: `<div class="admin-map-pin admin-map-pin--truck ${isEnabled ? '' : 'admin-map-pin--disabled'}" style="border-color:${isEnabled ? color : '#9aa0a6'};"><span class="admin-map-pin-emoji">🚛</span><span class="admin-map-pin-label">${label}</span></div>`,
    iconSize: [54, 54],
    iconAnchor: [27, 48],
    popupAnchor: [0, -42],
  });

const createBinIcon = (fillLevel) => {
  const level = Math.max(0, Math.min(100, Number(fillLevel) || 0));
  const tone = level >= 80 ? '#bf1b1b' : level >= 50 ? '#cc6f00' : '#0a8a2a';

  return L.divIcon({
    className: 'admin-bin-icon-wrap',
    html: `<div class="admin-map-pin admin-map-pin--bin" style="border-color:${tone};"><span class="admin-map-pin-emoji">🗑️</span><span class="admin-map-pin-badge" style="background:${tone};">${level}%</span></div>`,
    iconSize: [52, 52],
    iconAnchor: [26, 46],
    popupAnchor: [0, -40],
  });
};

const createRouteLabelIcon = (name, color, isEnabled = true) =>
  L.divIcon({
    className: 'admin-route-label-wrap',
    html: `<div class="admin-route-label ${isEnabled ? '' : 'admin-route-label--disabled'}" style="background:${isEnabled ? color : '#98a0a6'};">${name}</div>`,
    iconSize: [140, 24],
    iconAnchor: [70, 12],
  });

const createFacilityIcon = () =>
  L.divIcon({
    className: 'admin-facility-icon-wrap',
    html: '<div class="admin-map-pin admin-map-pin--facility"><span class="admin-map-pin-emoji">🏭</span><span class="admin-map-pin-label">FACILITY</span></div>',
    iconSize: [58, 58],
    iconAnchor: [29, 52],
    popupAnchor: [0, -45],
  });

const closePathIfNeeded = (path) => {
  if (!Array.isArray(path) || path.length < 2) {
    return [];
  }

  const first = path[0];
  const last = path[path.length - 1];
  if (first.latitude === last.latitude && first.longitude === last.longitude) {
    return path;
  }

  return [...path, first];
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState('analytics');
  const [logisticsError, setLogisticsError] = useState('');
  const [liveFailureCount, setLiveFailureCount] = useState(0);
  const [lastLiveSuccessAt, setLastLiveSuccessAt] = useState(0);

  const [liveSnapshot, setLiveSnapshot] = useState({
    city: 'Chennai',
    center: { latitude: DEFAULT_CHENNAI_CENTER[0], longitude: DEFAULT_CHENNAI_CENTER[1] },
    facility: null,
    stats: { activeRoutes: 0, activeVehicles: 0, completedPickups: 0, binsNeedPickup: 0 },
    routes: [],
    trucks: [],
    bins: [],
    recentActivity: [],
  });

  const [selectedTruckId, setSelectedTruckId] = useState('');
  const [togglePending, setTogglePending] = useState({});

  const fetchLiveSnapshot = async () => {
    try {
      const payload = await routeService.getLogisticsLiveData('chennai');
      setLiveSnapshot(payload);
      setLiveFailureCount(0);
      setLogisticsError('');
      setLastLiveSuccessAt(Date.now());

      if (payload?.trucks?.length > 0) {
        setSelectedTruckId((prev) => prev || payload.trucks[0].vehicleId);
      }
    } catch (error) {
      setLiveFailureCount((previous) => {
        const nextCount = previous + 1;
        const hasLiveData = (liveSnapshot.trucks?.length || 0) > 0 && (liveSnapshot.routes?.length || 0) > 0;
        const recentSuccess = Date.now() - lastLiveSuccessAt < 12000;
        if (nextCount >= 3 && !hasLiveData && !recentSuccess) {
          setLogisticsError('Unable to load live logistics stream. Please check backend.');
        }
        return nextCount;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSnapshot();
    const intervalId = setInterval(fetchLiveSnapshot, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const adminName = useMemo(() => {
    const name = user?.name || 'Admin';
    return name.split(' ')[0];
  }, [user]);

  const selectedTruck = useMemo(
    () => liveSnapshot.trucks.find((truck) => truck.vehicleId === selectedTruckId) || null,
    [liveSnapshot.trucks, selectedTruckId]
  );

  const routeTruckById = useMemo(() => {
    return (liveSnapshot.trucks || []).reduce((acc, truck) => {
      if (!acc[truck.routeId]) {
        acc[truck.routeId] = truck;
      }
      return acc;
    }, {});
  }, [liveSnapshot.trucks]);

  useEffect(() => {
    if (!liveSnapshot.trucks.length) {
      setSelectedTruckId('');
      return;
    }

    const exists = liveSnapshot.trucks.some((truck) => truck.vehicleId === selectedTruckId);
    if (!exists) {
      setSelectedTruckId(liveSnapshot.trucks[0].vehicleId);
    }
  }, [liveSnapshot.trucks, selectedTruckId]);

  const selectedMappedTruck = useMemo(() => {
    if (selectedTruck) {
      return selectedTruck;
    }

    return liveSnapshot.trucks[0] || null;
  }, [liveSnapshot.trucks, selectedTruck]);

  const routeOperationalById = useMemo(() => {
    return (liveSnapshot.routes || []).reduce((acc, route) => {
      const assignedTruck = routeTruckById[route.routeId];
      const isEnabled = route.isEnabled !== false && (assignedTruck?.isEnabled !== false);
      acc[route.routeId] = isEnabled;
      return acc;
    }, {});
  }, [liveSnapshot.routes, routeTruckById]);

  const mapCenter = useMemo(() => {
    if (selectedMappedTruck?.currentLocation) {
      return [selectedMappedTruck.currentLocation.latitude, selectedMappedTruck.currentLocation.longitude];
    }

    return [
      liveSnapshot.center?.latitude || DEFAULT_CHENNAI_CENTER[0],
      liveSnapshot.center?.longitude || DEFAULT_CHENNAI_CENTER[1],
    ];
  }, [selectedMappedTruck, liveSnapshot.center]);

  const routesById = useMemo(() => {
    return (liveSnapshot.routes || []).reduce((acc, route) => {
      acc[route.routeId] = route;
      return acc;
    }, {});
  }, [liveSnapshot.routes]);

  const shouldShowLogisticsError = useMemo(() => {
    const hasLiveData = (liveSnapshot.trucks?.length || 0) > 0 && (liveSnapshot.routes?.length || 0) > 0;
    return Boolean(logisticsError) && liveFailureCount >= 3 && !hasLiveData;
  }, [logisticsError, liveFailureCount, liveSnapshot.trucks, liveSnapshot.routes]);

  const toggleLiveOperation = async (type, id, enabled) => {
    const pendingKey = `${type}:${id}`;
    setTogglePending((previous) => ({ ...previous, [pendingKey]: true }));

    try {
      const payload = await routeService.updateLogisticsLiveToggle(type, id, enabled, 'chennai');
      setLiveSnapshot(payload);
      setLogisticsError('');
    } catch (error) {
      setLogisticsError('Unable to update live ON/OFF state. Please try again.');
    } finally {
      setTogglePending((previous) => ({ ...previous, [pendingKey]: false }));
    }
  };

  const handleAdminLogout = () => {
    logout();
    navigate('/login');
  };

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
          <button
            type="button"
            className={`admin-nav-link ${activePanel === 'analytics' ? 'admin-nav-link--active' : ''}`}
            onClick={() => setActivePanel('analytics')}
          >
            Analytics
          </button>
          <button
            type="button"
            className={`admin-nav-link ${activePanel === 'logistics' ? 'admin-nav-link--active' : ''}`}
            onClick={() => setActivePanel('logistics')}
          >
            Logistics
          </button>
          <button
            type="button"
            className={`admin-nav-link ${activePanel === 'education' ? 'admin-nav-link--active' : ''}`}
            onClick={() => setActivePanel('education')}
          >
            Education
          </button>
          <button type="button" className="admin-nav-link" onClick={() => navigate('/admin/complaints')}>
            Compliance
          </button>
        </nav>

        <div className="admin-nav-actions">
          <button type="button" className="admin-logout-btn" onClick={handleAdminLogout}>Logout</button>
          <button type="button" className="admin-avatar" aria-label="Admin profile">A</button>
        </div>
      </header>

      <main className="admin-content">
        <section className="admin-hero">
          <div className="admin-hero-content">
            <p className="admin-hero-label">Live Operations</p>
            <h1>
              {activePanel === 'logistics'
                ? `Hello, ${adminName}. Chennai live map is backend-driven.`
                : activePanel === 'education'
                ? `Hello, ${adminName}. Manage educational content here.`
                : `Hello, ${adminName}. Chennai control dashboard is in sync.`}
            </h1>
            <p className="admin-hero-text">
              {activePanel === 'education'
                ? 'Upload YouTube videos to help users learn waste management practices.'
                : activePanel === 'logistics'
                ? 'Four closed-loop routes share one waste transfer facility, with one truck per route and continuous live updates.'
                : 'Manage logistics, education, and system health in real-time.'}
            </p>
          </div>
          <div className="admin-hero-glow" />
        </section>

        {activePanel !== 'education' && (
          <section className="admin-kpi-grid">
            <article className="admin-kpi-card">
              <div className="admin-kpi-head">
                <span className="admin-kpi-icon">R</span>
                <span className="admin-kpi-badge admin-kpi-badge--ok">Closed Loop</span>
              </div>
              <p>Active Routes</p>
              <h3>{liveSnapshot.stats?.activeRoutes || 0}</h3>
            </article>

            <article className="admin-kpi-card">
              <div className="admin-kpi-head">
                <span className="admin-kpi-icon">V</span>
              </div>
              <p>Active Vehicles</p>
              <h3>{liveSnapshot.stats?.activeVehicles || 0}</h3>
            </article>

            <article className="admin-kpi-card">
              <div className="admin-kpi-head">
                <span className="admin-kpi-icon">P</span>
                <span className="admin-kpi-badge admin-kpi-badge--ok">Live</span>
              </div>
              <p>Completed Pickups</p>
              <h3>{liveSnapshot.stats?.completedPickups || 0}</h3>
            </article>

            <article className="admin-kpi-card">
              <div className="admin-kpi-head">
                <span className="admin-kpi-icon">B</span>
                <span className="admin-kpi-badge admin-kpi-badge--danger">Priority</span>
              </div>
              <p>Bins Need Pickup</p>
              <h3>{liveSnapshot.stats?.binsNeedPickup || 0}</h3>
            </article>
          </section>
        )}

        {activePanel === 'education' ? (
          <AdminEducationManagement />
        ) : activePanel === 'analytics' ? (
          <section className="admin-main-grid">
            <div className="admin-activity-col">
              <div className="admin-section-head">
                <h2>Recent Activity</h2>
                <button type="button" onClick={() => setActivePanel('logistics')}>Open Live Logistics</button>
              </div>

              <div className="admin-timeline">
                {(liveSnapshot.recentActivity || []).map((item) => (
                  <article key={item.id} className="admin-timeline-item">
                    <div className={`admin-dot admin-dot--${item.tone || 'info'}`}>{item.tone === 'danger' ? '!' : '*'}</div>
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
                  <b>Live</b>
                </div>
                <p className="admin-health-sync">Updates every 2.5s from backend simulation stream</p>
              </article>

              <article className="admin-progress-card">
                <h3>Waste Reduction Progress</h3>
                <div className="admin-progress-track">
                  <span style={{ width: `${Math.min(100, Math.max(0, (liveSnapshot.stats?.completedPickups || 0) % 100))}%` }} />
                </div>
                <div className="admin-progress-meta">
                  <b>Live pickup cycle active</b>
                  <span>{liveSnapshot.city}</span>
                </div>
              </article>
            </aside>
          </section>
        ) : (
          <section className="admin-logistics-panel">
            <div className="admin-logistics-head">
              <div>
                <h2>Chennai Closed Route Logistics</h2>
                <p>All routes close back to one common transfer facility and trucks are updated by backend telemetry ticks.</p>
              </div>
            </div>

            {shouldShowLogisticsError && <p className="admin-logistics-error">{logisticsError}</p>}

            <div className="admin-toggle-grid">
              <article className="admin-toggle-card">
                <h4>Route Controls</h4>
                {(liveSnapshot.routes || []).map((route) => (
                  <div key={route.routeId} className="admin-toggle-row">
                    <span>{route.routeId} ({route.routeName})</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={route.isEnabled !== false}
                      aria-label={`Toggle ${route.routeName}`}
                      className={`admin-switch ${route.isEnabled !== false ? 'is-on' : 'is-off'}`}
                      disabled={Boolean(togglePending[`route:${route.routeId}`])}
                      onClick={() => toggleLiveOperation('route', route.routeId, !(route.isEnabled !== false))}
                    >
                      <span className="admin-switch-track">
                        <span className="admin-switch-thumb" />
                      </span>
                      <span className="admin-switch-text">{route.isEnabled !== false ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                ))}
              </article>

              <article className="admin-toggle-card">
                <h4>Truck Controls</h4>
                {(liveSnapshot.trucks || []).map((truck) => (
                  <div key={truck.vehicleId} className="admin-toggle-row">
                    <span>{truck.registrationNumber} ({truck.driverName})</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={truck.isEnabled !== false}
                      aria-label={`Toggle ${truck.registrationNumber}`}
                      className={`admin-switch ${truck.isEnabled !== false ? 'is-on' : 'is-off'}`}
                      disabled={Boolean(togglePending[`truck:${truck.vehicleId}`])}
                      onClick={() => toggleLiveOperation('truck', truck.vehicleId, !(truck.isEnabled !== false))}
                    >
                      <span className="admin-switch-track">
                        <span className="admin-switch-thumb" />
                      </span>
                      <span className="admin-switch-text">{truck.isEnabled !== false ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                ))}
              </article>
            </div>

            <div className="admin-logistics-map-wrap">
              <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {liveSnapshot.facility && (
                  <Marker
                    position={[liveSnapshot.facility.latitude, liveSnapshot.facility.longitude]}
                    icon={createFacilityIcon()}
                  >
                    <Tooltip direction="top" offset={[0, -34]} permanent>
                      {liveSnapshot.facility.name}
                    </Tooltip>
                    <Popup>
                      <strong>Waste Collection Facility</strong><br />
                      {liveSnapshot.facility.name}
                    </Popup>
                  </Marker>
                )}

                {(liveSnapshot.routes || []).map((route) => {
                  const closedPath = closePathIfNeeded(route.path || []);
                  const routeLine = closedPath.map((point) => [point.latitude, point.longitude]);
                  const isOperational = routeOperationalById[route.routeId] !== false;

                  if (routeLine.length < 2) {
                    return null;
                  }

                  return (
                    <div key={route.routeId}>
                      <Polyline
                        positions={routeLine}
                        pathOptions={{
                          color: isOperational ? route.color : '#9aa0a6',
                          weight: 6,
                          opacity: isOperational ? 0.82 : 0.45,
                        }}
                      />
                      {route.labelPoint && (
                        <Marker
                          position={[route.labelPoint.latitude, route.labelPoint.longitude]}
                          icon={createRouteLabelIcon(route.routeName, route.color, isOperational)}
                        />
                      )}
                    </div>
                  );
                })}

                {(liveSnapshot.bins || []).map((bin) => (
                  <Marker
                    key={bin.binId}
                    position={[bin.location.latitude, bin.location.longitude]}
                    icon={createBinIcon(bin.fillLevel)}
                  >
                    <Tooltip direction="top" offset={[0, -30]} permanent>
                      {bin.binId} • {bin.fillLevel}%
                    </Tooltip>
                    <Popup>
                      <strong>Dustbin:</strong> {bin.binId}<br />
                      <strong>Area:</strong> {bin.address?.street || 'N/A'}<br />
                      <strong>Fill:</strong> {bin.fillLevel}%<br />
                      <strong>Status:</strong> {bin.fillLevel === 0 ? 'Emptied by truck pass' : 'Pending pickup'}
                    </Popup>
                  </Marker>
                ))}

                {(liveSnapshot.trucks || []).map((truck) => {
                  const route = routesById[truck.routeId];
                  const isOperational = truck.isEnabled !== false && (route?.isEnabled !== false);
                  return (
                    <Marker
                      key={truck.vehicleId}
                      position={[truck.currentLocation.latitude, truck.currentLocation.longitude]}
                      icon={createTruckIcon(truck.registrationNumber, route?.color || '#005f14', isOperational)}
                    >
                      <Tooltip direction="right" offset={[12, -8]} permanent>
                        {truck.registrationNumber} • {truck.routeName} • {isOperational ? 'ON' : 'OFF'}
                      </Tooltip>
                      <Popup>
                        <strong>Truck:</strong> {truck.registrationNumber}<br />
                        <strong>Driver:</strong> {truck.driverName}<br />
                        <strong>Route:</strong> {truck.routeName}<br />
                        <strong>Speed:</strong> {truck.speedKmh} km/h<br />
                        <strong>State:</strong> {isOperational ? 'Running' : 'Paused'}
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            <div className="admin-logistics-table">
              <div className="admin-logistics-table-head">
                <span>Truck</span>
                <span>Driver</span>
                <span>Route Name</span>
                <span>Speed</span>
                <span>Live Position</span>
              </div>
              {(liveSnapshot.trucks || []).map((truck) => {
                const route = routesById[truck.routeId];
                const isOperational = truck.isEnabled !== false && (route?.isEnabled !== false);
                return (
                <button
                  key={truck.vehicleId}
                  type="button"
                  className={`admin-logistics-row ${selectedMappedTruck?.vehicleId === truck.vehicleId ? 'is-selected' : ''} ${isOperational ? '' : 'is-paused'}`}
                  onClick={() => setSelectedTruckId(truck.vehicleId)}
                >
                  <span>{truck.registrationNumber}</span>
                  <span>{truck.driverName}</span>
                  <span>{truck.routeName}</span>
                  <span>{isOperational ? `${truck.speedKmh} km/h` : 'Paused'}</span>
                  <span>{truck.currentLocation.latitude.toFixed(4)}, {truck.currentLocation.longitude.toFixed(4)}</span>
                </button>
                );
              })}
            </div>
          </section>
        )}
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
