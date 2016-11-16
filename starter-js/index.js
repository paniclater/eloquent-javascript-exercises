const one = (x) => {
  console.trace();
  return x + x;
}

const two = (x) => {
  const y = one(x);
  return y * y;
}

const three = (x) => {
  console.trace();
  const y = one(two(x + 5));
  return y / 2;
}

console.log(one(5));
console.log(two(15));
console.log(three(25));
