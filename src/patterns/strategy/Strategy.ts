// Strategy Interface
export interface PaymentStrategy {
  pay(amount: number): Promise<string>;
}

// Concrete Strategies
export class CreditCardStrategy implements PaymentStrategy {
  async pay(amount: number): Promise<string> {
    return new Promise(resolve => {
      // Simulate network request
      setTimeout(() => {
        resolve(`クレジットカードで $${amount} を支払いました。`);
      }, 1500);
    });
  }
}

export class HogePayStrategy implements PaymentStrategy {
  async pay(amount: number): Promise<string> {
    return new Promise(resolve => {
      // Simulate redirect and callback
      setTimeout(() => {
        resolve(`HogePayで $${amount} を支払いました。`);
      }, 2000);
    });
  }
}

export class CryptoStrategy implements PaymentStrategy {
  async pay(amount: number): Promise<string> {
    return new Promise(resolve => {
      // Simulate blockchain confirmation
      setTimeout(() => {
        resolve(`暗号資産(BTC)で $${amount} を支払いました。`);
      }, 2500);
    });
  }
}

// Context
export class ShoppingCart {
  private strategy: PaymentStrategy;

  constructor(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PaymentStrategy) {
    this.strategy = strategy;
  }

  async checkout(amount: number): Promise<string> {
    if (!this.strategy) {
      throw new Error("支払い戦略（決済方法）が設定されていません");
    }
    return await this.strategy.pay(amount);
  }
}
