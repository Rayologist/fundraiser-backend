export interface Mailer<T> {
  send(args: T): Promise<void>;
}
