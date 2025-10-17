import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import StatsCard from "@/components/molecules/StatsCard"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import analyticsService from "@/services/api/analyticsService"
import guestsService from "@/services/api/guestsService"

const Analytics = () => {
  const [guestData, setGuestData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeFrame, setTimeFrame] = useState("monthly")
  const [selectedMetric, setSelectedMetric] = useState("satisfaction")

  const loadAnalyticsData = async () => {
    try {
      setError("")
      setLoading(true)
      const [guests] = await Promise.all([
        guestsService.getAll()
      ])
      setGuestData(guests)
    } catch (err) {
      setError("Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadAnalyticsData} />

  // Generate guest satisfaction metrics
  const npsScore = 72 // Mock NPS score
  const satisfactionTrend = [68, 71, 69, 74, 72, 75, 78]
  const sentimentData = {
    positive: 78,
    neutral: 15,
    negative: 7
  }

  // Length of stay analysis
  const stayLengthData = [
    { length: "1-2 nights", count: 45, percentage: 42 },
    { length: "3-4 nights", count: 38, percentage: 35 },
    { length: "5-7 nights", count: 18, percentage: 17 },
    { length: "1+ weeks", count: 6, percentage: 6 }
  ]

  // Seasonal patterns (mock data)
  const seasonalData = {
    spring: { occupancy: 68, revenue: 485000 },
    summer: { occupancy: 89, revenue: 742000 },
    fall: { occupancy: 73, revenue: 512000 },
    winter: { occupancy: 51, revenue: 348000 }
  }

  // NPS Trend Chart
  const npsChartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false }
    },
    colors: ["#059669"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1
      }
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        formatter: (value) => `${value}`
      }
    }
  }

  const npsChartSeries = [{
    name: "NPS Score",
    data: satisfactionTrend
  }]

  // Sentiment Analysis Chart
  const sentimentChartOptions = {
    chart: {
      type: "donut",
      height: 250
    },
    colors: ["#059669", "#f59e0b", "#ef4444"],
    labels: ["Positive", "Neutral", "Negative"],
    legend: { position: "bottom" }
  }

  const sentimentChartSeries = [sentimentData.positive, sentimentData.neutral, sentimentData.negative]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Advanced Analytics</h1>
          <p className="text-slate-600">Guest satisfaction, seasonal patterns, and performance insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="satisfaction">Guest Satisfaction</option>
            <option value="financial">Financial Performance</option>
            <option value="operational">Operational Metrics</option>
          </select>
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Guest Satisfaction Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="NPS Score"
          value={npsScore}
          icon="Star"
          color="success"
          trend="up"
          trendValue="+6 pts"
        />
        <StatsCard
          title="Guest Reviews"
          value="4.6"
          icon="MessageSquare"
          color="primary"
          trend="up"
          trendValue="+0.3"
        />
        <StatsCard
          title="Response Rate"
          value="87%"
          icon="Users"
          color="info"
          trend="up"
          trendValue="+12%"
        />
        <StatsCard
          title="Resolution Time"
          value="2.4h"
          icon="Clock"
          color="warning"
          trend="down"
          trendValue="-0.8h"
        />
      </div>

      {/* Satisfaction Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* NPS Trending */}
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">NPS Trending</h2>
              <p className="text-sm text-slate-600">Net Promoter Score over time</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-400 text-white">
              <ApperIcon name="TrendingUp" size={20} />
            </div>
          </div>
          <Chart
            options={npsChartOptions}
            series={npsChartSeries}
            type="area"
            height={300}
          />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-600">68%</p>
              <p className="text-sm text-slate-600">Promoters</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">24%</p>
              <p className="text-sm text-slate-600">Passives</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">8%</p>
              <p className="text-sm text-slate-600">Detractors</p>
            </div>
          </div>
        </Card>

        {/* Review Sentiment Analysis */}
        <Card variant="gradient" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Review Sentiment</h2>
              <p className="text-sm text-slate-600">Analysis of guest feedback</p>
            </div>
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white">
              <ApperIcon name="MessageCircle" size={20} />
            </div>
          </div>
          <Chart
            options={sentimentChartOptions}
            series={sentimentChartSeries}
            type="donut"
            height={250}
          />
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Positive Sentiment</span>
              <span className="font-semibold text-emerald-600">{sentimentData.positive}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Neutral Sentiment</span>
              <span className="font-semibold text-amber-600">{sentimentData.neutral}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Negative Sentiment</span>
              <span className="font-semibold text-red-600">{sentimentData.negative}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Length of Stay Analysis */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Length of Stay Analysis</h2>
            <p className="text-sm text-slate-600">Guest stay patterns and optimization opportunities</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-400 text-white">
            <ApperIcon name="Calendar" size={20} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stayLengthData.map((item, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900">{item.length}</h4>
                <span className="text-sm font-bold text-primary-600">{item.percentage}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-600">{item.count} bookings</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-amber-25 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <ApperIcon name="Lightbulb" size={18} className="text-amber-600" />
            <h4 className="font-semibold text-amber-900">Optimization Recommendation</h4>
          </div>
          <p className="text-sm text-amber-800">Consider offering 4+ night packages with progressive discounts to increase average length of stay and maximize revenue per guest.</p>
        </div>
      </Card>

      {/* Seasonal Performance */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Seasonal Patterns</h2>
            <p className="text-sm text-slate-600">Performance comparison across seasons</p>
          </div>
          <Button variant="outline" size="sm">
            <ApperIcon name="Calendar" size={16} className="mr-2" />
            View Forecast
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(seasonalData).map(([season, data]) => (
            <div key={season} className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 capitalize">{season}</h3>
                <ApperIcon 
                  name={season === 'spring' ? 'Flower' : season === 'summer' ? 'Sun' : season === 'fall' ? 'Leaf' : 'Snowflake'} 
                  size={20} 
                  className={`${
                    season === 'spring' ? 'text-green-500' :
                    season === 'summer' ? 'text-yellow-500' :
                    season === 'fall' ? 'text-orange-500' : 'text-blue-500'
                  }`}
                />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Occupancy</p>
                  <p className="text-2xl font-bold text-slate-900">{data.occupancy}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Revenue</p>
                  <p className="text-lg font-semibold text-slate-900">${(data.revenue / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Service Quality Metrics */}
      <Card variant="gradient" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Service Quality by Department</h2>
            <p className="text-sm text-slate-600">Performance metrics across hotel departments</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-400 text-white">
            <ApperIcon name="Users" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { dept: "Front Desk", score: 4.7, reviews: 1247, trend: "+0.2" },
            { dept: "Housekeeping", score: 4.5, reviews: 892, trend: "+0.1" },
            { dept: "Restaurant", score: 4.4, reviews: 634, trend: "-0.1" },
            { dept: "Spa Services", score: 4.8, reviews: 298, trend: "+0.3" },
            { dept: "Concierge", score: 4.6, reviews: 445, trend: "+0.1" },
            { dept: "Maintenance", score: 4.3, reviews: 156, trend: "+0.2" }
          ].map((dept, index) => (
            <div key={index} className="bg-slate-50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900">{dept.dept}</h4>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Star" size={14} className="text-yellow-500" />
                  <span className="text-sm font-bold text-slate-900">{dept.score}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{dept.reviews} reviews</span>
                <span className={`font-semibold ${dept.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                  {dept.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Analytics