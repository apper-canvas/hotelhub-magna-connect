const analyticsService = {
  async getAnalytics(dateRange = "30") {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Mock analytics data based on existing booking and room data
    const analytics = {
      kpis: {
        occupancyRate: 73,
        occupancyTrend: 8,
        revpar: 186,
        revparTrend: 15,
        adr: 255,
        adrTrend: 5,
        totalRevenue: 125800
      },
      occupancyTrend: {
        labels: this.getDateLabels(dateRange),
        data: [68, 71, 74, 76, 73, 78, 81, 79, 75, 77, 73, 76]
      },
      revparTrend: {
        labels: this.getDateLabels(dateRange),
        data: [165, 175, 182, 190, 186, 195, 205, 198, 188, 192, 186, 194]
      },
      adrTrend: {
        labels: this.getDateLabels(dateRange),
        data: [242, 247, 246, 250, 255, 250, 253, 251, 251, 249, 255, 255]
      },
      revenueBreakdown: [65800, 32400, 15200, 8300, 4100],
      bookingSources: {
        labels: ["Direct Bookings", "Booking.com", "Expedia", "Agoda", "Other"],
        data: [45, 28, 18, 12, 7]
      },
      roomTypePerformance: [
        { type: "standard", totalRooms: 6, utilizationRate: 78 },
        { type: "deluxe", totalRooms: 4, utilizationRate: 82 },
        { type: "suite", totalRooms: 1, utilizationRate: 85 },
        { type: "presidential", totalRooms: 1, utilizationRate: 65 }
      ],
      financial: {
        profitMargin: 23.5,
        budgetAchievement: 112,
        commissionRate: 15.2
      },
      recommendations: [
        {
          icon: "TrendingUp",
          title: "Increase Weekend Rates",
          description: "Weekend occupancy consistently exceeds 85%. Consider implementing dynamic pricing with 10-15% weekend premiums.",
          impact: "+$8,500 monthly revenue"
        },
        {
          icon: "Users",
          title: "Corporate Package Optimization",
          description: "Business travelers show 65% repeat booking rate. Create corporate packages with longer stay incentives.",
          impact: "+12% repeat bookings"
        },
        {
          icon: "Calendar",
          title: "Seasonal Promotion Strategy",
          description: "Winter months show 25% lower occupancy. Implement spa packages and business meeting promotions.",
          impact: "+18% winter occupancy"
        },
        {
          icon: "Star",
          title: "Guest Experience Enhancement",
          description: "Guests staying 4+ nights rate experience 15% higher. Focus on extended stay amenities and services.",
          impact: "+0.4 review rating"
        }
      ]
    }
    
    return analytics
  },

  getDateLabels(range) {
    const labels = []
    const days = parseInt(range)
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      if (days <= 7) {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
      } else if (days <= 30) {
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      } else {
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }))
      }
    }
    
    return labels
  },

  async getFinancialMetrics() {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      totalRevenue: 125800,
      operatingExpenses: 89600,
      grossProfit: 36200,
      netProfit: 28700,
      profitMargin: 23.5,
      revpar: 186,
      adr: 255,
      occupancyRate: 73,
      commissionCosts: 19123,
      averageCommissionRate: 15.2
    }
  },

  async getGuestSatisfactionMetrics() {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    return {
      npsScore: 72,
      averageRating: 4.6,
      totalReviews: 1247,
      responseRate: 87,
      sentimentBreakdown: {
        positive: 78,
        neutral: 15,
        negative: 7
      },
      departmentRatings: {
        frontDesk: 4.7,
        housekeeping: 4.5,
        restaurant: 4.4,
        spa: 4.8,
        concierge: 4.6,
        maintenance: 4.3
      }
    }
  }
}

export default analyticsService