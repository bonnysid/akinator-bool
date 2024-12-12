import { FC, useState } from 'react';
import styles from './ExpressionPage.module.scss'
import { bindStyles } from '@/utils';
import WaveBackground from '@/components/WaveBackground/WaveBackground.tsx';

const cx = bindStyles(styles);

type TokenType = 'VAR' | 'NOT' | 'AND' | 'OR' | 'IMP' | 'EQUIV' | 'LPAREN' | 'RPAREN';

interface Token {
  type: TokenType;
  value: string;
}

// Перечень операторов, переменных и скобок для кнопок
const VARIABLES = ['A', 'B', 'C'];
const OPERATORS = [
  { type: 'AND', value: '&', text: 'and' },
  { type: 'OR', value: '|', text: 'or' },
  { type: 'IMP', value: '->' },
  { type: 'EQUIV', value: '<->' },
  { type: 'NOT', value: '!', text: 'not' },
];
const BRACKETS = [
  { type: 'LPAREN', value: '(' },
  { type: 'RPAREN', value: ')' },
];

// ===== Логика проверки корректности последовательности токенов =====

function isValueToken(t: Token): boolean {
  return t.type === 'VAR';
}

function isOperatorToken(t: Token): boolean {
  return t.type === 'AND' || t.type === 'OR' || t.type === 'IMP' || t.type === 'EQUIV';
}

function isNotToken(t: Token): boolean {
  return t.type === 'NOT';
}

function isLeftParen(t: Token): boolean {
  return t.type === 'LPAREN';
}

function isRightParen(t: Token): boolean {
  return t.type === 'RPAREN';
}

function canAddToken(prev: Token[], next: Token): boolean {
  const last = prev[prev.length - 1];

  const leftCount = prev.filter(isLeftParen).length;
  const rightCount = prev.filter(isRightParen).length;

  if (isValueToken(next)) {
    if (last && (isValueToken(last) || isRightParen(last))) return false;
    return true;
  }

  if (isOperatorToken(next)) {
    if (!last) return false;
    if (last && (isOperatorToken(last) || isNotToken(last) || isLeftParen(last))) return false;
    if (last && (isValueToken(last) || isRightParen(last))) return true;
    return false;
  }

  if (isNotToken(next)) {
    // NOT может идти в начале или после оператора или после '(' или после другого NOT
    if (!last) return true;
    if (last && (isOperatorToken(last) || isNotToken(last) || isLeftParen(last))) return true;
    if (last && (isValueToken(last) || isRightParen(last))) return false;
    return false;
  }

  if (isLeftParen(next)) {
    if (!last) return true;
    if (last && (isOperatorToken(last) || isNotToken(last) || isLeftParen(last))) return true;
    if (last && (isValueToken(last) || isRightParen(last))) return false;
    return false;
  }

  if (isRightParen(next)) {
    if (leftCount <= rightCount) return false;
    if (last && (isValueToken(last) || isRightParen(last))) return true;
    return false;
  }

  return false;
}

// ===== Парсер и преобразования (как в предыдущем примере) =====

type Expr =
  | { type: 'var'; name: string }
  | { type: 'not'; expr: Expr }
  | { type: 'and'; left: Expr; right: Expr }
  | { type: 'or'; left: Expr; right: Expr }
  | { type: 'imp'; left: Expr; right: Expr }
  | { type: 'equiv'; left: Expr; right: Expr };

function tokenizeForParser(tokens: Token[]): string[] {
  return tokens.map(t => t.value);
}

function parseExpr(tokens: string[]): Expr {
  let pos = 0;

  function peek(): string | undefined {
    return tokens[pos];
  }

  function consume(tok?: string): string {
    const current = tokens[pos++];
    if (tok && current !== tok) {
      throw new Error(`Ожидался токен '${tok}', но встречен '${current}'`);
    }
    return current;
  }

  function parsePrimary(): Expr {
    const t = peek();
    if (!t) throw new Error('Неожиданный конец');
    if (t === '(') {
      consume('(');
      const e = parseLogical();
      consume(')');
      return e;
    }
    if (t === '!') {
      consume('!');
      return { type: 'not', expr: parsePrimary() };
    }
    // Переменная
    if (/^[A-Za-z0-9]+$/.test(t)) {
      consume();
      return { type: 'var', name: t };
    }
    throw new Error('Неожиданный токен ' + t);
  }

  function parseAnd(): Expr {
    let expr = parsePrimary();
    while (peek() === '&') {
      consume('&');
      const right = parsePrimary();
      expr = { type: 'and', left: expr, right };
    }
    return expr;
  }

  function parseOr(): Expr {
    let expr = parseAnd();
    while (peek() === '|') {
      consume('|');
      const right = parseAnd();
      expr = { type: 'or', left: expr, right };
    }
    return expr;
  }

  function parseImplication(): Expr {
    let expr = parseOr();
    while (peek() === '->') {
      consume('->');
      const right = parseOr();
      expr = { type: 'imp', left: expr, right };
    }
    return expr;
  }

  function parseEquiv(): Expr {
    let expr = parseImplication();
    while (peek() === '<->') {
      consume('<->');
      const right = parseImplication();
      expr = { type: 'equiv', left: expr, right };
    }
    return expr;
  }

  function parseLogical(): Expr {
    return parseEquiv();
  }

  return parseLogical();
}

function removeImplications(expr: Expr): Expr {
  switch (expr.type) {
    case 'var':
      return expr;
    case 'not':
      return { type: 'not', expr: removeImplications(expr.expr) };
    case 'and':
      return { type: 'and', left: removeImplications(expr.left), right: removeImplications(expr.right) };
    case 'or':
      return { type: 'or', left: removeImplications(expr.left), right: removeImplications(expr.right) };
    case 'imp':
      // A -> B = !A | B
      return {
        type: 'or',
        left: { type: 'not', expr: removeImplications(expr.left) },
        right: removeImplications(expr.right),
      };
    case 'equiv':
      return { type: 'and', left: {
          type: 'or',
          left: { type: 'not', expr: removeImplications(expr.left) },
          right: removeImplications(expr.right)
        }, right: {
          type: 'or',
          left: { type: 'not', expr: removeImplications(expr.right) },
          right: removeImplications(expr.left)
        } };
  }
}

function pushNegations(expr: Expr): Expr {

  switch (expr.type) {
    case 'var':
      return expr;
    case 'and':
      return { type: 'and', left: pushNegations(expr.left), right: pushNegations(expr.right) };
    case 'or':
      return { type: 'or', left: pushNegations(expr.left), right: pushNegations(expr.right) };
    case 'not':
      if (expr.expr.type === 'not') {
        return pushNegations(expr.expr.expr);
      }
      if (expr.expr.type === 'and') {
        return {
          type: 'or',
          left: pushNegations({ type: 'not', expr: expr.expr.left }),
          right: pushNegations({ type: 'not', expr: expr.expr.right }),
        };
      }
      if (expr.expr.type === 'or') {
        return {
          type: 'and',
          left: pushNegations({ type: 'not', expr: expr.expr.left }),
          right: pushNegations({ type: 'not', expr: expr.expr.right }),
        };
      }
      if (expr.expr.type === 'var') return expr;
      throw new Error('Неожиданный тип после удаления импликаций: ' + expr.expr.type);
    default:
      return expr;
  }
}

function toCNF(expr: Expr): Expr {
  switch (expr.type) {
    case 'var':
    case 'not':
      return expr;
    case 'and':
      return { type: 'and', left: toCNF(expr.left), right: toCNF(expr.right) };
    case 'or':
      return distributeOrOverAnd(toCNF(expr.left), toCNF(expr.right));
    default:
      throw new Error('Неожиданный тип выражения при формировании КНФ');
  }
}

function distributeOrOverAnd(a: Expr, b: Expr): Expr {
  if (a.type === 'and') {
    return {
      type: 'and',
      left: distributeOrOverAnd(a.left, b),
      right: distributeOrOverAnd(a.right, b)
    };
  }
  if (b.type === 'and') {
    return {
      type: 'and',
      left: distributeOrOverAnd(a, b.left),
      right: distributeOrOverAnd(a, b.right)
    };
  }
  return { type: 'or', left: a, right: b };
}

function toDNF(expr: Expr): Expr {
  switch (expr.type) {
    case 'var':
    case 'not':
      return expr;
    case 'or':
      return { type: 'or', left: toDNF(expr.left), right: toDNF(expr.right) };
    case 'and':
      return distributeAndOverOr(toDNF(expr.left), toDNF(expr.right));
    default:
      throw new Error('Неожиданный тип выражения при формировании ДНФ');
  }
}

function distributeAndOverOr(a: Expr, b: Expr): Expr {
  if (a.type === 'or') {
    return {
      type: 'or',
      left: distributeAndOverOr(a.left, b),
      right: distributeAndOverOr(a.right, b)
    };
  }
  if (b.type === 'or') {
    return {
      type: 'or',
      left: distributeAndOverOr(a, b.left),
      right: distributeAndOverOr(a, b.right)
    };
  }
  return { type: 'and', left: a, right: b };
}

function exprToString(expr: Expr): string {
  switch (expr.type) {
    case 'var':
      return expr.name;
    case 'not':
      return '!' + exprToString(expr.expr);
    case 'and':
      return '(' + exprToString(expr.left) + ' & ' + exprToString(expr.right) + ')';
    case 'or':
      return '(' + exprToString(expr.left) + ' | ' + exprToString(expr.right) + ')';
    default:
      throw new Error('Неизвестный тип в финальной стадии: ' + expr.type);
  }
}

// ===== Компонент =====

export const ExpressionPage: FC = () => {
  const [expressionArr, setExpressionArr] = useState<Token[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleAdd = (token: Token) => {
    if (canAddToken(expressionArr, token)) {
      setExpressionArr(prev => [...prev, token]);
      setResult(null);
    } else {
      console.warn('Невалидная последовательность токенов');
    }
  }

  const handleRemove = () => {
    setExpressionArr(prev => prev.slice(0, prev.length - 1));
    setResult(null);
  }

  const handleClear = () => {
    setExpressionArr([]);
    setResult(null);
  }

  const handleToCNF = () => {
    try {
      const rawTokens = tokenizeForParser(expressionArr);
      const parsed = parseExpr(rawTokens);
      const noImp = removeImplications(parsed);
      const pushed = pushNegations(noImp);
      const cnf = toCNF(pushed);
      setResult(exprToString(cnf));
    } catch (e: any) {
      console.error(e);
      setResult('Ошибка: ' + e.message);
    }
  }

  const handleToDNF = () => {
    try {
      const rawTokens = tokenizeForParser(expressionArr);
      const parsed = parseExpr(rawTokens);
      const noImp = removeImplications(parsed);
      const pushed = pushNegations(noImp);
      const dnf = toDNF(pushed);
      setResult(exprToString(dnf));
    } catch (e: any) {
      console.error(e);
      setResult('Ошибка: ' + e.message);
    }
  }

  return (
    <div className={cx('container')}>
      <WaveBackground text={result || '...'}>
        <div className={cx('expression-wrapper')}>
          <div className={cx('expression')}>
            {expressionArr.map((t, i) => t.value + (i < expressionArr.length - 1 ? ' ' : '')).join('')}
          </div>
          <button className={cx('button', 'clear')} onClick={handleRemove}>
            Удалить
          </button>
          <button className={cx('button', 'clear')} onClick={handleClear}>
            Очистить
          </button>
        </div>
        <div className={cx('controls')}>
          {VARIABLES.map((value) => (
            <button key={value} className={cx('button', 'bool')} onClick={() => handleAdd({ type: 'VAR', value })}>
              {value}
            </button>
          ))}
          {OPERATORS.map(o => (
            <button key={o.value} className={cx('button', 'operator')} onClick={() => handleAdd({ type: o.type as TokenType, value: o.value })}>
              {o.text || o.value}
            </button>
          ))}
          {BRACKETS.map(b => (
            <button key={b.value} className={cx('button', 'bracket')} onClick={() => handleAdd({ type: b.type as TokenType, value: b.value })}>
              {b.value}
            </button>
          ))}
        </div>
        <div className={cx('controls')}>
          <button className={cx('button', 'operator')} onClick={handleToCNF}>Преобразовать в КНФ</button>
          <button className={cx('button', 'operator')} onClick={handleToDNF}>Преобразовать в ДНФ</button>
        </div>
      </WaveBackground>
    </div>
  );
};
