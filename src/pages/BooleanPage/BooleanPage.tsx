import { FC, useMemo, useState } from 'react';
import { bindStyles } from '@/utils';
import styles from './BooleanPage.module.scss';
import WaveBackground, { WaveBackgroundVariant } from '@/components/WaveBackground/WaveBackground.tsx';

const cx = bindStyles(styles);

export enum BooleanConstructorVariants {
  OR = 'or',
  AND = 'and',
  NOT = 'not',
}

export enum BooleanConstructorValueVariants {
  TRUE = 'true',
  FALSE = 'false',
}

export enum BooleanConstructorBracketsVariants {
  LEFT = '(',
  RIGHT = ')',
}

const isValue = (token: string) =>
  token === BooleanConstructorValueVariants.TRUE || token === BooleanConstructorValueVariants.FALSE;

const isOperator = (token: string) =>
  token === BooleanConstructorVariants.AND || token === BooleanConstructorVariants.OR;

const isNot = (token: string) => token === BooleanConstructorVariants.NOT;

const isLeftBracket = (token: string) => token === BooleanConstructorBracketsVariants.LEFT;
const isRightBracket = (token: string) => token === BooleanConstructorBracketsVariants.RIGHT;

function canAddToken(prev: string[], next: string): boolean {
  const last = prev[prev.length - 1];

  // Подсчёт баланса скобок
  const leftCount = prev.filter(isLeftBracket).length;
  const rightCount = prev.filter(isRightBracket).length;

  if (isValue(next)) {
    // Правила для значений
    // Не может идти значение сразу за другим значением без оператора
    if (last && isValue(last)) return false;
    // Не может идти значение сразу за закрывающей скобкой без оператора
    if (last && isRightBracket(last)) return false;
    // В остальных случаях — нормально
    return true;
  }

  if (isOperator(next)) {
    // Оператор не может идти первым
    if (!last) return false;
    // Оператор не может идти после '('
    if (last && isLeftBracket(last)) return false;
    // Оператор не может идти после другого оператора (кроме not, но not у нас тут отдельно)
    if (last && (isOperator(last))) return false;
    // Может идти после значения или закрывающей скобки
    if (last && (isValue(last) || isRightBracket(last))) return true;

    // Если ничего не подошло
    return false;
  }

  if (isNot(next)) {
    // NOT может идти в начале
    if (!last) return true;
    // NOT может идти после оператора или после '('
    if (last && (isOperator(last) || isLeftBracket(last) || isNot(last))) return true;
    // NOT не может идти сразу после значения или ')', нужен оператор
    if (last && (isValue(last) || isRightBracket(last))) return false;

    return false;
  }

  if (isLeftBracket(next)) {
    // '(' может идти в начале
    if (!last) return true;
    // '(' может идти после оператора или 'not'
    if (last && (isOperator(last) || isNot(last) || isLeftBracket(last))) return true;
    // '(' не может идти сразу после значения или ')' без оператора
    if (last && (isValue(last) || isRightBracket(last))) return false;

    return false;
  }

  if (isRightBracket(next)) {
    // ')' может идти только если есть открытая скобка, которую можно закрыть
    if (leftCount <= rightCount) return false;
    // ')' может идти только после значения или другой ')'
    if (last && (isValue(last) || isRightBracket(last))) return true;
    // Нельзя закрывать сразу после оператора или '('
    if (last && (isOperator(last) || isNot(last) || isLeftBracket(last))) return false;

    return false;
  }

  return false; // неизвестный токен
}

function precedence(op: string): number {
  // Приоритет операторов
  // NOT имеет самый высокий приоритет
  // AND ниже NOT
  // OR ниже AND
  switch (op) {
    case BooleanConstructorVariants.NOT:
      return 3;
    case BooleanConstructorVariants.AND:
      return 2;
    case BooleanConstructorVariants.OR:
      return 1;
    default:
      return 0;
  }
}

function toPostfix(tokens: string[]): string[] {
  const output: string[] = [];
  const stack: string[] = [];

  for (const token of tokens) {
    if (isValue(token)) {
      output.push(token);
    } else if (isOperator(token) || isNot(token)) {
      while (
        stack.length > 0 &&
        (isOperator(stack[stack.length - 1]) || isNot(stack[stack.length - 1])) &&
        precedence(stack[stack.length - 1]) >= precedence(token)
        ) {
        output.push(stack.pop()!);
      }
      stack.push(token);
    } else if (isLeftBracket(token)) {
      stack.push(token);
    } else if (isRightBracket(token)) {
      while (stack.length > 0 && !isLeftBracket(stack[stack.length - 1])) {
        output.push(stack.pop()!);
      }
      stack.pop(); // убрать '('
    }
  }

  // Попытка вынести оставшееся
  while (stack.length > 0) {
    const top = stack.pop()!;
    if (isLeftBracket(top) || isRightBracket(top)) {
      throw new Error('Неверное количество скобок');
    }
    output.push(top);
  }

  return output;
}

function evaluatePostfix(postfix: string[]): boolean {
  const stack: boolean[] = [];

  for (const token of postfix) {
    if (isValue(token)) {
      stack.push(token === BooleanConstructorValueVariants.TRUE);
    } else if (isOperator(token)) {
      if (stack.length < 2) throw new Error('Недостаточно операндов для оператора');
      const b = stack.pop()!;
      const a = stack.pop()!;
      let result: boolean;
      switch (token) {
        case BooleanConstructorVariants.AND:
          result = a && b;
          break;
        case BooleanConstructorVariants.OR:
          result = a || b;
          break;
        default:
          throw new Error('Неизвестный оператор ' + token);
      }
      stack.push(result);
    } else if (isNot(token)) {
      if (stack.length < 1) throw new Error('Недостаточно операндов для not');
      const a = stack.pop()!;
      stack.push(!a);
    }
  }

  if (stack.length !== 1) {
    throw new Error('Некорректное выражение');
  }

  return stack[0];
}

function evaluateExpression(tokens: string[]): boolean {
  const postfix = toPostfix(tokens);
  return evaluatePostfix(postfix);
}

export const BooleanPage: FC = () => {
  const [expressionArr, setExpressionArr] = useState<string[]>([]);

  const handleAdd = (expressionEl: string) => {
    if (canAddToken(expressionArr, expressionEl)) {
      setExpressionArr(prev => [...prev, expressionEl]);
    } else {
      // Здесь можно добавить логику отображения ошибки,
      // например, всплывающую подсказку или сообщение:
      console.warn('Невалидная последовательность токенов');
    }
  }

  const result = useMemo(() => {
    try {
      const res = evaluateExpression(expressionArr);
      return res ? 'true' : 'false';
    } catch (e) {
      return null;
    }
  }, [expressionArr]);

  const variant = useMemo(() => {
    if (!result) {
      return WaveBackgroundVariant.NEUTRAL
    }

    if (result === 'true') {
      return WaveBackgroundVariant.GOOD
    } else {
      return WaveBackgroundVariant.BAD
    }

  }, [result]);

  return (
    <div className={cx('container')}>
      <WaveBackground text={result || '...'} variant={variant}>
        <div className={cx('expression-wrapper')}>
          <div className={cx('expression')}>{expressionArr.join(' ')}</div>
          <button className={cx('button', 'clear')} onClick={() => setExpressionArr(prev => prev.slice(0, prev.length - 1))}>
            Удалить
          </button>
          <button className={cx('button', 'clear')} onClick={() => setExpressionArr([])}>
            Очистить
          </button>
        </div>
        <div className={cx('controls')}>
          {Object.values(BooleanConstructorValueVariants).map(value => (
            <button key={value} className={cx('button', 'bool', value)} onClick={() => handleAdd(value)}>
              {value}
            </button>
          ))}
          {Object.values(BooleanConstructorVariants).map(value => (
            <button key={value} className={cx('button', 'operator')} onClick={() => handleAdd(value)}>
              {value}
            </button>
          ))}
          {Object.values(BooleanConstructorBracketsVariants).map(value => (
            <button key={value} className={cx('button', 'bracket')} onClick={() => handleAdd(value)}>
              {value}
            </button>
          ))}
        </div>
      </WaveBackground>
    </div>
  )
}
