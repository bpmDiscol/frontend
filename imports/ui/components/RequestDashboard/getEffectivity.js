export default function getEffectivity(effectiveList = []) {
  if (!effectiveList.length) return "Aun sin data";
  const effectives = effectiveList.filter((value) => value === "effective");
  return (effectives.length / effectiveList.length) * 100;
}
