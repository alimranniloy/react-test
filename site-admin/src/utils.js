export function square(number) {
  return number * number;
}
// divmod
function divmod(num, base) {
    return [num / base, num % base]
}
// encode 
export function encodeId(numeric_id, alphabet) {
    let v = [];
    if (alphabet == null) {
        alphabet = "LceIyBZ3zTE4dPAhlFDRn8aMiuKg5x21JWXCQ7otGOHYU0mfVvS6bsrqj9wkNp";
    };
    let base = alphabet.length;
    let n = numeric_id;
    while (true){
        const [a, r] = divmod(n, base);
        n = a;
        let c = alphabet.charAt(r);
        if (c) {
            v.push(c)
        }
        if (Math.floor(n) == 0) {
            break;
        }
    }
    return v.reverse().join('');
}
// decode
export function decodeId(string_id, alphabet) {
    if (alphabet == null) {
        alphabet = "LceIyBZ3zTE4dPAhlFDRn8aMiuKg5x21JWXCQ7otGOHYU0mfVvS6bsrqj9wkNp";
    };
    let base = alphabet.length;
    let n = 0;
    for (const c of Array.from(string_id)) {
        let p = alphabet.indexOf(c);
        if (p) {
            n = n * base + p;
        }
    }
    return n;
}