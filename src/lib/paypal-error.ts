export class PayPalError extends Error {
  constructor(public status: number, message: string) { super(message); }
}