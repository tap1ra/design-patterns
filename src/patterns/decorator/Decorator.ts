// Component Interface
export interface Coffee {
  getCost(): number;
  getDescription(): string;
  getIngredients(): string[];
}

// Concrete Component
export class SimpleCoffee implements Coffee {
  getCost(): number {
    return 300;
  }

  getDescription(): string {
    return 'シンプルなコーヒー';
  }

  getIngredients(): string[] {
    return ['coffee_base'];
  }
}

// Base Decorator
export abstract class CoffeeDecorator implements Coffee {
  protected decoratedCoffee: Coffee;

  constructor(coffee: Coffee) {
    this.decoratedCoffee = coffee;
  }

  getCost(): number {
    return this.decoratedCoffee.getCost();
  }

  getDescription(): string {
    return this.decoratedCoffee.getDescription();
  }

  getIngredients(): string[] {
    return this.decoratedCoffee.getIngredients();
  }
}

// Concrete Decorators
export class MilkDecorator extends CoffeeDecorator {
  getCost(): number {
    return super.getCost() + 50;
  }

  getDescription(): string {
    return super.getDescription() + '、ミルク';
  }

  getIngredients(): string[] {
    return [...super.getIngredients(), 'milk'];
  }
}

export class WhipCreamDecorator extends CoffeeDecorator {
  getCost(): number {
    return super.getCost() + 100;
  }

  getDescription(): string {
    return super.getDescription() + '、ホイップクリーム';
  }

  getIngredients(): string[] {
    return [...super.getIngredients(), 'whip'];
  }
}

export class CaramelSyrupDecorator extends CoffeeDecorator {
  getCost(): number {
    return super.getCost() + 80;
  }

  getDescription(): string {
    return super.getDescription() + '、キャラメルシロップ';
  }

  getIngredients(): string[] {
    return [...super.getIngredients(), 'caramel'];
  }
}
