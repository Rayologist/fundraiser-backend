import { ApplicationError } from '../../application-error';
import { Result } from '../../result';

export type Input = Record<string, unknown>;

export type Output = Result<unknown, ApplicationError>;

interface UseCase<I extends Input, O extends Output> {
  execute(input?: I): Promise<O> | O;
}

export interface Query<I extends Input, O extends Output>
  extends UseCase<I, O> {}

export interface Command<I extends Input, O extends Output>
  extends UseCase<I, O> {}
