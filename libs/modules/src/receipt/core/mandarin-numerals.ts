type Token = { numeral: string; unit: string };

export function toMandarinNumerals(num: number) {
  let result = '';

  const tokens = tokenize(num);

  for (let i = 0; i < tokens.length; i++) {
    result += parse(tokens[i], i, tokens);
  }

  if (result === '') {
    return '零圓整';
  }

  return result + '圓整';
}

function parse(value: Token, index: number, array: Token[]) {
  if (value.numeral !== '零') {
    return value.numeral + value.unit;
  }

  if (value.unit === '億') {
    return value.unit;
  }

  if (value.unit === '萬') {
    if (index < 3) {
      return value.unit;
    }

    // handle consecutive zeros
    if (
      !(
        array[index - 1].numeral === '零' &&
        array[index - 2].numeral === '零' &&
        array[index - 3].numeral === '零'
      )
    ) {
      return value.unit;
    }

    // 100050000: 3 zeros before and 1 zero after
    if (array[index + 1].numeral !== '零') {
      return '零';
    }

    return '';
  }

  // handle consecutive zeros
  const next = array[index + 1];
  if (next?.numeral === '零') {
    return '';
  }

  // handle units digit
  if (value.unit === '') {
    return '';
  }

  return value.numeral;
}

function tokenize(num: number) {
  const numerals = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
  const units = [
    '',
    '拾',
    '佰',
    '仟',
    '萬',
    '拾',
    '佰',
    '仟',
    '億',
    '拾',
    '佰',
  ];

  const digits = num.toString();

  if (digits.length > units.length) {
    throw new Error('Number exceeds maximum supported digits');
  }

  const slots = units.slice(0, digits.length);

  const tokens: Token[] = [];

  for (let i = 0; i < digits.length; i++) {
    const digit = Number.parseInt(digits[i], 10);

    const char = numerals[digit];
    const unit = slots.pop() ?? '';

    tokens.push({ numeral: char, unit });
  }
  return tokens;
}
