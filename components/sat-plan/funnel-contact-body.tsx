import Link from "next/link";

type FunnelContactBodyProps = {
  email: string;
  phone: string;
  consent: boolean;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onConsentChange: (value: boolean) => void;
};

export function FunnelContactBody({
  email,
  phone,
  consent,
  onEmailChange,
  onPhoneChange,
  onConsentChange
}: FunnelContactBodyProps) {
  return (
    <div className="sf-form">
      <label className="sf-field" htmlFor="satplan-contact-email">
        <span className="sf-field__label">Email</span>
        <input
          id="satplan-contact-email"
          className="sf-input"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          placeholder="you@email.com"
          onChange={(event) => onEmailChange(event.target.value)}
        />
      </label>
      <label className="sf-field" htmlFor="satplan-contact-phone">
        <span className="sf-field__label">Phone (optional)</span>
        <input
          id="satplan-contact-phone"
          className="sf-input"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={phone}
          placeholder="(555) 555-5555"
          onChange={(event) => onPhoneChange(event.target.value)}
        />
      </label>
      <label className="sf-field">
        <span className="sf-field__label">Consent</span>
        <span className="quiz-step-copy">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => onConsentChange(event.target.checked)}
          />{" "}
          I agree to receive emails and texts about this plan and scheduling. See our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </span>
      </label>
    </div>
  );
}
