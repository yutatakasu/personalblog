"use client";

import type { ReactNode, MouseEvent } from "react";

import type { ContactContext, ContactEntryId } from "@/models/contact";
import { useContactModal } from "@/providers/ContactModalProvider";

type ContactLinkProps = {
  entryId: ContactEntryId;
  context?: ContactContext;
  children: ReactNode;
  className?: string;
};

export function ContactLink({
  entryId,
  context,
  children,
  className,
}: ContactLinkProps) {
  const { openContactModal } = useContactModal();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    openContactModal({ entryId, context });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
    >
      {children}
    </button>
  );
}


