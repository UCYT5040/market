# Market

"Market" is a platform for managing salespeople and investors for a decentralized marketplace.

## About investing & dividends

The market operates on a zero-profit model: any profits generated are distributed back to investors in the form of dividends.

Investors can choose to reinvest their dividends to purchase additional ownership, potentially increasing their future returns.

Dividends are issued daily at midnight. Any new investments are then processed after the dividend distribution.

Users can invest monetarily or by contributing their skills and expertise to the marketplace ("sweat" investment).

## Adding funds

The administrator should keep any funds on hand.

Users can then ask that the administrator deposit or withdraw funds to their balance.

Administrators should submit adjustments (from the admin dashboard) to update the user balances accordingly.

## Sales

Commissions can be earned on sales (commission rate for each user is set by the administrator).

Products can be added from the admin dashboard.

Each product also has a "local" price, which is the price at the local store. This is used to determine whether purchases users make are saving or costing the market.

## Approval

All new accounts require approval before they are able to access the dashboard.

## Setup

### Appwrite

You'll need [Appwrite](https://appwrite.io) (either self-hosted or cloud).

Then copy the `example.appwrite.config.json` file to `appwrite.config.json` and use the [Appwrite CLI](https://appwrite.io/docs/tooling/command-line/installation) to set up your project.

### .env

Copy the contents of `.env.example` to `.env` and update the values with your Appwrite project settings.

### Building

```shell
npm install
npm run build
```

### Running

```shell
node run build
```

### Configure

See the [Svelte Node Adapter Documentation on environment variables](https://svelte.dev/docs/kit/adapter-node#Environment-variables) for configuration options.
