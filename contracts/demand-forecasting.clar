;; Demand Forecasting Contract
;; Forecasts product demand based on historical data

(define-constant ERR_UNAUTHORIZED (err u300))
(define-constant ERR_INVALID_DATA (err u301))
(define-constant ERR_INSUFFICIENT_DATA (err u302))

;; Data structures
(define-map demand-history {store-id: (string-ascii 20), product-id: (string-ascii 30), period: uint} {
  demand: uint,
  recorded-by: principal,
  timestamp: uint
})

(define-map demand-forecasts {store-id: (string-ascii 20), product-id: (string-ascii 30)} {
  predicted-demand: uint,
  confidence-level: uint,
  forecast-period: uint,
  created-at: uint,
  forecaster: principal
})

;; Record historical demand
(define-public (record-demand (store-id (string-ascii 20))
                             (product-id (string-ascii 30))
                             (period uint)
                             (demand uint))
  (begin
    (asserts! (> demand u0) ERR_INVALID_DATA)
    (map-set demand-history {store-id: store-id, product-id: product-id, period: period} {
      demand: demand,
      recorded-by: tx-sender,
      timestamp: block-height
    })
    (ok true)
  )
)

;; Generate demand forecast
(define-public (generate-forecast (store-id (string-ascii 20))
                                 (product-id (string-ascii 30))
                                 (forecast-period uint))
  (let ((historical-avg (get-historical-average store-id product-id)))
    (match historical-avg
      avg-demand (begin
        ;; Simple forecasting algorithm - in practice would be more sophisticated
        (let ((predicted (+ avg-demand (/ avg-demand u10)))) ;; 10% growth assumption
          (map-set demand-forecasts {store-id: store-id, product-id: product-id} {
            predicted-demand: predicted,
            confidence-level: u75, ;; 75% confidence
            forecast-period: forecast-period,
            created-at: block-height,
            forecaster: tx-sender
          })
          (ok predicted)
        )
      )
      ERR_INSUFFICIENT_DATA
    )
  )
)

;; Get historical average (simplified)
(define-read-only (get-historical-average (store-id (string-ascii 20)) (product-id (string-ascii 30)))
  ;; Simplified - would normally calculate from multiple periods
  (match (map-get? demand-history {store-id: store-id, product-id: product-id, period: u1})
    data (some (get demand data))
    none
  )
)

;; Get demand forecast
(define-read-only (get-demand-forecast (store-id (string-ascii 20)) (product-id (string-ascii 30)))
  (map-get? demand-forecasts {store-id: store-id, product-id: product-id})
)
