export interface ILock {
  isLocked(): Promise<boolean>;

  acquire(): Promise<() => void>;
}
