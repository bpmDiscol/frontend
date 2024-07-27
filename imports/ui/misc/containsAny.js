export default function containsAny(memberships1, memberships2) {
  // Convertir los arrays de arrays a conjuntos de tuplas para una búsqueda eficiente
  const set1 = new Set(memberships1.map((m) => m.join(",")));
  const set2 = new Set(memberships2.map((m) => m.join(",")));

  // Verificar si hay alguna intersección entre los dos conjuntos
  for (const member of set2) {
    if (set1.has(member)) {
      return true;
    }
  }

  return false;
}
