"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { useCallback } from "react";

type SmoothScrollLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  targetId: string;
};

export function SmoothScrollLink({
  targetId,
  onClick,
  ...props
}: SmoothScrollLinkProps) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) {
        return;
      }

      const element = document.getElementById(targetId);
      if (!element) {
        return;
      }

      event.preventDefault();
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      const nextHash = `#${targetId}`;
      if (window.location.hash !== nextHash) {
        window.history.pushState(null, "", nextHash);
      }
    },
    [onClick, targetId],
  );

  return <a {...props} href={`#${targetId}`} onClick={handleClick} />;
}
