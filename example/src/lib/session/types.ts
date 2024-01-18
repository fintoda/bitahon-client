export type TSession = {
  proof: Uint8Array;
  session: Uint8Array;
  wallet: string;
};

export interface IContext {
  session: TSession | null;
  setSession: (session: TSession | null) => void;
}
