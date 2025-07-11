;; Inventory Manager Verification Contract
;; Manages and verifies retail inventory managers

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_ALREADY_REGISTERED (err u101))
(define-constant ERR_NOT_FOUND (err u102))

;; Data structures
(define-map inventory-managers principal {
  name: (string-ascii 50),
  store-id: (string-ascii 20),
  verified: bool,
  registration-block: uint
})

(define-map store-permissions (string-ascii 20) (list 10 principal))

;; Register a new inventory manager
(define-public (register-manager (name (string-ascii 50)) (store-id (string-ascii 20)))
  (let ((manager tx-sender))
    (asserts! (is-none (map-get? inventory-managers manager)) ERR_ALREADY_REGISTERED)
    (map-set inventory-managers manager {
      name: name,
      store-id: store-id,
      verified: false,
      registration-block: block-height
    })
    (ok true)
  )
)

;; Verify a manager (only contract owner)
(define-public (verify-manager (manager principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (match (map-get? inventory-managers manager)
      manager-data (begin
        (map-set inventory-managers manager (merge manager-data { verified: true }))
        (ok true)
      )
      ERR_NOT_FOUND
    )
  )
)

;; Check if manager is verified
(define-read-only (is-verified-manager (manager principal))
  (match (map-get? inventory-managers manager)
    manager-data (get verified manager-data)
    false
  )
)

;; Get manager info
(define-read-only (get-manager-info (manager principal))
  (map-get? inventory-managers manager)
)
