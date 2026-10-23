const vocabulary = {
  en: "about after afternoon again all apple appointment bathroom bed before book breakfast brother bus calm car care chair class clean cold dinner doctor drink eat evening family feel food friend game go good happy help home hospital hot hungry juice kind learn like listen lunch milk morning mother movie music need night no outside pain park play please pool read rest restaurant rice school shop sister sleep snack soccer sorry stop swim swimming take teacher thank thirsty time tired today tomorrow travel walk want wash water week yes".split(" "),
  ko: "가족 감사해요 괜찮아요 공부 공원 공책 공놀이 과일 기분 내일 네 눈 다리 더 도와주세요 동생 따뜻해요 마시다 마셔요 먹다 먹어요 물 바나나 밥 배고파요 버스 병원 볼 아침 아파요 아니요 안녕하세요 약 오늘 오후 우유 운동 음악 의사 의자 읽어요 자동차 자요 저녁 점심 좋아요 주세요 주스 집 책 친구 학교 행복해요 화장실 휴식 수영 수영장 식당 시간 여행 축구 피곤해요".split(" "),
};

export function wordSuggestions(text: string, caret: number, language: "en" | "ko") {
  const before = text.slice(0, caret);
  const fragment = before.match(/[\p{L}\p{M}]+$/u)?.[0] ?? "";
  if (!fragment) return [];
  const prefix = fragment.toLocaleLowerCase();
  const words = /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/u.test(fragment) ? vocabulary.ko : vocabulary[language];
  return words.filter(word => word.startsWith(prefix) && word !== prefix).slice(0, 5)
    .map(word => /^[A-Z]/.test(fragment) ? word[0]?.toUpperCase() + word.slice(1) : word);
}

export function insertSuggestedWord(text: string, caret: number, word: string) {
  const before = text.slice(0, caret);
  const fragment = before.match(/[\p{L}\p{M}]+$/u)?.[0] ?? "";
  const after = text.slice(caret);
  const remainingWord = after.match(/^[\p{L}\p{M}]+/u)?.[0] ?? "";
  const start = caret - fragment.length;
  return { text: text.slice(0, start) + word + after.slice(remainingWord.length), caret: start + word.length };
}