export abstract class Collection<T> {
  private current: T[] = [];
  private initial: T[] = [];
  private new: T[] = [];
  private removed: T[] = [];

  constructor(initial?: T[]) {
    if (Array.isArray(initial)) {
      this.current = initial;
      this.initial = initial;
    }
  }

  abstract isSameItem(a: T, b: T): boolean;

  get items() {
    return this.current;
  }

  get newItems() {
    return this.new;
  }

  get removedItems() {
    return this.removed;
  }

  exists(item: T) {
    return this.isCurrent(item);
  }

  find(predicate: (item: T) => boolean) {
    return this.current.find(predicate);
  }

  clear() {
    while (this.current.length > 0) {
      this.remove(this.current[0]);
    }
  }

  add(item: T) {
    if (this.isRemoved(item)) {
      this.removed = this.removed.filter((v) => !this.isSameItem(v, item));
    }

    if (!this.isNew(item) && !this.isInitial(item)) {
      this.new.push(item);
    }

    if (!this.isCurrent(item)) {
      this.current.push(item);
    }
  }

  remove(item: T) {
    this.current = this.current.filter((v) => !this.isSameItem(v, item));

    if (this.isNew(item)) {
      this.new = this.new.filter((v) => !this.isSameItem(v, item));
      return;
    }

    if (!this.isRemoved(item)) {
      this.removed.push(item);
    }
  }

  private isCurrent(item: T): boolean {
    return this.current.find((v) => this.isSameItem(v, item)) !== undefined;
  }

  private isNew(item: T): boolean {
    return this.new.find((v) => this.isSameItem(v, item)) !== undefined;
  }

  private isRemoved(item: T): boolean {
    return this.removed.find((v) => this.isSameItem(v, item)) !== undefined;
  }

  private isInitial(item: T): boolean {
    return this.initial.find((v) => this.isSameItem(v, item)) !== undefined;
  }
}
