import { describe, it, expect, beforeEach } from "vitest"

describe("Demand Forecasting Contract", () => {
  let contractState
  
  beforeEach(() => {
    contractState = {
      demandHistory: new Map(),
      demandForecasts: new Map(),
    }
  })
  
  describe("Demand Recording", () => {
    it("should record historical demand successfully", () => {
      const storeId = "STORE001"
      const productId = "PROD001"
      const period = 1
      const demand = 500
      const recorder = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
      
      const result = recordDemand(contractState, storeId, productId, period, demand, recorder)
      
      expect(result.success).toBe(true)
      
      const key = `${storeId}-${productId}-${period}`
      expect(contractState.demandHistory.has(key)).toBe(true)
      
      const data = contractState.demandHistory.get(key)
      expect(data.demand).toBe(demand)
      expect(data.recordedBy).toBe(recorder)
    })
    
    it("should validate demand input", () => {
      const result = recordDemand(contractState, "STORE001", "PROD001", 1, 0, "recorder")
      
      expect(result.success).toBe(false)
      expect(result.error).toBe("ERR_INVALID_DATA")
    })
    
    it("should handle multiple periods for same product", () => {
      const storeId = "STORE001"
      const productId = "PROD001"
      const recorder = "recorder"
      
      const demands = [
        { period: 1, demand: 100 },
        { period: 2, demand: 150 },
        { period: 3, demand: 200 },
      ]
      
      demands.forEach(({ period, demand }) => {
        const result = recordDemand(contractState, storeId, productId, period, demand, recorder)
        expect(result.success).toBe(true)
      })
      
      // Verify all periods are recorded
      demands.forEach(({ period, demand }) => {
        const key = `${storeId}-${productId}-${period}`
        const data = contractState.demandHistory.get(key)
        expect(data.demand).toBe(demand)
      })
    })
  })
  
  describe("Demand Forecasting", () => {
    it("should generate forecast with historical data", () => {
      const storeId = "STORE001"
      const productId = "PROD001"
      const forecastPeriod = 30
      const forecaster = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
      
      // Record historical data first
      recordDemand(contractState, storeId, productId, 1, 100, "recorder")
      
      const result = generateForecast(contractState, storeId, productId, forecastPeriod, forecaster)
      
      expect(result.success).toBe(true)
      expect(result.predictedDemand).toBe(110) // 100 + 10% growth
      
      const key = `${storeId}-${productId}`
      expect(contractState.demandForecasts.has(key)).toBe(true)
      
      const forecast = contractState.demandForecasts.get(key)
      expect(forecast.predictedDemand).toBe(110)
      expect(forecast.confidenceLevel).toBe(75)
      expect(forecast.forecastPeriod).toBe(forecastPeriod)
      expect(forecast.forecaster).toBe(forecaster)
    })
    
    it("should fail forecast without historical data", () => {
      const result = generateForecast(contractState, "STORE001", "NONEXISTENT", 30, "forecaster")
      
      expect(result.success).toBe(false)
      expect(result.error).toBe("ERR_INSUFFICIENT_DATA")
    })
    
    it("should calculate different forecasts based on historical data", () => {
      const testCases = [
        { historical: 100, expected: 110 },
        { historical: 200, expected: 220 },
        { historical: 500, expected: 550 },
      ]
      
      testCases.forEach(({ historical, expected }, index) => {
        const productId = `PROD${index}`
        
        recordDemand(contractState, "STORE001", productId, 1, historical, "recorder")
        const result = generateForecast(contractState, "STORE001", productId, 30, "forecaster")
        
        expect(result.predictedDemand).toBe(expected)
      })
    })
  })
  
  describe("Historical Analysis", () => {
    it("should calculate historical average correctly", () => {
      const storeId = "STORE001"
      const productId = "PROD001"
      
      recordDemand(contractState, storeId, productId, 1, 100, "recorder")
      
      const average = getHistoricalAverage(contractState, storeId, productId)
      
      expect(average).toBe(100)
    })
    
    it("should return null for no historical data", () => {
      const average = getHistoricalAverage(contractState, "STORE001", "NONEXISTENT")
      
      expect(average).toBeNull()
    })
  })
  
  describe("Forecast Retrieval", () => {
    it("should retrieve existing forecast", () => {
      const storeId = "STORE001"
      const productId = "PROD001"
      
      // Setup historical data and generate forecast
      recordDemand(contractState, storeId, productId, 1, 100, "recorder")
      generateForecast(contractState, storeId, productId, 30, "forecaster")
      
      const forecast = getDemandForecast(contractState, storeId, productId)
      
      expect(forecast).toBeDefined()
      expect(forecast.predictedDemand).toBe(110)
      expect(forecast.confidenceLevel).toBe(75)
    })
    
    it("should return null for non-existent forecast", () => {
      const forecast = getDemandForecast(contractState, "STORE001", "NONEXISTENT")
      
      expect(forecast).toBeNull()
    })
  })
  
  describe("Edge Cases", () => {
    it("should handle very large demand values", () => {
      const largeDemand = 1000000
      
      const result = recordDemand(contractState, "STORE001", "PROD001", 1, largeDemand, "recorder")
      expect(result.success).toBe(true)
      
      const forecastResult = generateForecast(contractState, "STORE001", "PROD001", 30, "forecaster")
      expect(forecastResult.predictedDemand).toBe(largeDemand + Math.floor(largeDemand / 10))
    })
    
    it("should handle multiple forecasters for same product", () => {
      const storeId = "STORE001"
      const productId = "PROD001"
      
      recordDemand(contractState, storeId, productId, 1, 100, "recorder")
      
      // First forecast
      generateForecast(contractState, storeId, productId, 30, "forecaster1")
      
      // Second forecast should overwrite
      const result = generateForecast(contractState, storeId, productId, 60, "forecaster2")
      
      expect(result.success).toBe(true)
      
      const forecast = getDemandForecast(contractState, storeId, productId)
      expect(forecast.forecaster).toBe("forecaster2")
      expect(forecast.forecastPeriod).toBe(60)
    })
  })
})

// Mock contract functions
function recordDemand(state, storeId, productId, period, demand, recorder) {
  if (demand <= 0) {
    return { success: false, error: "ERR_INVALID_DATA" }
  }
  
  const key = `${storeId}-${productId}-${period}`
  
  state.demandHistory.set(key, {
    demand,
    recordedBy: recorder,
    timestamp: 1000,
  })
  
  return { success: true }
}

function generateForecast(state, storeId, productId, forecastPeriod, forecaster) {
  const historicalAverage = getHistoricalAverage(state, storeId, productId)
  
  if (historicalAverage === null) {
    return { success: false, error: "ERR_INSUFFICIENT_DATA" }
  }
  
  // Simple forecasting: 10% growth assumption
  const predictedDemand = historicalAverage + Math.floor(historicalAverage / 10)
  
  const key = `${storeId}-${productId}`
  
  state.demandForecasts.set(key, {
    predictedDemand,
    confidenceLevel: 75,
    forecastPeriod,
    createdAt: 1000,
    forecaster,
  })
  
  return { success: true, predictedDemand }
}

function getHistoricalAverage(state, storeId, productId) {
  // Simplified - just get period 1 data
  const key = `${storeId}-${productId}-1`
  const data = state.demandHistory.get(key)
  return data ? data.demand : null
}

function getDemandForecast(state, storeId, productId) {
  const key = `${storeId}-${productId}`
  return state.demandForecasts.get(key) || null
}
