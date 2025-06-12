# Tokenized Retail Inventory Turnover Optimization

A comprehensive blockchain-based system for optimizing retail inventory management through smart contracts built on the Stacks blockchain using Clarity.

## Overview

This system provides retailers with a decentralized platform to manage inventory turnover, forecast demand, optimize replenishment, and manage markdowns through verified inventory managers.

## Features

### 🔐 Inventory Manager Verification
- Register and verify inventory managers
- Role-based access control
- Store-specific permissions

### 📊 Turnover Analysis
- Track inventory turnover rates
- Calculate store-wide metrics
- Historical turnover data

### 🔮 Demand Forecasting
- Historical demand tracking
- Predictive demand forecasting
- Confidence level indicators

### 🔄 Replenishment Optimization
- Automated reorder point calculations
- Optimal quantity recommendations
- Order tracking and management

### 💰 Markdown Management
- Dynamic pricing strategies
- Markdown history tracking
- Turnover-based markdown recommendations

## Smart Contracts

### 1. Inventory Manager Contract (\`inventory-manager.clar\`)
Manages the registration and verification of inventory managers who can interact with the system.

**Key Functions:**
- \`register-manager\`: Register a new inventory manager
- \`verify-manager\`: Verify a manager (owner only)
- \`is-verified-manager\`: Check verification status

### 2. Turnover Analysis Contract (\`turnover-analysis.clar\`)
Analyzes and tracks inventory turnover rates for products and stores.

**Key Functions:**
- \`record-turnover\`: Record turnover data for a product
- \`get-turnover-rate\`: Retrieve turnover rate
- \`calculate-store-average\`: Calculate store-wide averages

### 3. Demand Forecasting Contract (\`demand-forecasting.clar\`)
Provides demand forecasting capabilities based on historical data.

**Key Functions:**
- \`record-demand\`: Record historical demand data
- \`generate-forecast\`: Create demand forecasts
- \`get-demand-forecast\`: Retrieve forecasts

### 4. Replenishment Optimization Contract (\`replenishment-optimization.clar\`)
Optimizes inventory replenishment based on turnover and demand data.

**Key Functions:**
- \`set-inventory-level\`: Set current inventory levels
- \`create-replenishment-order\`: Create replenishment orders
- \`needs-replenishment\`: Check if replenishment is needed

### 5. Markdown Management Contract (\`markdown-management.clar\`)
Manages product pricing and markdown strategies.

**Key Functions:**
- \`set-product-price\`: Set initial product pricing
- \`apply-markdown\`: Apply price markdowns
- \`calculate-optimal-markdown\`: Get markdown recommendations

## Getting Started

### Prerequisites
- Stacks blockchain node
- Clarity CLI tools
- Node.js and npm (for testing)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd inventory-optimization
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run tests:
   \`\`\`bash
   npm test
   \`\`\`

### Deployment

Deploy contracts to the Stacks blockchain:

\`\`\`bash
# Deploy inventory manager contract first
clarinet deploy inventory-manager.clar

# Deploy other contracts
clarinet deploy turnover-analysis.clar
clarinet deploy demand-forecasting.clar
clarinet deploy replenishment-optimization.clar
clarinet deploy markdown-management.clar
\`\`\`

## Usage Examples

### Register an Inventory Manager
\`\`\`clarity
(contract-call? .inventory-manager register-manager "John Doe" "STORE001")
\`\`\`

### Record Turnover Data
\`\`\`clarity
(contract-call? .turnover-analysis record-turnover "STORE001" "PROD001" u1000 u200)
\`\`\`

### Generate Demand Forecast
\`\`\`clarity
(contract-call? .demand-forecasting generate-forecast "STORE001" "PROD001" u30)
\`\`\`

### Apply Markdown
\`\`\`clarity
(contract-call? .markdown-management apply-markdown "STORE001" "PROD001" u20 "slow-moving")
\`\`\`

## Testing

The system includes comprehensive tests using Vitest:

\`\`\`bash
npm test
\`\`\`

Tests cover:
- Contract deployment
- Manager registration and verification
- Turnover calculations
- Demand forecasting accuracy
- Replenishment logic
- Markdown applications

## Architecture

The system follows a modular architecture with separate contracts for each major function:

\`\`\`
┌─────────────────────┐
│ Inventory Manager   │
│ Verification        │
└─────────────────────┘
│
▼
┌─────────────────────┐    ┌─────────────────────┐
│ Turnover Analysis   │◄──►│ Demand Forecasting  │
└─────────────────────┘    └─────────────────────┘
│                          │
▼                          ▼
┌─────────────────────┐    ┌─────────────────────┐
│ Replenishment       │◄──►│ Markdown Management │
│ Optimization        │    └─────────────────────┘
└─────────────────────┘
\`\`\`

## Security Considerations

- All functions include proper authorization checks
- Input validation prevents invalid data entry
- Role-based access control ensures only verified managers can perform operations
- Historical data is immutable once recorded

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
