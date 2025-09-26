import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { 
  Map, 
  TreePine, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Leaf, 
  Globe,
  Filter,
  RefreshCw,
  Satellite,
  BarChart3,
  MapPin,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner@2.0.3';

// Mock plantation data with realistic Indian locations
const mockPlantations = [
  {
    id: 'PLT001',
    name: 'Sunderbans Mangrove Project',
    location: { lat: 21.9497, lng: 88.9468, state: 'West Bengal', district: 'South 24 Parganas' },
    owner: 'Radhika Sharma',
    area: 45.2,
    plantedDate: '2023-08-15',
    species: 'Mangrove (Rhizophora)',
    carbonProduction: 125.8,
    carbonTrend: 'increasing',
    status: 'healthy',
    lastUpdated: new Date(),
    soilPH: 7.2,
    moisture: 68,
    temperature: 28.5,
    co2Absorption: 4.2,
    biomass: 85.6,
    growthRate: 92
  },
  {
    id: 'PLT002',
    name: 'Kerala Coconut Carbon Farm',
    location: { lat: 9.9312, lng: 76.2673, state: 'Kerala', district: 'Kochi' },
    owner: 'Arjun Menon',
    area: 78.5,
    plantedDate: '2023-06-10',
    species: 'Coconut Palm',
    carbonProduction: 198.4,
    carbonTrend: 'stable',
    status: 'excellent',
    lastUpdated: new Date(),
    soilPH: 6.8,
    moisture: 72,
    temperature: 31.2,
    co2Absorption: 6.8,
    biomass: 142.3,
    growthRate: 95
  },
  {
    id: 'PLT003',
    name: 'Punjab Eucalyptus Plantation',
    location: { lat: 31.6340, lng: 74.8723, state: 'Punjab', district: 'Amritsar' },
    owner: 'Simran Kaur',
    area: 32.1,
    plantedDate: '2024-01-20',
    species: 'Eucalyptus',
    carbonProduction: 89.2,
    carbonTrend: 'increasing',
    status: 'moderate',
    lastUpdated: new Date(),
    soilPH: 7.5,
    moisture: 45,
    temperature: 24.8,
    co2Absorption: 3.1,
    biomass: 52.8,
    growthRate: 78
  },
  {
    id: 'PLT004',
    name: 'Rajasthan Desert Greening',
    location: { lat: 27.0238, lng: 74.2179, state: 'Rajasthan', district: 'Ajmer' },
    owner: 'Vikram Singh',
    area: 156.7,
    plantedDate: '2023-03-12',
    species: 'Desert Oak & Mesquite',
    carbonProduction: 67.3,
    carbonTrend: 'decreasing',
    status: 'at-risk',
    lastUpdated: new Date(),
    soilPH: 8.1,
    moisture: 22,
    temperature: 38.5,
    co2Absorption: 2.4,
    biomass: 38.9,
    growthRate: 65
  },
  {
    id: 'PLT005',
    name: 'Tamil Nadu Teak Forest',
    location: { lat: 11.1271, lng: 78.6569, state: 'Tamil Nadu', district: 'Salem' },
    owner: 'Priya Krishnan',
    area: 92.8,
    plantedDate: '2022-11-05',
    species: 'Teak (Tectona grandis)',
    carbonProduction: 234.6,
    carbonTrend: 'increasing',
    status: 'excellent',
    lastUpdated: new Date(),
    soilPH: 6.9,
    moisture: 58,
    temperature: 29.3,
    co2Absorption: 8.1,
    biomass: 189.4,
    growthRate: 88
  },
  {
    id: 'PLT006',
    name: 'Maharashtra Bamboo Grove',
    location: { lat: 19.7515, lng: 75.7139, state: 'Maharashtra', district: 'Aurangabad' },
    owner: 'Ravi Patil',
    area: 67.3,
    plantedDate: '2023-09-28',
    species: 'Bamboo (Dendrocalamus)',
    carbonProduction: 145.9,
    carbonTrend: 'stable',
    status: 'healthy',
    lastUpdated: new Date(),
    soilPH: 7.1,
    moisture: 55,
    temperature: 26.7,
    co2Absorption: 5.2,
    biomass: 98.7,
    growthRate: 82
  }
];

// Mock real-time carbon data
const generateCarbonTrendData = () => {
  const now = new Date();
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      totalCarbon: 850 + Math.random() * 100,
      co2Absorption: 25 + Math.random() * 10,
      biomassGrowth: 15 + Math.random() * 8
    });
  }
  return data;
};

// Mock environmental data from Indian meteorological sources
const generateEnvironmentalData = () => ([
  { region: 'North India', aqi: 180, temperature: 28.5, humidity: 45, rainfall: 12 },
  { region: 'South India', aqi: 95, temperature: 31.2, humidity: 72, rainfall: 28 },
  { region: 'East India', aqi: 165, temperature: 29.8, humidity: 78, rainfall: 35 },
  { region: 'West India', aqi: 125, temperature: 32.1, humidity: 55, rainfall: 8 },
  { region: 'Central India', aqi: 140, temperature: 30.4, humidity: 62, rainfall: 18 }
]);

const statusColors = {
  excellent: 'bg-green-500',
  healthy: 'bg-blue-500',
  moderate: 'bg-yellow-500',
  'at-risk': 'bg-red-500'
};

const trendIcons = {
  increasing: TrendingUp,
  stable: Activity,
  decreasing: TrendingDown
};

export function PlantationTracker() {
  const [plantations, setPlantations] = useState(mockPlantations);
  const [selectedPlantation, setSelectedPlantation] = useState(null);
  const [carbonTrendData, setCarbonTrendData] = useState(generateCarbonTrendData());
  const [environmentalData, setEnvironmentalData] = useState(generateEnvironmentalData());
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeMode) return;

    const interval = setInterval(() => {
      setCarbonTrendData(generateCarbonTrendData());
      setEnvironmentalData(generateEnvironmentalData());
      setLastUpdate(new Date());
      
      // Update plantation data with small variations
      setPlantations(prev => prev.map(p => ({
        ...p,
        carbonProduction: p.carbonProduction + (Math.random() - 0.5) * 2,
        co2Absorption: p.co2Absorption + (Math.random() - 0.5) * 0.2,
        biomass: p.biomass + (Math.random() - 0.5) * 1,
        temperature: p.temperature + (Math.random() - 0.5) * 0.5,
        moisture: Math.max(0, Math.min(100, p.moisture + (Math.random() - 0.5) * 2)),
        lastUpdated: new Date()
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [realTimeMode]);

  const filteredPlantations = plantations.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    if (filterRegion !== 'all' && p.location.state !== filterRegion) return false;
    return true;
  });

  const totalStats = plantations.reduce((acc, p) => ({
    totalArea: acc.totalArea + p.area,
    totalCarbon: acc.totalCarbon + p.carbonProduction,
    totalCO2: acc.totalCO2 + p.co2Absorption,
    avgGrowth: acc.avgGrowth + p.growthRate
  }), { totalArea: 0, totalCarbon: 0, totalCO2: 0, avgGrowth: 0 });

  totalStats.avgGrowth = totalStats.avgGrowth / plantations.length;

  const refreshData = () => {
    setCarbonTrendData(generateCarbonTrendData());
    setEnvironmentalData(generateEnvironmentalData());
    setLastUpdate(new Date());
    toast.success('Data refreshed successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Plantation Tracking</h2>
          <p className="text-gray-600">Real-time monitoring of carbon plantations across India</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={realTimeMode} 
              onCheckedChange={setRealTimeMode}
              id="real-time"
            />
            <Label htmlFor="real-time">Real-time Updates</Label>
          </div>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Status Indicator */}
      {realTimeMode && (
        <div className="flex items-center justify-center bg-green-50 border border-green-200 rounded-lg p-2">
          <div className="flex items-center space-x-2 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">LIVE</span>
            <span className="text-xs">Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TreePine className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Area</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalArea.toFixed(1)}</p>
                <p className="text-xs text-gray-500">hectares</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Carbon Production</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalCarbon.toFixed(1)}</p>
                <p className="text-xs text-gray-500">tonnes CO2eq</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">CO2 Absorption</p>
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
                <p className="text-sm font-medium text-gray-600">Avg Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.avgGrowth.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="map" className="space-y-6">
        <TabsList>
          <TabsTrigger value="map">
            <Map className="h-4 w-4 mr-2" />
            Live Map
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="plantations">
            <TreePine className="h-4 w-4 mr-2" />
            Plantations
          </TabsTrigger>
          <TabsTrigger value="environmental">
            <Satellite className="h-4 w-4 mr-2" />
            Environmental
          </TabsTrigger>
        </TabsList>

        {/* Live Map Tab */}
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2" />
                Interactive Plantation Map
              </CardTitle>
              <CardDescription>
                Real-time view of all carbon plantations across India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-sm font-medium">Filters:</span>
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
                      <SelectItem value="at-risk">At Risk</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterRegion} onValueChange={setFilterRegion}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="West Bengal">West Bengal</SelectItem>
                      <SelectItem value="Kerala">Kerala</SelectItem>
                      <SelectItem value="Punjab">Punjab</SelectItem>
                      <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    </SelectContent>
                  </Select>

                  <Badge variant="outline" className="ml-auto">
                    {filteredPlantations.length} plantations shown
                  </Badge>
                </div>

                {/* Map Placeholder with Plantation Markers */}
                <div className="relative h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                  <div className="absolute inset-0 bg-green-100 opacity-20"></div>
                  
                  {/* Map Background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">Interactive Map View</p>
                      <p className="text-sm text-gray-500">Plantation locations across India</p>
                    </div>
                  </div>

                  {/* Plantation Markers */}
                  {filteredPlantations.map((plantation, index) => (
                    <div
                      key={plantation.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
                      style={{
                        left: `${20 + (index % 3) * 25 + Math.random() * 10}%`,
                        top: `${25 + Math.floor(index / 3) * 20 + Math.random() * 10}%`
                      }}
                      onClick={() => setSelectedPlantation(plantation)}
                    >
                      <div className={`w-4 h-4 rounded-full ${statusColors[plantation.status]} shadow-lg animate-pulse`}></div>
                      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
                        <p className="font-medium text-sm">{plantation.name}</p>
                        <p className="text-xs text-gray-600">{plantation.carbonProduction.toFixed(1)} tonnes CO2eq</p>
                        <p className="text-xs text-gray-500">{plantation.location.state}</p>
                      </div>
                    </div>
                  ))}

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
                    <h4 className="font-medium text-sm mb-2">Status Legend</h4>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs">Excellent</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs">Healthy</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-xs">Moderate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs">At Risk</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Plantation Details */}
                {selectedPlantation && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{selectedPlantation.name}</span>
                        <Badge variant={selectedPlantation.status === 'excellent' ? 'default' : 'secondary'}>
                          {selectedPlantation.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {selectedPlantation.location.district}, {selectedPlantation.location.state}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Carbon Production</p>
                          <p className="text-lg font-bold text-green-600">{selectedPlantation.carbonProduction.toFixed(1)} tonnes</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Area</p>
                          <p className="text-lg font-bold">{selectedPlantation.area} hectares</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                          <p className="text-lg font-bold text-blue-600">{selectedPlantation.growthRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Species</p>
                          <p className="text-sm">{selectedPlantation.species}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Carbon Production Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time Carbon Production</CardTitle>
                <CardDescription>24-hour carbon absorption trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={carbonTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalCarbon" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="co2Absorption" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Plantation Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Plantation Performance Distribution</CardTitle>
                <CardDescription>Carbon production by plantation status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { status: 'Excellent', count: plantations.filter(p => p.status === 'excellent').length, carbon: plantations.filter(p => p.status === 'excellent').reduce((acc, p) => acc + p.carbonProduction, 0) },
                    { status: 'Healthy', count: plantations.filter(p => p.status === 'healthy').length, carbon: plantations.filter(p => p.status === 'healthy').reduce((acc, p) => acc + p.carbonProduction, 0) },
                    { status: 'Moderate', count: plantations.filter(p => p.status === 'moderate').length, carbon: plantations.filter(p => p.status === 'moderate').reduce((acc, p) => acc + p.carbonProduction, 0) },
                    { status: 'At Risk', count: plantations.filter(p => p.status === 'at-risk').length, carbon: plantations.filter(p => p.status === 'at-risk').reduce((acc, p) => acc + p.carbonProduction, 0) }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="carbon" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Growth Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Biomass Growth Trends</CardTitle>
                <CardDescription>Real-time biomass accumulation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={carbonTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="biomassGrowth" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Plantations</CardTitle>
                <CardDescription>Highest carbon production rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plantations
                    .sort((a, b) => b.carbonProduction - a.carbonProduction)
                    .slice(0, 5)
                    .map((plantation, index) => (
                      <div key={plantation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{plantation.name}</p>
                            <p className="text-sm text-gray-600">{plantation.location.state}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{plantation.carbonProduction.toFixed(1)}</p>
                          <p className="text-xs text-gray-500">tonnes CO2eq</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Plantations List Tab */}
        <TabsContent value="plantations">
          <Card>
            <CardHeader>
              <CardTitle>Plantation Details</CardTitle>
              <CardDescription>Comprehensive list of all tracked plantations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlantations.map((plantation) => {
                  const TrendIcon = trendIcons[plantation.carbonTrend];
                  return (
                    <Card key={plantation.id} className="border-l-4" style={{ borderLeftColor: statusColors[plantation.status].replace('bg-', '#') }}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plantation.name}</CardTitle>
                          <Badge variant={plantation.status === 'excellent' ? 'default' : 'secondary'}>
                            {plantation.status}
                          </Badge>
                        </div>
                        <CardDescription>
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {plantation.location.district}, {plantation.location.state}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-gray-600">Carbon Production</p>
                            <div className="flex items-center space-x-1">
                              <p className="font-bold text-green-600">{plantation.carbonProduction.toFixed(1)}</p>
                              <TrendIcon className={`h-4 w-4 ${plantation.carbonTrend === 'increasing' ? 'text-green-500' : plantation.carbonTrend === 'decreasing' ? 'text-red-500' : 'text-gray-500'}`} />
                            </div>
                            <p className="text-xs text-gray-500">tonnes CO2eq</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-600">Growth Rate</p>
                            <p className="font-bold text-blue-600">{plantation.growthRate}%</p>
                            <p className="text-xs text-gray-500">efficiency</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>CO2 Absorption:</span>
                            <span className="font-medium">{plantation.co2Absorption.toFixed(1)} t/day</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Biomass:</span>
                            <span className="font-medium">{plantation.biomass.toFixed(1)} tonnes</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Area:</span>
                            <span className="font-medium">{plantation.area} hectares</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Species:</span>
                            <span className="font-medium text-xs">{plantation.species}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-xs font-medium text-gray-600">Temp</p>
                              <p className="text-sm font-bold">{plantation.temperature.toFixed(1)}°C</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-600">Moisture</p>
                              <p className="text-sm font-bold">{plantation.moisture}%</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-600">Soil pH</p>
                              <p className="text-sm font-bold">{plantation.soilPH}</p>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          Last updated: {plantation.lastUpdated.toLocaleTimeString()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Environmental Data Tab */}
        <TabsContent value="environmental">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Satellite className="h-5 w-5 mr-2" />
                  Environmental Conditions by Region
                </CardTitle>
                <CardDescription>Real-time environmental data across India</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {environmentalData.map((region, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{region.region}</h4>
                        <Badge variant={region.aqi < 100 ? 'default' : region.aqi < 150 ? 'secondary' : 'destructive'}>
                          AQI: {region.aqi}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">Temperature</p>
                          <p className="text-lg font-bold text-orange-600">{region.temperature}°C</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">Humidity</p>
                          <p className="text-lg font-bold text-blue-600">{region.humidity}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-600">Rainfall</p>
                          <p className="text-lg font-bold text-green-600">{region.rainfall}mm</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Air Quality vs Carbon Production</CardTitle>
                <CardDescription>Correlation between environmental conditions and plantation performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={environmentalData.map((region, i) => ({
                    ...region,
                    carbonEfficiency: plantations
                      .filter(p => p.location.state.includes(region.region.split(' ')[0]))
                      .reduce((acc, p) => acc + p.growthRate, 0) / 
                      plantations.filter(p => p.location.state.includes(region.region.split(' ')[0])).length || 0
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="carbonEfficiency" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Plantation Health Alerts</CardTitle>
                <CardDescription>Real-time monitoring alerts and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plantations.filter(p => p.status === 'at-risk').map(plantation => (
                    <div key={plantation.id} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-800">{plantation.name}</p>
                        <p className="text-sm text-red-700">
                          Low moisture levels ({plantation.moisture}%) and high temperature ({plantation.temperature.toFixed(1)}°C) detected. 
                          Immediate irrigation recommended.
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Carbon production decreased by 12% in the last 24 hours
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {plantations.filter(p => p.status === 'excellent').slice(0, 2).map(plantation => (
                    <div key={plantation.id} className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-green-800">{plantation.name}</p>
                        <p className="text-sm text-green-700">
                          Optimal growing conditions. Current carbon production rate exceeds targets by {((plantation.carbonProduction / 150) * 100).toFixed(1)}%.
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Recommend expanding plantation area to maximize carbon capture potential
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}