export function useLoader() {
  return useState("loader", () => false);
}
