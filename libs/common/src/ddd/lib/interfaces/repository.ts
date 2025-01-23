type MaybePromise<T> = T | Promise<T>;

export interface AbstractRepository<T> {
  findOneById(id: string): MaybePromise<T | null>;
  save(data: T): Promise<void>;
}
