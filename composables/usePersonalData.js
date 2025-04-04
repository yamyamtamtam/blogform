export function usePersonalData() {
  const errors = useErrors();
  //メッセージ用
  const endMessage = useEndMessage();

  //フォームを出して良いかどうか
  const personalData = useState("personalData", () => true);
  return {
    personalData,
  };
}
