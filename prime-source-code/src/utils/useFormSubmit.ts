"use client";

import { useState } from "react";

/**
 * Shared submit-state plumbing for the booking / enquiry forms.
 *
 * Each form keeps its own fields, validation and request payload. This hook
 * only owns the repeated boilerplate — the `isSubmitting` flag plus the
 * success / error message strings — so it isn't re-declared in every form.
 *
 * `runSubmit` clears the messages, flips `isSubmitting`, runs the async
 * `action`, then sets `successMessage` on success or, on failure, the thrown
 * error's message (falling back to `fallbackErrorMessage`).
 */
export function useFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const runSubmit = async (
    action: () => Promise<void | string>,
    successMessage: string,
    fallbackErrorMessage: string
  ) => {
    setSubmitError("");
    setSubmitMessage("");
    setIsSubmitting(true);
    try {
      // The action may return a string to override the success message
      // (e.g. to include a booking reference returned by the API).
      const dynamic = await action();
      setSubmitMessage(typeof dynamic === "string" && dynamic ? dynamic : successMessage);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : fallbackErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitMessage,
    submitError,
    setSubmitMessage,
    setSubmitError,
    runSubmit,
  };
}
