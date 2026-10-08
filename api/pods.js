import { Router } from 'express';

const router = Router();

const PODS_DATABASE = [
  {
    id: 'pod-activesg-delta',
    name: 'ActiveSG Delta Sports Centre & Gym',
    type: 'ActiveSG Gym',
    address: '900 Tiong Bahru Rd, Delta Sports Complex',
    zone: 'Central',
    distanceMinutesWalk: 2,
    hotStockTotal: 18,
    chillStockTotal: 38,
    chamberTempHot: 65.4,
    chamberTempChill: 3.2,
    lockersAvailable: 24
  },
  {
    id: 'pod-activesg-bishan',
    name: 'ActiveSG Bishan Sports Hall & Stadium',
    type: 'ActiveSG Gym',
    address: '5 Bishan St 14, Bishan Sports Hall Entrance',
    zone: 'Central',
    distanceMinutesWalk: 5,
    hotStockTotal: 12,
    chillStockTotal: 28,
    chamberTempHot: 66.1,
    chamberTempChill: 3.5,
    lockersAvailable: 16
  },
  {
    id: 'pod-marina-one',
    name: 'Marina One MRT Concourse (Exit B)',
    type: 'MRT Transit',
    address: '5 Straits View, Marina One East Tower B2 Pod',
    zone: 'South',
    distanceMinutesWalk: 3,
    hotStockTotal: 8,
    chillStockTotal: 22,
    chamberTempHot: 65.0,
    chamberTempChill: 3.1,
    lockersAvailable: 14
  },
  {
    id: 'pod-tampines-hub',
    name: 'Our Tampines Hub (Level 3 ActiveSG Gym)',
    type: 'Sports Hub',
    address: '1 Tampines Walk, Level 3 Fitness Pod corridor',
    zone: 'East',
    distanceMinutesWalk: 4,
    hotStockTotal: 16,
    chillStockTotal: 35,
    chamberTempHot: 65.8,
    chamberTempChill: 3.0,
    lockersAvailable: 22
  }
];

// GET /api/pods
router.get('/', (req, res) => {
  const { zone } = req.query;
  let results = [...PODS_DATABASE];
  if (zone && zone !== 'All') {
    results = results.filter((p) => p.zone === zone);
  }
  res.json({
    status: 'ok',
    count: results.length,
    pods: results
  });
});

// POST /api/pods/reserve
router.post('/reserve', (req, res) => {
  const { pod_id, meal_id, temperature } = req.body || {};
  const pod = PODS_DATABASE.find((p) => p.id === pod_id) || PODS_DATABASE[0];
  const bay = `BAY-${Math.floor(Math.random() * 8) + 1}0${Math.floor(Math.random() * 4) + 1}`;
  const pin = Math.floor(100000 + Math.random() * 900000).toString();

  res.json({
    status: 'confirmed',
    reservationId: `KF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    podName: pod.name,
    bayNumber: bay,
    pickupPin: pin,
    temperature: temperature || 'hot',
    instructions: 'Scan QR at pod or enter 6-digit PIN on locker touch screen.'
  });
});

export default router;
