import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Map, 
  TreePine, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Leaf, 
  Globe,
  RefreshCw,
  Satellite,
  BarChart3,
  MapPin,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';

// Demo plantation data with real Indian coordinates
const demoPlantations = [
  {
    id: 'PLT001',
    name: 'Sunderbans Mangrove Forest',
    coordinates: { lat: 21.9497, lng: 88.9468 },
    location: { state: 'West Bengal', district: 'South 24 Parganas' },
    owner: 'West Bengal Forest Dept',
    area: 45.2,
    carbonProduction: 125.8,
    status: 'healthy',
    growthRate: 92,
    co2Absorption: 4.2,
    species: 'Rhizophora mucronata, Avicennia marina',
    governmentId: 'WB-MG-001'
  },
  {
    id: 'PLT002',
    name: 'Western Ghats Reserve',
    coordinates: { lat: 9.9312, lng: 76.2673 },
    location: { state: 'Kerala', district: 'Idukki' },
    owner: 'Kerala Forest Corporation',
    area: 234.8,
    carbonProduction: 456.7,
    status: 'excellent',
    growthRate: 95,
    co2Absorption: 12.8,
    species: 'Tectona grandis, Dalbergia latifolia',
    governmentId: 'KL-WG-002'
  },
  {
    id: 'PLT003',
    name: 'Aravalli Hills Project',
    coordinates: { lat: 27.0238, lng: 74.2179 },
    location: { state: 'Rajasthan', district: 'Alwar' },
    owner: 'Rajasthan Afforestation Mission',
    area: 178.9,
    carbonProduction: 89.2,
    status: 'moderate',
    growthRate: 78,
    co2Absorption: 3.1,
    species: 'Acacia nilotica, Prosopis cineraria',
    governmentId: 'RJ-AR-003'
  },
  {
    id: 'PLT004',
    name: 'Eastern Ghats Conservation',
    coordinates: { lat: 11.1271, lng: 78.6569 },
    location: { state: 'Tamil Nadu', district: 'Salem' },
    owner: 'Tamil Nadu Forest Agency',
    area: 156.4,
    carbonProduction: 234.6,
    status: 'excellent',
    growthRate: 88,
    co2Absorption: 8.1,
    species: 'Santalum album, Pterocarpus santalinus',
    governmentId: 'TN-EG-004'
  },
  {
    id: 'PLT005',
    name: 'Satpura Bamboo Reserve',
    coordinates: { lat: 22.4707, lng: 77.9338 },
    location: { state: 'Madhya Pradesh', district: 'Hoshangabad' },
    owner: 'MP Forest Development Corp',
    area: 298.7,
    carbonProduction: 145.9,
    status: 'healthy',
    growthRate: 82,
    co2Absorption: 5.2,
    species: 'Dendrocalamus strictus, Bambusa bambos',
    governmentId: 'MP-ST-005'
  }
];

export function InteractiveMap() {
  const [plantations] = useState(demoPlantations);
  const [selectedPlantation, setSelectedPlantation] = useState(null);
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [carbonTrendData, setCarbonTrendData] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Dynamically import Leaflet to avoid SSR issues
        const L = (await import('leaflet')).default;
        
        // Import Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Initialize map
        const mapContainer = document.getElementById('interactive-map');
        if (mapContainer && !mapContainer.hasChildNodes()) {
          const map = L.map('interactive-map').setView([20.5937, 78.9629], 6);

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          // Add plantation markers
          plantations.forEach((plantation) => {
            const statusColor = getStatusColor(plantation.status);
            
            // Create custom marker HTML
            const markerHtml = `
              <div style="
                background-color: ${statusColor};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              "></div>
            `;

            const customIcon = L.divIcon({
              html: markerHtml,
              className: 'custom-plantation-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });

            const marker = L.marker([plantation.coordinates.lat, plantation.coordinates.lng], {
              icon: customIcon
            }).addTo(map);

            // Add popup
            const popupContent = `
              <div style="padding: 8px; min-width: 200px; font-family: system-ui, sans-serif;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${plantation.name}</h3>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Location:</strong> ${plantation.location.district}, ${plantation.location.state}</p>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Area:</strong> ${plantation.area} hectares</p>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Carbon:</strong> ${plantation.carbonProduction.toFixed(1)} tonnes CO2eq</p>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: 600; text-transform: uppercase;">${plantation.status}</span></p>
                <p style="margin: 2px 0; font-size: 12px;"><strong>Growth:</strong> ${plantation.growthRate}%</p>
                <p style="margin: 6px 0 0 0; font-size: 11px; color: #666;">Gov ID: ${plantation.governmentId}</p>
              </div>
            `;

            marker.bindPopup(popupContent);

            // Add click event
            marker.on('click', () => {
              setSelectedPlantation(plantation);
            });
          });

          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
        toast.error('Failed to load interactive map');
      }
    };

    initializeMap();
  }, []);

  // Generate real-time carbon data
  const generateCarbonTrendData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseCarbon = plantations.reduce((acc, p) => acc + p.carbonProduction, 0);
      const timeOfDay = time.getHours();
      
      // Realistic carbon absorption patterns (higher during daylight)
      const lightMultiplier = timeOfDay >= 6 && timeOfDay <= 18 ? 1.2 : 0.6;
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        totalCarbon: baseCarbon * lightMultiplier + (Math.random() - 0.5) * 20,
        co2Absorption: (baseCarbon / 20) * lightMultiplier + (Math.random() - 0.5) * 2,
        biomassGrowth: 15 + Math.sin(timeOfDay / 24 * Math.PI * 2) * 5 + Math.random() * 3
      });
    }
    return data;
  };

  // Real-time updates
  useEffect(() => {
    setCarbonTrendData(generateCarbonTrendData());

    if (!realTimeMode) return;

    const interval = setInterval(() => {
      setCarbonTrendData(generateCarbonTrendData());
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [realTimeMode]);

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: '#10b981',
      healthy: '#3b82f6',
      moderate: '#f59e0b',
      'at-risk': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const filteredPlantations = plantations.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const totalStats = plantations.reduce((acc, p) => ({
    totalArea: acc.totalArea + p.area,
    totalCarbon: acc.totalCarbon + p.carbonProduction,
    totalCO2: acc.totalCO2 + p.co2Absorption,
    avgGrowth: acc.avgGrowth + p.growthRate,
    totalPlantations: acc.totalPlantations + 1
  }), { totalArea: 0, totalCarbon: 0, totalCO2: 0, avgGrowth: 0, totalPlantations: 0 });

  totalStats.avgGrowth = totalStats.avgGrowth / plantations.length;

  const refreshData = () => {
    setCarbonTrendData(generateCarbonTrendData());
    setLastUpdate(new Date());
    toast.success('Live data refreshed successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interactive Plantation Map</h1>
          <p className="text-gray-600">Live demo of plantation tracking across India</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={realTimeMode} 
              onCheckedChange={setRealTimeMode}
              id="real-time"
            />
            <Label htmlFor="real-time">Live Updates</Label>
          </div>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Interactive Map</p>
                <p className="text-xs text-green-600">Live & Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Satellite className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Real-time Data</p>
                <p className="text-xs text-blue-600">Demo Mode</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-800">No Conflicts</p>
                <p className="text-xs text-purple-600">Stable & Fast</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Status */}
      {realTimeMode && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>LIVE: Demo updating every 30 seconds | Last update: {lastUpdate.toLocaleString()}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TreePine className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Demo Sites</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalPlantations}</p>
                <p className="text-xs text-gray-500">active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Area</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalArea.toFixed(0)}</p>
                <p className="text-xs text-gray-500">hectares</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Carbon Captured</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalCarbon.toFixed(0)}</p>
                <p className="text-xs text-gray-500">tonnes CO2eq</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Daily Absorption</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalCO2.toFixed(1)}</p>
                <p className="text-xs text-gray-500">tonnes/day</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Growth</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.avgGrowth.toFixed(0)}%</p>
                <p className="text-xs text-gray-500">efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Map className="h-5 w-5 mr-2" />
                Live Interactive Map
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
            <CardDescription>
              Click on markers to explore plantation details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div 
                id="interactive-map" 
                className="w-full h-96 rounded-lg border"
                style={{ minHeight: '400px' }}
              />
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading interactive map...</p>
                  </div>
                </div>
              )}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Excellent</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Healthy</span>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Moderate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plantation Details */}
        <Card>
          <CardHeader>
            <CardTitle>Plantation Details</CardTitle>
            <CardDescription>
              {selectedPlantation ? 'Selected Plantation' : `${filteredPlantations.length} Demo Sites`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedPlantation ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-2">{selectedPlantation.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Location:</strong> {selectedPlantation.location.district}, {selectedPlantation.location.state}</p>
                    <p><strong>Owner:</strong> {selectedPlantation.owner}</p>
                    <p><strong>Area:</strong> {selectedPlantation.area} hectares</p>
                    <p><strong>Species:</strong> {selectedPlantation.species}</p>
                    <p><strong>Carbon Production:</strong> {selectedPlantation.carbonProduction.toFixed(1)} tonnes CO2eq</p>
                    <p><strong>CO2 Absorption:</strong> {selectedPlantation.co2Absorption} tonnes/day</p>
                    <p><strong>Growth Rate:</strong> {selectedPlantation.growthRate}%</p>
                    <p><strong>Government ID:</strong> {selectedPlantation.governmentId}</p>
                  </div>
                  <div className="mt-3">
                    <Badge 
                      style={{ 
                        backgroundColor: getStatusColor(selectedPlantation.status) + '20', 
                        color: getStatusColor(selectedPlantation.status) 
                      }}
                    >
                      {selectedPlantation.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedPlantation(null)}
                  className="w-full"
                >
                  View All Plantations
                </Button>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3">
                {filteredPlantations.map((plantation) => (
                  <div
                    key={plantation.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedPlantation(plantation)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm truncate">{plantation.name}</h4>
                      <Badge 
                        variant="secondary" 
                        style={{ 
                          backgroundColor: getStatusColor(plantation.status) + '20', 
                          color: getStatusColor(plantation.status) 
                        }}
                      >
                        {plantation.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>{plantation.location.district}, {plantation.location.state}</p>
                      <p>{plantation.area} hectares • {plantation.carbonProduction.toFixed(1)} tonnes CO2eq</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Live Carbon Analytics</CardTitle>
          <CardDescription>Real-time carbon sequestration monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={carbonTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="totalCarbon" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
                name="Total Carbon (tonnes)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}