export function sonIguales(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    let sorted_a = [...a].sort();
    let sorted_b = [...b].sort();
    return (
      sorted_a.length === sorted_b.length &&
      sorted_a.every((element, index) => element === sorted_b[index])
    );
  }