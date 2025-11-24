"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { ContactModal } from "@/components/ContactModal";
import type { ContactContext, ContactEntryId } from "@/models/contact";

type OpenContactModalParams = {
  entryId: ContactEntryId;
  context?: ContactContext;
};

type ContactModalContextValue = {
  openContactModal: (params: OpenContactModalParams) => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(
  null,
);

type ContactModalProviderProps = {
  children: ReactNode;
};

export function ContactModalProvider({ children }: ContactModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [entryId, setEntryId] = useState<ContactEntryId | null>(null);
  const [context, setContext] = useState<ContactContext | undefined>(undefined);

  const openContactModal = useCallback((params: OpenContactModalParams) => {
    setEntryId(params.entryId);
    setContext(params.context);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      openContactModal,
    }),
    [openContactModal],
  );

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      <ContactModal
        isOpen={isOpen}
        entryId={entryId}
        context={context}
        onClose={handleClose}
      />
    </ContactModalContext.Provider>
  );
}

export function useContactModal(): ContactModalContextValue {
  const context = useContext(ContactModalContext);

  if (!context) {
    throw new Error(
      "useContactModal must be used within a ContactModalProvider component",
    );
  }

  return context;
}
