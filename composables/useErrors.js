export function useErrors() {
  return useState("errors", () => 0);
}
