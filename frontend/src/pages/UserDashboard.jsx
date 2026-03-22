import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import routeService from '../services/routeService.js';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './UserDashboard.css';

const hashToIndex = (value, size) => {
  if (!value || size <= 0) {
    return 0;
  }

  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash % size;
};

const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const createCitizenTruckIcon = () =>
  L.divIcon({
    className: 'citizen-route-truck-wrap',
    html: '<div class="citizen-route-truck">🚛</div>',
    iconSize: [36, 36],
    iconAnchor: [18, 30],
    popupAnchor: [0, -24],
  });

const createCitizenBinIcon = () =>
  L.divIcon({
    className: 'citizen-route-bin-wrap',
    html: '<div class="citizen-route-bin">🗑️</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 28],
    popupAnchor: [0, -22],
  });

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', phone: '', address: '' });
  const [liveRouteData, setLiveRouteData] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const address = [
      user?.address?.street,
      user?.address?.city,
      user?.address?.state,
      user?.address?.zipcode,
    ]
      .filter(Boolean)
      .join(', ');

    const hydratedProfile = {
      name: user?.name || 'Citizen User',
      email: user?.email || 'not-available@example.com',
      phone: user?.phone || '+91 00000 00000',
      address: address || 'Address not available',
      citizenId: user?._id ? `#${String(user._id).slice(0, 8).toUpperCase()}` : '#IND-0000',
    };

    setProfile(hydratedProfile);
    setEditFormData({
      name: hydratedProfile.name,
      phone: hydratedProfile.phone,
      address: hydratedProfile.address,
    });
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isCancelled = false;

    const fetchLiveRoute = async () => {
      try {
        const snapshot = await routeService.getLogisticsLiveData('chennai');
        if (!isCancelled) {
          setLiveRouteData(snapshot);
        }
      } catch {
        if (!isCancelled) {
          setError('Unable to load your live route details right now.');
        }
      }
    };

    fetchLiveRoute();
    const timerId = setInterval(fetchLiveRoute, 3000);

    return () => {
      isCancelled = true;
      clearInterval(timerId);
    };
  }, [user]);

  const firstName = useMemo(() => {
    if (!profile?.name) {
      return 'Citizen';
    }
    return profile.name.split(' ')[0];
  }, [profile]);

  const stats = useMemo(
    () => ({
      wasteCollected: '142kg',
      complaintsSubmitted: 12,
      openComplaints: 2,
      resolvedComplaints: 10,
      nearestBinDistance: '120m',
    }),
    []
  );

  const assignedRoute = useMemo(() => {
    const routes = liveRouteData?.routes || [];
    if (!routes.length) {
      return null;
    }

    const key = String(user?._id || user?.id || user?.email || 'citizen');
    const routeIndex = hashToIndex(key, routes.length);
    return routes[routeIndex] || routes[0];
  }, [liveRouteData?.routes, user]);

  const assignedTruck = useMemo(() => {
    const trucks = liveRouteData?.trucks || [];
    if (!assignedRoute) {
      return null;
    }

    return trucks.find((truck) => truck.routeId === assignedRoute.routeId) || null;
  }, [liveRouteData?.trucks, assignedRoute]);

  const assignedBin = useMemo(() => {
    const bins = liveRouteData?.bins || [];
    if (!assignedRoute || !assignedRoute.binIds?.length || !bins.length) {
      return null;
    }

    const routeBins = bins.filter((bin) => assignedRoute.binIds.includes(bin.binId));
    if (!routeBins.length) {
      return null;
    }

    const key = String(user?._id || user?.id || user?.email || 'citizen-bin');
    const index = hashToIndex(key, routeBins.length);
    return routeBins[index] || routeBins[0];
  }, [liveRouteData?.bins, assignedRoute, user]);

  const routeEta = useMemo(() => {
    if (!assignedTruck?.currentLocation || !assignedBin?.location) {
      return null;
    }

    const distanceKm = getDistanceKm(
      assignedTruck.currentLocation.latitude,
      assignedTruck.currentLocation.longitude,
      assignedBin.location.latitude,
      assignedBin.location.longitude
    );

    const speedKmh = Math.max(1, Number(assignedTruck.speedKmh) || 1);
    const minutes = Math.ceil((distanceKm / speedKmh) * 60);
    return {
      distanceKm,
      minutes: Math.max(1, minutes),
    };
  }, [assignedTruck, assignedBin]);

  const routeMapCenter = useMemo(() => {
    if (assignedTruck?.currentLocation) {
      return [assignedTruck.currentLocation.latitude, assignedTruck.currentLocation.longitude];
    }
    if (assignedRoute?.path?.length) {
      return [assignedRoute.path[0].latitude, assignedRoute.path[0].longitude];
    }
    return [13.0827, 80.2707];
  }, [assignedTruck, assignedRoute]);

  const assignedRouteLine = useMemo(() => {
    if (!assignedRoute?.path?.length) {
      return [];
    }

    return assignedRoute.path.map((point) => [point.latitude, point.longitude]);
  }, [assignedRoute]);

  const activities = useMemo(
    () => [
      {
        id: 'a1',
        status: 'success',
        title: 'Complaint Resolved',
        desc: 'Issue #8812 - Street cleaning completed.',
        time: '2 hours ago',
      },
      {
        id: 'a2',
        status: 'info',
        title: 'Pickup Scheduled',
        desc: 'Bulk waste pickup confirmed for Saturday.',
        time: 'Yesterday',
      },
      {
        id: 'a3',
        status: 'reward',
        title: 'Earned Points',
        desc: '50 Eco-Points added for correct segregation.',
        time: '2 days ago',
      },
    ],
    []
  );

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isSubmittingEdit) {
      setIsEditModalOpen(false);
    }
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    if (!editFormData.name.trim() || !editFormData.phone.trim() || !editFormData.address.trim()) {
      setError('Please fill all profile fields before saving.');
      return;
    }

    setIsSubmittingEdit(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProfile((prev) => ({
        ...(prev || {}),
        name: editFormData.name.trim(),
        phone: editFormData.phone.trim(),
        address: editFormData.address.trim(),
      }));
      setIsEditModalOpen(false);
    } catch {
      setError('Unable to save profile right now. Please try again.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <main className="dashboard-container">
      <section className="welcome-hero">
        <div className="dashboard-content">
          <h1>Namaste, {firstName}!</h1>
          <p>
            Your contribution to a cleaner India matters. You&apos;ve helped divert <strong>{stats.wasteCollected}</strong>{' '}
            of waste from landfills this month.
          </p>
        </div>
      </section>

      <div className="dashboard-content">
        {error && (
          <div className="error-banner">
            <span className="error-icon">!</span>
            <div className="error-content">
              <p className="error-title">Unable to sync latest data</p>
              <p className="error-message">{error}</p>
            </div>
            <button className="error-close" onClick={() => setError(null)} aria-label="Close error banner">
              x
            </button>
          </div>
        )}

        <div className="dashboard-grid">
          <aside className="left-column">
            <div className="card profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <span className="avatar-icon">C</span>
                </div>
                <div className="profile-meta">
                  <h2>{profile?.name}</h2>
                  <p className="citizen-id">Verified Citizen ID: {profile?.citizenId}</p>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-icon">@</span>
                  <div>
                    <label>Email Address</label>
                    <p>{profile?.email}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">T</span>
                  <div>
                    <label>Phone</label>
                    <p>{profile?.phone}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">L</span>
                  <div>
                    <label>Address</label>
                    <p>{profile?.address}</p>
                  </div>
                </div>
              </div>

              <button className="btn-edit" onClick={handleEditProfile} aria-label="Edit profile information">
                Edit Profile
              </button>
            </div>

            <div className="card status-card">
              <div className="status-header">
                <h3>Route Status</h3>
                <span className="status-badge">{assignedTruck?.status === 'paused' ? 'Paused' : 'On Track'}</span>
              </div>
              <div className="status-content">
                <p className="vehicle-id">Collection Vehicle {assignedTruck?.registrationNumber || 'Loading...'}</p>
                <p className="status-eta">ETA: {routeEta ? `${routeEta.minutes} min` : 'Calculating...'}</p>
              </div>
              <div className="status-driver-panel">
                <p><strong>Driver:</strong> {assignedTruck?.driverName || 'Not assigned'}</p>
                <p><strong>Mobile:</strong> {assignedTruck?.driverContact || 'Not available'}</p>
                <p><strong>Your Bin:</strong> {assignedBin?.binId || 'Not mapped yet'}</p>
              </div>
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: routeEta ? `${Math.max(8, Math.min(100, 100 - routeEta.distanceKm * 24))}%` : '16%' }} />
                </div>
                <p className="status-location">
                  {routeEta
                    ? `Truck is ${routeEta.distanceKm.toFixed(2)} km away from your mapped bin.`
                    : 'Fetching live location from your assigned route.'}
                </p>
              </div>
            </div>
          </aside>

          <section className="main-column">
            <div className="card citizen-route-card">
              <h3 className="card-title">My Route Live Map</h3>
              {assignedRoute && assignedTruck ? (
                <>
                  <p className="citizen-route-caption">
                    Showing only your assigned route: {assignedRoute.routeName} ({assignedRoute.routeId})
                  </p>
                  <div className="citizen-route-map-wrap">
                    <MapContainer center={routeMapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {assignedRouteLine.length > 1 && (
                        <Polyline positions={assignedRouteLine} pathOptions={{ color: '#0f7c21', weight: 6, opacity: 0.85 }} />
                      )}
                      <Marker
                        position={[assignedTruck.currentLocation.latitude, assignedTruck.currentLocation.longitude]}
                        icon={createCitizenTruckIcon()}
                      >
                        <Popup>
                          <strong>{assignedTruck.registrationNumber}</strong><br />
                          Driver: {assignedTruck.driverName}<br />
                          Mobile: {assignedTruck.driverContact || 'Not available'}<br />
                          ETA to your bin: {routeEta ? `${routeEta.minutes} min` : 'Calculating'}
                        </Popup>
                      </Marker>
                      {assignedBin?.location && (
                        <Marker position={[assignedBin.location.latitude, assignedBin.location.longitude]} icon={createCitizenBinIcon()}>
                          <Popup>
                            <strong>Your Bin:</strong> {assignedBin.binId}<br />
                            Area: {assignedBin.address?.street || 'N/A'}
                          </Popup>
                        </Marker>
                      )}
                    </MapContainer>
                  </div>
                </>
              ) : (
                <p className="citizen-route-caption">Loading your assigned route and live truck details...</p>
              )}
            </div>

            <div className="card">
              <h3 className="card-title">Quick Actions</h3>
              <div className="actions-grid">
                <button className="action-card" onClick={() => handleNavigate('/user/bins')}>
                  <span className="action-icon">📍</span>
                  <span className="action-label">Locate Bins</span>
                  <span className="action-desc">Find nearby disposal points</span>
                </button>
                <button className="action-card" onClick={() => handleNavigate('/user/tracking')}>
                  <span className="action-icon">🚚</span>
                  <span className="action-label">Track Vehicle</span>
                  <span className="action-desc">Live garbage truck route</span>
                </button>
                <button className="action-card" onClick={() => handleNavigate('/user/complaints')}>
                  <span className="action-icon">❗</span>
                  <span className="action-label">Lodge Complaint</span>
                  <span className="action-desc">Report littering or spills</span>
                </button>
                <button className="action-card" onClick={() => handleNavigate('/education')}>
                  <span className="action-icon">📘</span>
                  <span className="action-label">Waste Education</span>
                  <span className="action-desc">Sorting and recycling guide</span>
                </button>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <p className="metric-label">Complaints</p>
                <p className="metric-value">{stats.complaintsSubmitted}</p>
                <p className="metric-sublabel">Total</p>
              </div>
              <div className="metric-card metric-card--alert">
                <p className="metric-label">Open Issues</p>
                <p className="metric-value">{stats.openComplaints}</p>
                <p className="metric-sublabel">Action Req</p>
              </div>
              <div className="metric-card">
                <p className="metric-label">Resolved</p>
                <p className="metric-value">{stats.resolvedComplaints}</p>
                <p className="metric-sublabel">Completed</p>
              </div>
              <div className="metric-card">
                <p className="metric-label">Nearest Bin</p>
                <p className="metric-value">{stats.nearestBinDistance}</p>
                <p className="metric-sublabel">Distance</p>
              </div>
            </div>

            <div className="card impact-card">
              <h3 className="card-title">Community Impact Rank</h3>
              <div className="impact-container">
                <div className="impact-bar">
                  <div className="impact-fill" style={{ width: '80%' }}>
                    <span className="impact-label">Top 20%</span>
                  </div>
                </div>
                <div className="impact-legend">
                  <span>Novice</span>
                  <span>Eco-Warrior</span>
                  <span>Ambassador</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Tools & Calculators</h3>
              <div className="tools-grid">
                <button className="action-card" onClick={() => handleNavigate('/calculator/carbon-footprint')}>
                  <span className="action-icon">🌱</span>
                  <span className="action-label">Carbon Footprint</span>
                  <span className="action-desc">Calculate your emissions</span>
                </button>
                <button className="action-card" onClick={() => handleNavigate('/calculator/waste-tracker')}>
                  <span className="action-icon">📊</span>
                  <span className="action-label">Waste Tracker</span>
                  <span className="action-desc">Monitor waste production</span>
                </button>
                <button className="action-card" onClick={() => handleNavigate('/calculator/recycling-rate')}>
                  <span className="action-icon">♻️</span>
                  <span className="action-label">Recycling Rate</span>
                  <span className="action-desc">Track recycling progress</span>
                </button>
                <button className="action-card" onClick={() => handleNavigate('/calculator/composting')}>
                  <span className="action-icon">🌾</span>
                  <span className="action-label">Composting</span>
                  <span className="action-desc">Estimate compost yield</span>
                </button>
                <button className="action-card" onClick={() => handleNavigate('/calculator/plastic-reduction')}>
                  <span className="action-icon">🛑</span>
                  <span className="action-label">Plastic Reduction</span>
                  <span className="action-desc">Reduce plastic usage</span>
                </button>
                <button className="action-card" onClick={() => handleNavigate('/calculator/waste-segregation')}>
                  <span className="action-icon">🗑️</span>
                  <span className="action-label">Waste Segregation</span>
                  <span className="action-desc">Learn proper sorting</span>
                </button>
              </div>
            </div>
          </section>

          <aside className="right-column">
            <div className="card">
              <h3 className="card-title">Recent Activity</h3>
              <div className="activity-list">
                {activities.map((item) => (
                  <div key={item.id} className="activity-item">
                    <div className={`activity-dot activity-dot--${item.status}`}>{item.status === 'success' ? 'V' : '.'}</div>
                    <div className="activity-content">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                      <span className="activity-time">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-link" onClick={() => handleNavigate('/user/complaints')}>
                View All Activity
              </button>
            </div>

            <div className="card help-card">
              <h3>Need Assistance?</h3>
              <p className="help-text">
                If your complaint has not been addressed within 48 hours, you can escalate it to the Nodal Officer.
              </p>
              <button className="btn-escalate" onClick={() => handleNavigate('/user/complaints')}>
                Raise Escalation
              </button>
            </div>

            <button className="btn-save" onClick={handleLogout}>
              Logout
            </button>
          </aside>
        </div>

        {isEditModalOpen && (
          <div className="modal-backdrop" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Edit Profile</h2>
                <button className="modal-close" onClick={handleCloseModal} aria-label="Close modal">
                  x
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label htmlFor="edit-name">Full Name</label>
                  <input
                    id="edit-name"
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-phone">Phone Number</label>
                  <input
                    id="edit-phone"
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-address">Residential Address</label>
                  <textarea
                    id="edit-address"
                    name="address"
                    rows="3"
                    value={editFormData.address}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={handleCloseModal} disabled={isSubmittingEdit}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save" disabled={isSubmittingEdit}>
                    {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default UserDashboard;
