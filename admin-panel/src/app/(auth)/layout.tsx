/**
 * Auth Layout
 *
 * Simple layout wrapper for authentication pages (login).
 * No sidebar or navigation — just the centered form.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
