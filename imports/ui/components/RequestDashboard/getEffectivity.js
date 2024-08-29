export default function getEffectivity(effectiveList = []) {
  if (!effectiveList.length) return "Sin datos";
  const effectives = effectiveList.filter((value) => value === "effective");
  return (effectives.length / effectiveList.length) * 100;
}
