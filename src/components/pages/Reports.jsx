import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import analyticsService from "@/services/api/analyticsService";
import ApperIcon from "@/components/ApperIcon";
import StatsCard from "@/components/molecules/StatsCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Dashboard from "@/components/pages/Dashboard";

const Reports = () => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [dateRange, setDateRange] = useState("30")
  const [viewType, setViewType] = useState("daily")

  const loadReportsData = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await analyticsService.getAnalytics(dateRange)
      setAnalyticsData(data)
    } catch (err) {
      setError("Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReportsData()
  }, [dateRange])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadReportsData} />

  if (!analyticsData) return <Loading />

  // Chart configurations for occupancy tracking
  const occupancyTrendOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false }
    },
    colors: ["#2563eb", "#059669", "#f59e0b"],
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: analyticsData.occupancyTrend.labels,
      labels: { style: { colors: "#64748b", fontSize: "12px" } }
    },
    yaxis: {
      labels: { 
        style: { colors: "#64748b", fontSize: "12px" },
        formatter: (value) => `${value}%`
      }
    },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 3 },
    legend: { position: "top" }
  }

  const occupancyTrendSeries = [
    {
      name: "Occupancy Rate",
      data: analyticsData.occupancyTrend.data
    },
    {
      name: "RevPAR",
      data: analyticsData.revparTrend.data
    },
    {
      name: "ADR",
      data: analyticsData.adrTrend.data.map(v => v / 10) // Scale for visualization
    }
  ]

  // Revenue breakdown chart
  const revenueBreakdownOptions = {
    chart: {
      type: "pie",
      height: 300
    },
    colors: ["#2563eb", "#059669", "#f59e0b", "#8b5cf6", "#ef4444"],
    labels: ["Room Revenue", "Food & Beverage", "Spa Services", "Business Center", "Other"],
    legend: { position: "bottom" },
    tooltip: {
      y: { formatter: (value) => `$${value.toLocaleString()}` }
    }
  }

  const revenueBreakdownSeries = analyticsData.revenueBreakdown

  // Booking source tracking
  const bookingSourceOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false }
    },
    colors: ["#2563eb", "#059669", "#f59e0b", "#8b5cf6"],
    xaxis: {
      categories: analyticsData.bookingSources.labels
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%"
      }
    }
  }

  const bookingSourceSeries = [{
    name: "Bookings",
    data: analyticsData.bookingSources.data
  }]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Business Intelligence Dashboard</h1>
          <p className="text-slate-600">Comprehensive analytics and financial reporting</p>
        </div>
        <div className="flex gap-3">
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="daily">Daily View</option>
            <option value="weekly">Weekly View</option>
            <option value="monthly">Monthly View</option>
            <option value="yearly">Yearly View</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <Button variant="outline">
            <ApperIcon name="Download" size={18} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Occupancy Rate"
          value={`${analyticsData.kpis.occupancyRate}%`}
          icon="Home"
          color="primary"
          trend={analyticsData.kpis.occupancyTrend > 0 ? "up" : "down"}
          trendValue={`${Math.abs(analyticsData.kpis.occupancyTrend)}%`}
        />
        <StatsCard
          title="RevPAR"
          value={`$${analyticsData.kpis.revpar}`}
          icon="DollarSign"
          color="success"
          trend={analyticsData.kpis.revparTrend > 0 ? "up" : "down"}
          trendValue={`${Math.abs(analyticsData.kpis.revparTrend)}%`}
        />
        <StatsCard
          title="ADR"
          value={`$${analyticsData.kpis.adr}`}
          icon="TrendingUp"
          color="info"
          trend={analyticsData.kpis.adrTrend > 0 ? "up" : "down"}
          trendValue={`${Math.abs(analyticsData.kpis.adrTrend)}%`}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${analyticsData.kpis.totalRevenue.toLocaleString()}`}
          icon="CreditCard"
          color="success"
          trend="up"
          trendValue="+18%"
        />
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Occupancy & Revenue Tracking */}
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Occupancy & Revenue Trends</h2>
              <p className="text-sm text-slate-600">RevPAR and ADR performance over time</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-400 text-white">
              <ApperIcon name="TrendingUp" size={20} />
            </div>
          </div>
          <Chart
            options={occupancyTrendOptions}
            series={occupancyTrendSeries}
            type="line"
            height={350}
          />
        </Card>

        {/* Revenue Breakdown */}
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Revenue Categories</h2>
              <p className="text-sm text-slate-600">Breakdown by revenue streams</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-400 text-white">
              <ApperIcon name="PieChart" size={20} />
            </div>
          </div>
          <Chart
            options={revenueBreakdownOptions}
            series={revenueBreakdownSeries}
            type="pie"
            height={300}
          />
        </Card>
      </div>

      {/* Booking Analytics & Room Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Booking Source Tracking */}
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Booking Sources</h2>
              <p className="text-sm text-slate-600">Direct vs third-party platform comparison</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-400 text-white">
              <ApperIcon name="BarChart3" size={20} />
            </div>
          </div>
          <Chart
            options={bookingSourceOptions}
            series={bookingSourceSeries}
            type="bar"
            height={300}
          />
        </Card>

        {/* Room Type Performance */}
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Room Type Performance</h2>
              <p className="text-sm text-slate-600">Utilization rates by room category</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-white">
              <ApperIcon name="Home" size={20} />
            </div>
          </div>
          
          <div className="space-y-4">
            {analyticsData.roomTypePerformance.map((roomType) => (
              <div key={roomType.type} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-900 capitalize">{roomType.type}</p>
                  <p className="text-sm text-slate-600">{roomType.totalRooms} rooms available</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-slate-900">{roomType.utilizationRate}%</p>
                  <p className="text-sm text-slate-600">utilization</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Financial Reporting */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Financial Performance</h2>
            <p className="text-sm text-slate-600">Profit margins and budget analysis</p>
          </div>
          <Button variant="outline" size="sm">
            <ApperIcon name="FileText" size={16} className="mr-2" />
            Generate Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-25 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500 text-white">
                <ApperIcon name="TrendingUp" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700">Profit Margin</p>
                <p className="text-2xl font-bold text-emerald-900">{analyticsData.financial.profitMargin}%</p>
              </div>
            </div>
            <p className="text-sm text-emerald-600">+2.3% vs last month</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-25 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <ApperIcon name="Target" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Budget Achievement</p>
                <p className="text-2xl font-bold text-blue-900">{analyticsData.financial.budgetAchievement}%</p>
              </div>
            </div>
            <p className="text-sm text-blue-600">On track for quarterly goals</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-25 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500 text-white">
                <ApperIcon name="CreditCard" size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Commission Costs</p>
                <p className="text-2xl font-bold text-purple-900">{analyticsData.financial.commissionRate}%</p>
              </div>
            </div>
            <p className="text-sm text-purple-600">Avg across all channels</p>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 text-white">
            <ApperIcon name="Lightbulb" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Optimization Recommendations</h2>
            <p className="text-sm text-slate-600">AI-powered insights for revenue optimization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analyticsData.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="p-2 rounded-lg bg-primary-100 text-primary-600 flex-shrink-0">
                <ApperIcon name={rec.icon} size={18} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">{rec.title}</h4>
                <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                <p className="text-sm font-semibold text-emerald-600">Potential Impact: {rec.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Reports