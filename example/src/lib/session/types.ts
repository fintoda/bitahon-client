export type TSession = {
  proof: Uint8Array;
  session: Uint8Array;
  wallet: Uint8Array;
};

export interface IContext {
  session: TSession | null;
  setSession: (session: TSession | null) => void;
}
