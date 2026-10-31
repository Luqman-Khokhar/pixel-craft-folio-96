import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { contact, identity } from "@/data/portfolio";
import { Roll } from "./primitives";

type Status = "idle" | "sending" | "sent" | "failed";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

const FIELD = "field-line block w-full py-3 text-lg text-paper placeholder:text-paper/60";

function validate(name: string, email: string, message: string): Errors {
  const errors: Errors = {};
  if (!name) errors.name = "Please add your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";
  if (!message) errors.message = "Please write a short message.";
  return errors;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block text-paper/75">{label}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-2 text-sm font-medium text-honey">{error}</p>}
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const found = validate(name, email, message);
    setErrors(found);
    if (Object.keys(found).length) return;

    const key = import.meta.env.VITE_WEB3FORMS_KEY;
    if (!key) {
      setStatus("failed");
      return;
    }
    setStatus("sending");
    try {
      data.set("name", name);
      data.set("email", email);
      data.set("message", message);
      data.append("access_key", key);
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json().catch(() => ({ success: false }));
      if (!json.success) throw new Error("Form service rejected the message");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex min-h-[24rem] flex-col items-start justify-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-honey text-ink"><Check className="h-6 w-6" aria-hidden="true" /></span>
        <p className="font-serif text-5xl font-medium leading-none">Message sent</p>
        <p className="text-paper/85">Thank you. I'll reply to the email you gave me.</p>
        <button type="button" onClick={() => setStatus("idle")} className="text-sm font-semibold underline decoration-honey underline-offset-4">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <input type="hidden" name="subject" value={contact.subject} />
      <input type="checkbox" name="botcheck" tabIndex={-1} aria-hidden="true" className="hidden" />
      <Field id="name" label="Name" error={errors.name}>
        <input id="name" name="name" autoComplete="name" placeholder="Your Name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} className={FIELD} />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="your.email@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={FIELD} />
      </Field>
      <Field id="message" label="Message" error={errors.message}>
        <textarea id="message" name="message" rows={4} placeholder="Write your message here" aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} className={`${FIELD} resize-y`} />
      </Field>

      {status === "failed" && (
        <p role="alert" className="rounded-lg border border-honey/60 p-4 text-sm leading-relaxed">
          Your message couldn't be sent, and nothing you typed was lost. Please try again, or email{" "}
          <a href={`mailto:${identity.email}`} className="font-semibold underline underline-offset-2">{identity.email}</a>.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-between rounded-full bg-honey px-6 py-4 font-semibold text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:gap-10"
      >
        {status === "sending" ? <span>Sending...</span> : <Roll>Send Message</Roll>}
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </form>
  );
}
