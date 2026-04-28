// Observer Interface
export interface Observer {
  id: string;
  name: string;
  update(message: string): void;
}

// Subject Interface
export interface Subject {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notify(message: string): void;
}

// Concrete Subject
export class NewsletterPublisher implements Subject {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: すでに登録済みのオブザーバーです。');
    }
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: 存在しないオブザーバーです。');
    }
    this.observers.splice(observerIndex, 1);
  }

  notify(message: string): void {
    console.log(`Subject: ${this.observers.length}人のオブザーバーに通知しています...`);
    for (const observer of this.observers) {
      observer.update(message);
    }
  }

  getObservers(): Observer[] {
    return this.observers;
  }
}

// Concrete Observer
export class Subscriber implements Observer {
  public id: string;
  public name: string;
  
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  update(message: string): void {
    console.log(`[${this.name}] がメッセージを受け取りました: ${message}`);
  }
}
