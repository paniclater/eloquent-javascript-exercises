//looping a triangle - write a lop that makes seven calls to console.log to output the vollowing triangle:
//#
//##
//###
//####
//#####
//######
//#######
let result;

const repeatStringIterative = (times, string) => {
  let result = '';

  for (x = 0; x < times; x++) {
    result += string.repeat(x + 1) + '\n';
  }

  return result;
}

result = repeatStringIterative(5, '#');
console.log(result);

const repeatStringRecursive = (times, string, result) => {
  if (times == 0) {
    return result;
  } else {
    return repeatStringRecursive(times - 1, string, string.repeat(times) + '\n' + result );
  }
}

result = repeatStringRecursive(5, '#', '');
console.log(result);


//fizzbuzz -- print numbers from 1 - 100, if the number is divisible by 3 -> 'fizz', 5 -> 'buzz', both -> 'fizzbuzz'
const fizzBuzzIterative = (times) => {
  let result = '';
  for (x = 1; x <= times; x++) {
    if (x % 5 === 0 && x % 3 === 0) {
      result += 'fizzbuzz\n'; 
    } else if (x % 3 === 0) {
      result += 'fizz\n';
    } else if (x % 5 === 0) {
      result += 'buzz\n';
    } else {
      result += x + '\n'
    }  
  }
  return result;
}

//result = fizzBuzzIterative(100);
//console.log(result);

const fizzBuzzRecursive = (times, result = '', count = 1) => {
  if (times === 0) {
    return result;
  } else {
    if (count % 5 === 0 && count % 3 === 0) {
      return fizzBuzzRecursive(times - 1, result + 'fizzbuzz\n', count + 1);
    } else if (count % 3 === 0) {
      return fizzBuzzRecursive(times - 1, result + 'fizz\n', count + 1);
    } else if (count % 5 === 0) {
      return fizzBuzzRecursive(times - 1, result + 'buzz\n', count + 1);
    } else {
      return fizzBuzzRecursive(times - 1, result + count + '\n', count + 1);
    }
  }
}

result = fizzBuzzRecursive(20);
console.log(result);


