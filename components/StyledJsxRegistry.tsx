'use client';

import { useState, type ReactNode } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';

/**
 * Collects the styled-jsx rules each page renders on the server and writes
 * them into the HTML, so the first paint is styled and the browser does not
 * have to inject every <style jsx> block after hydration. The App Router
 * does not do this by itself (the Pages Router did).
 */
export default function StyledJsxRegistry({ children }: { children: ReactNode }) {
  const [registry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = registry.styles();
    registry.flush();
    return <>{styles}</>;
  });

  return <StyleRegistry registry={registry}>{children}</StyleRegistry>;
}
