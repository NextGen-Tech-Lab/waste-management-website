import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../utils/useAuth.js';
import routeService from '../services/routeService.js';
import './VehicleTracking.css';

const DEFAULT_CENTER = [13.0827, 80.2707];

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

const buildSegments = (path) => {
  const segments = [];
  let totalDistanceKm = 0;

  for (let index = 0; index < path.length - 1; index += 1) {
    const start = path[index];
    const end = path[index + 1];
    const distanceKm = getDistanceKm(start[0], start[1], end[0], end[1]);
    const cumulativeStartKm = totalDistanceKm;
    totalDistanceKm += distanceKm;

    segments.push({
      start,
      end,
      distanceKm,
      cumulativeStartKm,
      cumulativeEndKm: totalDistanceKm,
    });
  }

  return { segments, totalDistanceKm };
};

const projectProgressKm = (point, routeGeometry) => {
  if (!routeGeometry?.segments?.length || !point) {
    return 0;
  }

  const [pointLat, pointLng] = point;
  let best = { distance: Number.POSITIVE_INFINITY, progressKm: 0 };

  routeGeometry.segments.forEach((segment) => {
    const [startLat, startLng] = segment.start;
    const [endLat, endLng] = segment.end;

    const vx = endLng - startLng;
    const vy = endLat - startLat;
    const wx = pointLng - startLng;
    const wy = pointLat - startLat;

    const lengthSq = vx * vx + vy * vy;
    const t = lengthSq === 0 ? 0 : Math.max(0, Math.min(1, (wx * vx + wy * vy) / lengthSq));

    const projectedLng = startLng + t * vx;
    const projectedLat = startLat + t * vy;
    const distance = getDistanceKm(pointLat, pointLng, projectedLat, projectedLng);
    const progressKm = segment.cumulativeStartKm + segment.distanceKm * t;

    if (distance < best.distance) {
      best = { distance, progressKm };
    }
  });

  return best.progressKm;
};

const createTruckIcon = (label) =>
  L.divIcon({
    className: 'tracking-truck-icon-wrap',
    html: `<div class="tracking-marker tracking-marker--truck"><span class="tracking-marker-emoji">🚛</span><span class="tracking-marker-label">${label}</span></div>`,
    iconSize: [50, 50],
    iconAnchor: [25, 44],
    popupAnchor: [0, -36],
  });

const createBinIcon = (level) => {
  const fill = Math.max(0, Math.min(100, Number(level) || 0));
  const tone = fill >= 80 ? '#b42318' : fill >= 50 ? '#cc6f00' : '#137333';

  return L.divIcon({
    className: 'tracking-bin-icon-wrap',
    html: `<div class="tracking-marker tracking-marker--bin" style="border-color:${tone};"><span class="tracking-marker-emoji">🗑️</span><span class="tracking-marker-badge" style="background:${tone};">${fill}%</span></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 38],
    popupAnchor: [0, -30],
  });
};

const createFacilityIcon = () =>
  L.divIcon({
    className: 'tracking-facility-icon-wrap',
    html: '<div class="tracking-marker tracking-marker--facility"><span class="tracking-marker-emoji">🏭</span><span class="tracking-marker-label">MRF</span></div>',
    iconSize: [56, 56],
    iconAnchor: [28, 48],
    popupAnchor: [0, -40],
  });

const VehicleTracking = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liveSnapshot, setLiveSnapshot] = useState(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isCancelled = false;

    const fetchLive = async () => {
      try {
        const data = await routeService.getLogisticsLiveData('chennai');
        if (!isCancelled) {
          setLiveSnapshot(data);
          setError('');
        }
      } catch {
        if (!isCancelled) {
          setError('Unable to load live route tracking. Please check backend.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchLive();
    const intervalId = setInterval(fetchLive, 1000);

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [user]);

  const assignedRoute = useMemo(() => {
    const routes = liveSnapshot?.routes || [];
    if (!routes.length) {
      return null;
    }

    const key = String(user?._id || user?.id || user?.email || 'citizen');
    const index = hashToIndex(key, routes.length);
    return routes[index] || routes[0];
  }, [liveSnapshot?.routes, user]);

  const assignedTruck = useMemo(() => {
    if (!assignedRoute) {
      return null;
    }

    return (liveSnapshot?.trucks || []).find((truck) => truck.routeId === assignedRoute.routeId) || null;
  }, [liveSnapshot?.trucks, assignedRoute]);

  const routeBins = useMemo(() => {
    if (!assignedRoute?.binIds?.length) {
      return [];
    }

    return (liveSnapshot?.bins || []).filter((bin) => assignedRoute.binIds.includes(bin.binId));
  }, [liveSnapshot?.bins, assignedRoute]);

  const assignedBin = useMemo(() => {
    if (!routeBins.length) {
      return null;
    }

    const key = String(user?._id || user?.id || user?.email || 'citizen-bin');
    const index = hashToIndex(key, routeBins.length);
    return routeBins[index] || routeBins[0];
  }, [routeBins, user]);

  const routeLine = useMemo(() => {
    if (!assignedRoute?.path?.length) {
      return [];
    }

    return assignedRoute.path.map((point) => [point.latitude, point.longitude]);
  }, [assignedRoute]);

  const routeGeometry = useMemo(() => buildSegments(routeLine), [routeLine]);

  const eta = useMemo(() => {
    if (!assignedTruck?.currentLocation || !assignedBin?.location || routeGeometry.totalDistanceKm <= 0) {
      return null;
    }

    const truckPoint = [assignedTruck.currentLocation.latitude, assignedTruck.currentLocation.longitude];
    const binPoint = [assignedBin.location.latitude, assignedBin.location.longitude];

    const truckProgressKm = projectProgressKm(truckPoint, routeGeometry);
    const binProgressKm = projectProgressKm(binPoint, routeGeometry);

    let forwardDistanceKm = binProgressKm - truckProgressKm;
    if (forwardDistanceKm < 0) {
      forwardDistanceKm += routeGeometry.totalDistanceKm;
    }

    const speedKmh = Math.max(1, Number(assignedTruck.speedKmh) || 1);
    const minutes = Math.max(1, Math.ceil((forwardDistanceKm / speedKmh) * 60));

    return {
      minutes,
      forwardDistanceKm,
      speedKmh,
    };
  }, [assignedTruck, assignedBin, routeGeometry]);

  const mapCenter = useMemo(() => {
    if (assignedTruck?.currentLocation) {
      return [assignedTruck.currentLocation.latitude, assignedTruck.currentLocation.longitude];
    }

    if (assignedRoute?.path?.length) {
      return [assignedRoute.path[0].latitude, assignedRoute.path[0].longitude];
    }

    return DEFAULT_CENTER;
  }, [assignedTruck, assignedRoute]);

  if (!user) {
    return (
      <div className="tracking-page">
        <div className="tracking-loading">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <main className="tracking-page">
      <section className="tracking-hero">
        <p className="tracking-hero-label">Citizen Route Tracking</p>
        <h1>My Collection Route Live View</h1>
        <p>
          This page shows only your assigned collection route with truck movement, mapped bins, and estimated arrival time.
        </p>
      </section>

      {error && <p className="tracking-error">{error}</p>}

      {loading ? (
        <div className="tracking-loading">Loading route telemetry...</div>
      ) : (
        <section className="tracking-grid">
          <article className="tracking-card tracking-map-card">
            <h2>{assignedRoute ? `${assignedRoute.routeName} (${assignedRoute.routeId})` : 'Assigned Route'}</h2>
            <p className="tracking-subtitle">Material Recovery Facility, route path, all assigned bins, and live truck telemetry.</p>

            <div className="tracking-map-wrap">
              <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {liveSnapshot?.facility && (
                  <Marker
                    position={[liveSnapshot.facility.latitude, liveSnapshot.facility.longitude]}
                    icon={createFacilityIcon()}
                  >
                    <Tooltip direction="top" offset={[0, -32]} permanent>
                      Waste Collection Facility (MRF)
                    </Tooltip>
                    <Popup>
                      <strong>Material Recovery Facility</strong><br />
                      {liveSnapshot.facility.name}
                    </Popup>
                  </Marker>
                )}

                {routeLine.length > 1 && (
                  <Polyline positions={routeLine} pathOptions={{ color: '#0f7c21', weight: 6, opacity: 0.85 }} />
                )}

                {routeBins.map((bin) => (
                  <Marker
                    key={bin.binId}
                    position={[bin.location.latitude, bin.location.longitude]}
                    icon={createBinIcon(bin.fillLevel)}
                  >
                    <Tooltip direction="top" offset={[0, -24]} permanent>
                      {bin.binId}
                    </Tooltip>
                    <Popup>
                      <strong>Dustbin:</strong> {bin.binId}<br />
                      <strong>Area:</strong> {bin.address?.street || 'N/A'}<br />
                      <strong>Fill Level:</strong> {bin.fillLevel}%
                    </Popup>
                  </Marker>
                ))}

                {assignedTruck?.currentLocation && (
                  <Marker
                    position={[assignedTruck.currentLocation.latitude, assignedTruck.currentLocation.longitude]}
                    icon={createTruckIcon(assignedTruck.registrationNumber)}
                  >
                    <Tooltip direction="right" offset={[10, -6]} permanent>
                      {assignedTruck.registrationNumber}
                    </Tooltip>
                    <Popup>
                      <strong>Truck:</strong> {assignedTruck.registrationNumber}<br />
                      <strong>Driver:</strong> {assignedTruck.driverName}<br />
                      <strong>Mobile:</strong> {assignedTruck.driverContact || 'Not available'}<br />
                      <strong>Speed:</strong> {assignedTruck.speedKmh} km/h
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </article>

          <article className="tracking-card tracking-info-card">
            <h2>Route Details</h2>
            <div className="tracking-meta-row"><span>Driver</span><b>{assignedTruck?.driverName || 'Not available'}</b></div>
            <div className="tracking-meta-row"><span>Mobile</span><b>{assignedTruck?.driverContact || 'Not available'}</b></div>
            <div className="tracking-meta-row"><span>Vehicle</span><b>{assignedTruck?.registrationNumber || 'Not assigned'}</b></div>
            <div className="tracking-meta-row"><span>My Bin</span><b>{assignedBin?.binId || 'Not mapped'}</b></div>
            <div className="tracking-meta-row"><span>Truck Speed</span><b>{assignedTruck?.speedKmh || 0} km/h</b></div>
            <div className="tracking-meta-row"><span>ETA (route direction)</span><b>{eta ? `${eta.minutes} min` : 'Calculating...'}</b></div>
            <div className="tracking-meta-row"><span>Distance Ahead on Route</span><b>{eta ? `${eta.forwardDistanceKm.toFixed(2)} km` : 'N/A'}</b></div>
            <p className="tracking-note">
              ETA uses forward route distance on the closed loop, so if the truck moves away from your bin first,
              it includes the remaining loop distance before returning.
            </p>
          </article>

          <article className="tracking-card tracking-bins-card">
            <h2>Bins On My Route</h2>
            <div className="tracking-bin-list">
              {routeBins.map((bin) => (
                <div key={bin.binId} className="tracking-bin-row">
                  <b>{bin.binId}</b>
                  <span>{bin.address?.street || 'N/A'}</span>
                  <span>{bin.fillLevel}%</span>
                </div>
              ))}
              {!routeBins.length && <p className="tracking-empty">No bins assigned on this route yet.</p>}
            </div>
          </article>
        </section>
      )}
    </main>
  );
};

export default VehicleTracking;
