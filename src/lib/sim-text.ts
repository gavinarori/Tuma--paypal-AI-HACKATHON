// Fixed replies for the simulated AI (SIMULATE_AI=true). Four languages are written by hand; others get English.
export type SimLang = "en" | "sw" | "fr" | "pcm";
export const simLang = (code?: string | null): SimLang => (code === "sw" || code === "fr" || code === "pcm" ? code : "en");

type Str = Record<SimLang, string>;
type Fn<A extends unknown[]> = Record<SimLang, (...a: A) => string>;

export const TEXT = {
  greet: { en: "Hi! Tell me who to send money to and how much, for example: Send $50 to mama for rent.", sw: "Habari! Niambie unatuma kwa nani na kiasi gani, kwa mfano: Tuma $50 kwa mama kwa kodi.", fr: "Bonjour ! Dites-moi à qui envoyer de l'argent et combien, par exemple : Envoie 50 $ à maman pour le loyer.", pcm: "How far! Tell me who you wan send money give and how much, like: Send $50 give mama for rent." } as Str,
  askAmount: { en: (n) => `How much would you like to send to ${n}?`, sw: (n) => `Unataka kumtumia ${n} kiasi gani?`, fr: (n) => `Combien voulez-vous envoyer à ${n} ?`, pcm: (n) => `How much you wan send give ${n}?` } as Fn<[string]>,
  askWho: { en: "Who should receive the money?", sw: "Pesa zimtumwe kwa nani?", fr: "Qui doit recevoir l'argent ?", pcm: "Who go collect the money?" } as Str,
  limit: { en: "I can send between $1 and $1,000 at a time.", sw: "Naweza kutuma kati ya $1 na $1,000 kwa wakati mmoja.", fr: "Je peux envoyer entre 1 $ et 1 000 $ à la fois.", pcm: "I fit send between $1 and $1,000 one time." } as Str,
  quote: { en: (n, a) => `I've prepared your $${a} transfer for ${n}. Please check the details.`, sw: (n, a) => `Nimeandaa uhamisho wako wa $${a} kwa ${n}. Tafadhali kagua maelezo.`, fr: (n, a) => `J'ai préparé votre transfert de ${a} $ pour ${n}. Veuillez vérifier les détails.`, pcm: (n, a) => `I don prepare your $${a} transfer for ${n}. Abeg check the details.` } as Fn<[string, number]>,
  checkForm: { en: "Please check the recipient details in the form and press Continue.", sw: "Tafadhali kagua maelezo ya mpokeaji kwenye fomu kisha bonyeza Endelea.", fr: "Veuillez vérifier les informations du destinataire dans le formulaire puis appuyer sur Continuer.", pcm: "Abeg check the person details for the form then press Continue." } as Str,
  tapPaypal: { en: "Tap the PayPal button to approve the payment. Nothing is paid until you approve in PayPal.", sw: "Gusa kitufe cha PayPal ili kuidhinisha malipo. Hakuna kinacholipwa hadi uidhinishe kwenye PayPal.", fr: "Appuyez sur le bouton PayPal pour approuver le paiement. Rien n'est payé tant que vous n'avez pas approuvé dans PayPal.", pcm: "Tap the PayPal button make you approve the payment. Nothing go commot until you approve for PayPal." } as Str,
  noTransfer: { en: "I couldn't find a transfer yet.", sw: "Sijapata uhamisho wowote bado.", fr: "Je n'ai trouvé aucun transfert pour le moment.", pcm: "I never see any transfer yet." } as Str,
  status: { en: (n, s) => `Your transfer to ${n} is: ${s}.`, sw: (n, s) => `Uhamisho wako kwa ${n} uko katika hali: ${s}.`, fr: (n, s) => `Votre transfert vers ${n} est : ${s}.`, pcm: (n, s) => `Your transfer to ${n} dey: ${s}.` } as Fn<[string, string]>,
};

/** Receipt text for the simulated AI. `facts` has the same keys the real AI is given. */
export function simReceipt(lang: SimLang, facts: Record<string, unknown>): string {
  const n = String(facts.recipient);
  const total = Number(facts.total_paid_usd ?? 0).toFixed(2);
  if (facts.outcome === "delivered") {
    const a = Number(facts.amount_usd ?? 0).toFixed(2);
    return {
      en: `Done! ${n} received $${a} in their PayPal account. You paid $${total} including fees.`,
      sw: `Imekamilika! ${n} amepokea $${a} kwenye akaunti yake ya PayPal. Ulilipa $${total} pamoja na ada.`,
      fr: `C'est fait ! ${n} a reçu ${a} $ sur son compte PayPal. Vous avez payé ${total} $, frais compris.`,
      pcm: `E don land! ${n} don collect $${a} for im PayPal. You pay $${total} with the fee.`,
    }[lang];
  }
  if (facts.refunded) {
    return {
      en: `The transfer to ${n} could not be completed. Your $${total} was refunded to PayPal.`,
      sw: `Uhamisho kwa ${n} haukukamilika. Pesa zako $${total} zimerudishwa kwenye PayPal.`,
      fr: `Le transfert vers ${n} n'a pas pu aboutir. Vos ${total} $ ont été remboursés sur PayPal.`,
      pcm: `Transfer to ${n} no work. Dem don return your $${total} to PayPal.`,
    }[lang];
  }
  return {
    en: `The transfer to ${n} could not be completed and we could not confirm a refund automatically. Please contact support.`,
    sw: `Uhamisho kwa ${n} haukukamilika na hatukuweza kuthibitisha kurudishiwa pesa. Tafadhali wasiliana na msaada.`,
    fr: `Le transfert vers ${n} n'a pas pu aboutir et nous n'avons pas pu confirmer le remboursement. Veuillez contacter l'assistance.`,
    pcm: `Transfer to ${n} no work and we no fit confirm the refund. Abeg contact support.`,
  }[lang];
}